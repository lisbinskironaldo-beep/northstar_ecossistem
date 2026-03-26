import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

const projectRoot = join(import.meta.dirname, '..', '..');
const envPath = join(projectRoot, '.env');
const envExamplePath = join(projectRoot, '.env.example');

loadEnvFile(existsSync(envPath) ? envPath : envExamplePath);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required before running the Echo demo seed');
}

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const demoEmail = 'demo@northstar.local';
  const demoHandle = 'echo-demo';
  const demoDisplayName = 'Echo Demo';
  const defaultCategories = [
    { slug: 'lo-fi', displayName: 'Lo-fi', rankOrder: 10 },
    { slug: 'trap', displayName: 'Trap', rankOrder: 20 },
    { slug: 'electronic', displayName: 'Electronic', rankOrder: 30 },
    { slug: 'ambient', displayName: 'Ambient', rankOrder: 40 },
    { slug: 'dark', displayName: 'Dark', rankOrder: 50 },
    { slug: 'pop-ia', displayName: 'Pop IA', rankOrder: 60 },
    { slug: 'instrumental', displayName: 'Instrumental', rankOrder: 70 },
    { slug: 'experimental', displayName: 'Experimental', rankOrder: 80 },
  ];

  let user = await prisma.user.findUnique({
    where: { email: demoEmail },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: demoEmail,
        accountStatus: 'active',
        country: 'BR',
        preferredLanguage: 'pt-BR',
        createdAt: new Date(),
        lastActiveAt: new Date(),
        trustLevel: 'trusted',
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  let creator = await prisma.creatorProfile.findUnique({
    where: { handle: demoHandle },
    select: {
      id: true,
      handle: true,
      userId: true,
    },
  });

  if (!creator) {
    creator = await prisma.creatorProfile.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        displayName: demoDisplayName,
        handle: demoHandle,
        bio: 'Demo creator profile for Echo shell testing.',
        creatorStatus: 'active',
        creatorTier: 'new',
        primaryFront: 'echo',
        createdAt: new Date(),
      },
      select: {
        id: true,
        handle: true,
        userId: true,
      },
    });
  }

  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        productSurface: 'echo',
        displayName: category.displayName,
        activeFlag: true,
        rankOrder: category.rankOrder,
      },
      create: {
        id: randomUUID(),
        productSurface: 'echo',
        slug: category.slug,
        displayName: category.displayName,
        activeFlag: true,
        rankOrder: category.rankOrder,
      },
    });
  }

  const category = await prisma.category.findFirst({
    where: { productSurface: 'echo' },
    orderBy: { rankOrder: 'asc' },
    select: { id: true, displayName: true },
  });

  const existingTracks = await prisma.contentItem.count({
    where: {
      creatorId: creator.id,
      productSurface: 'echo',
      contentType: 'track',
    },
  });

  if (existingTracks === 0) {
    const demoTracks = [
      {
        title: 'City Lights Prototype',
        artistNameDisplay: demoDisplayName,
        description: 'Seed track for local Echo verification.',
      },
      {
        title: 'Night Drive Signal',
        artistNameDisplay: demoDisplayName,
        description: 'Second seed track for save and playback verification.',
      },
    ];

    for (const track of demoTracks) {
      await prisma.contentItem.create({
        data: {
          id: randomUUID(),
          creatorId: creator.id,
          productSurface: 'echo',
          contentType: 'track',
          contentState: 'published',
          visibilityState: 'visible',
          trustState: 'normal',
          title: track.title,
          description: track.description,
          primaryCategoryId: category?.id,
          createdAt: new Date(),
          publishedAt: new Date(),
          track: {
            create: {
              id: randomUUID(),
              artistNameDisplay: track.artistNameDisplay,
              aiDeclaration: true,
              sourceToolOptional: 'seed-script',
            },
          },
        },
      });
    }

    await prisma.creatorProfile.update({
      where: { id: creator.id },
      data: {
        publishedContentCountCached: demoTracks.length,
      },
    });
  }

  console.log('');
  console.log('Echo demo seed ready');
  console.log(`DEMO_USER_ID=${user.id}`);
  console.log(`DEMO_CREATOR_ID=${creator.id}`);
  console.log('Add these values to .env for shell testing:');
  console.log(`EXPO_PUBLIC_DEMO_USER_ID="${user.id}"`);
  console.log(`EXPO_PUBLIC_DEMO_CREATOR_ID="${creator.id}"`);
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
