import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { randomUUID } from 'node:crypto';

const projectRoot = join(import.meta.dirname, '..', '..');
const envPath = join(projectRoot, '.env');
const envExamplePath = join(projectRoot, '.env.example');

loadEnvFile(existsSync(envPath) ? envPath : envExamplePath);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required before running an Echo batch seed');
}

const manifestArg = process.argv[2];
const manifestPath = manifestArg
  ? resolve(process.cwd(), manifestArg)
  : join(projectRoot, 'scripts', 'seed', 'manifests', 'echo-batch-01.json');

if (!existsSync(manifestPath)) {
  throw new Error(`Seed manifest not found: ${manifestPath}`);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const surface = manifest.surface ?? 'echo';
  const createdUsers = [];
  const createdCreators = [];
  const createdTracks = [];
  let createdAssets = 0;
  const skippedTracks = [];

  for (const category of manifest.categories ?? []) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        productSurface: surface,
        displayName: category.displayName,
        activeFlag: true,
        rankOrder: category.rankOrder ?? 0,
      },
      create: {
        id: randomUUID(),
        productSurface: surface,
        slug: category.slug,
        displayName: category.displayName,
        activeFlag: true,
        rankOrder: category.rankOrder ?? 0,
      },
    });
  }

  const categories = await prisma.category.findMany({
    where: {
      productSurface: surface,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  const categoryMap = new Map(categories.map((category) => [category.slug, category.id]));

  for (const [creatorIndex, creatorEntry] of (manifest.creators ?? []).entries()) {
    let user = await prisma.user.findUnique({
      where: { email: creatorEntry.email },
      select: { id: true, email: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: randomUUID(),
          email: creatorEntry.email,
          accountStatus: 'active',
          country: creatorEntry.country ?? manifest.defaultCountry ?? 'BR',
          preferredLanguage: creatorEntry.preferredLanguage ?? manifest.defaultLanguage ?? 'pt-BR',
          createdAt: now,
          lastActiveAt: now,
          trustLevel: creatorEntry.trustLevel ?? 'guarded',
        },
        select: { id: true, email: true },
      });

      createdUsers.push(user.email);
    }

    let creator = await prisma.creatorProfile.findUnique({
      where: { handle: creatorEntry.handle },
      select: { id: true, handle: true },
    });

    if (!creator) {
      creator = await prisma.creatorProfile.create({
        data: {
          id: randomUUID(),
          userId: user.id,
          displayName: creatorEntry.displayName,
          handle: creatorEntry.handle,
          bio: creatorEntry.bio,
          creatorStatus: 'active',
          creatorTier: creatorEntry.creatorTier ?? 'new',
          primaryFront: surface,
          createdAt: now,
        },
        select: { id: true, handle: true },
      });

      createdCreators.push(creator.handle);
    }

    for (const [index, trackEntry] of (creatorEntry.tracks ?? []).entries()) {
      const trackAssets = resolveTrackAssets({
        manifest,
        creatorIndex,
        trackIndex: index,
        trackEntry,
      });
      const existingTrack = await prisma.contentItem.findFirst({
        where: {
          creatorId: creator.id,
          productSurface: surface,
          contentType: 'track',
          title: trackEntry.title,
        },
        select: { id: true, title: true },
      });

      if (existingTrack) {
        createdAssets += await ensureTrackAssets({
          prisma,
          contentId: existingTrack.id,
          createdAt: now,
          assets: trackAssets,
        });
        skippedTracks.push(`${creatorEntry.handle}/${trackEntry.title}`);
        continue;
      }

      const categoryId = categoryMap.get(trackEntry.categorySlug);

      if (!categoryId) {
        throw new Error(
          `Category slug "${trackEntry.categorySlug}" not found for track "${trackEntry.title}"`,
        );
      }

      const feedRank = trackEntry.feedRank ?? index + 1;
      const createdAt = new Date(now.getTime() - (feedRank - 1) * 60 * 1000);
      const visibilityState =
        trackEntry.catalogStatus === 'reserve'
          ? 'suppressed'
          : trackEntry.visibilityState ?? 'visible';

      const content = await prisma.contentItem.create({
        data: {
          id: randomUUID(),
          creatorId: creator.id,
          productSurface: surface,
          contentType: 'track',
          contentState: trackEntry.contentState ?? 'published',
          visibilityState,
          trustState: 'normal',
          title: trackEntry.title,
          description: trackEntry.description,
          primaryCategoryId: categoryId,
          createdAt,
          publishedAt: trackEntry.contentState === 'draft' ? null : createdAt,
          track: {
            create: {
              id: randomUUID(),
              artistNameDisplay: trackEntry.artistNameDisplay ?? creatorEntry.displayName,
              accessRoom: trackEntry.accessRoom ?? 'standard',
              explicitFlag: trackEntry.explicitFlag ?? false,
              releaseType: trackEntry.releaseType ?? 'single',
              aiDeclaration: trackEntry.aiDeclaration ?? true,
              sourceToolOptional: trackEntry.sourceToolOptional ?? manifest.batchId,
            },
          },
        },
        select: {
          id: true,
          title: true,
        },
      });

      createdAssets += await ensureTrackAssets({
        prisma,
        contentId: content.id,
        createdAt,
        assets: trackAssets,
      });

      createdTracks.push(`${creatorEntry.handle}/${content.title}`);
    }

    const publishedCount = await prisma.contentItem.count({
      where: {
        creatorId: creator.id,
        productSurface: surface,
        contentType: 'track',
        contentState: 'published',
      },
    });

    await prisma.creatorProfile.update({
      where: { id: creator.id },
      data: {
        publishedContentCountCached: publishedCount,
      },
    });
  }

  const openingCount = await prisma.contentItem.count({
    where: {
      productSurface: surface,
      contentType: 'track',
      contentState: 'published',
      visibilityState: 'visible',
    },
  });

  const reserveCount = await prisma.contentItem.count({
    where: {
      productSurface: surface,
      contentType: 'track',
      contentState: 'published',
      visibilityState: 'suppressed',
    },
  });

  console.log('');
  console.log(`Echo batch seed applied: ${manifest.batchId}`);
  console.log(`Manifest: ${manifestPath}`);
  console.log(`Created users: ${createdUsers.length}`);
  console.log(`Created creators: ${createdCreators.length}`);
  console.log(`Created tracks: ${createdTracks.length}`);
  console.log(`Created assets: ${createdAssets}`);
  console.log(`Skipped tracks: ${skippedTracks.length}`);
  console.log(`Opening visible tracks now: ${openingCount}`);
  console.log(`Reserve suppressed tracks now: ${reserveCount}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const contents = readFileSync(filePath, 'utf8');

  for (const rawLine of contents.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith('#')) {
      continue;
    }

    const [key, ...rest] = line.split('=');
    const value = rest.join('=').trim().replace(/^"|"$/g, '');

    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function resolveTrackAssets({ manifest, creatorIndex, trackIndex, trackEntry }) {
  if (Array.isArray(trackEntry.assets) && trackEntry.assets.length > 0) {
    return trackEntry.assets;
  }

  const assets = [];

  if (Array.isArray(manifest.audioAssetPool) && manifest.audioAssetPool.length > 0) {
    assets.push(manifest.audioAssetPool[(creatorIndex + trackIndex) % manifest.audioAssetPool.length]);
  }

  if (Array.isArray(manifest.previewAssetPool) && manifest.previewAssetPool.length > 0) {
    assets.push(
      manifest.previewAssetPool[(creatorIndex + trackIndex) % manifest.previewAssetPool.length],
    );
  }

  return assets;
}

async function ensureTrackAssets({ prisma, contentId, createdAt, assets }) {
  if (!Array.isArray(assets) || assets.length === 0) {
    return 0;
  }

  const existingAssets = await prisma.contentAsset.findMany({
    where: { contentId },
    select: {
      assetRole: true,
      storageProvider: true,
      storageKey: true,
    },
  });

  let createdCount = 0;

  for (const asset of assets) {
    const duplicate = existingAssets.some(
      (existingAsset) =>
        existingAsset.assetRole === asset.assetRole &&
        existingAsset.storageProvider === asset.storageProvider &&
        existingAsset.storageKey === asset.storageKey,
    );

    if (duplicate) {
      continue;
    }

    await prisma.contentAsset.create({
      data: {
        id: randomUUID(),
        contentId,
        assetRole: asset.assetRole ?? 'audio_stream',
        storageProvider: asset.storageProvider ?? 'local_static',
        storageKey: asset.storageKey,
        mimeType: asset.mimeType ?? 'audio/wav',
        durationMs: asset.durationMs ?? 40000,
        transcodedState: asset.transcodedState ?? 'ready',
        createdAt,
      },
    });

    createdCount += 1;
  }

  return createdCount;
}
