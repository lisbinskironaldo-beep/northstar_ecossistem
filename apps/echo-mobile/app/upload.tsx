import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { EchoCategory, EchoCreator, echoApi } from '../src/lib/api';
import { DemoSetupCard } from '../src/components/demo-setup-card';

export default function UploadScreen() {
  const [creatorId, setCreatorId] = useState(echoApi.demoCreatorId ?? '');
  const [setupEmail, setSetupEmail] = useState('');
  const [setupDisplayName, setSetupDisplayName] = useState('');
  const [setupHandle, setSetupHandle] = useState('');
  const [setupBio, setSetupBio] = useState('');
  const [setupResultMessage, setSetupResultMessage] = useState<string | null>(null);
  const [creatingCreator, setCreatingCreator] = useState(false);
  const [title, setTitle] = useState('');
  const [artistNameDisplay, setArtistNameDisplay] = useState('');
  const [description, setDescription] = useState('');
  const [sourceToolOptional, setSourceToolOptional] = useState('');
  const [primaryCategoryId, setPrimaryCategoryId] = useState('');
  const [aiDeclaration, setAiDeclaration] = useState(true);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [creators, setCreators] = useState<EchoCreator[]>([]);
  const [categories, setCategories] = useState<EchoCategory[]>([]);

  useEffect(() => {
    let active = true;

    async function loadMeta() {
      try {
        const [creatorData, categoryData] = await Promise.all([
          echoApi.getCreators(),
          echoApi.getCategories(),
        ]);

        if (!active) {
          return;
        }

        setCreators(creatorData);
        setCategories(categoryData);

        const resolvedCreator =
          creatorData.find((creator) => creator.id === echoApi.demoCreatorId) ?? creatorData[0];

        if (resolvedCreator) {
          setCreatorId((current) => current || resolvedCreator.id);
          setArtistNameDisplay((current) =>
            current || resolvedCreator.displayName || resolvedCreator.handle,
          );
          setSetupDisplayName((current) => current || resolvedCreator.displayName);
          setSetupHandle((current) => current || resolvedCreator.handle);
          setSetupBio((current) => current || resolvedCreator.bio || '');
        }

        if (categoryData[0]) {
          setPrimaryCategoryId((current) => current || categoryData[0].id);
        }
      } catch (metaError) {
        if (active) {
          setResultMessage(
            metaError instanceof Error
              ? `Unable to load creators/categories: ${metaError.message}`
              : 'Unable to load creators/categories',
          );
        }
      } finally {
        if (active) {
          setLoadingMeta(false);
        }
      }
    }

    loadMeta();

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit() {
    if (!creatorId || !title.trim() || !artistNameDisplay.trim()) {
      setResultMessage('Creator, title and artist name are required.');
      return;
    }

    setSubmitting(true);
    setResultMessage('Submitting...');

    try {
      const track = await echoApi.createTrack({
        creatorId,
        title: title.trim(),
        description: description.trim() || undefined,
        primaryCategoryId: primaryCategoryId || undefined,
        artistNameDisplay: artistNameDisplay.trim(),
        aiDeclaration,
        sourceToolOptional: sourceToolOptional.trim() || undefined,
      });

      setTitle('');
      setDescription('');
      setSourceToolOptional('');
      setResultMessage(`Track created: ${track.title}`);
    } catch (error) {
      setResultMessage(
        error instanceof Error ? `Upload failed: ${error.message}` : 'Upload failed',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreatorSetup() {
    if (!setupEmail.trim() || !setupDisplayName.trim() || !setupHandle.trim()) {
      setSetupResultMessage('Email, display name and handle are required to create a creator.');
      return;
    }

    setCreatingCreator(true);
    setSetupResultMessage('Creating account and creator profile...');

    try {
      const user = await echoApi.registerUser({
        email: setupEmail.trim(),
        country: 'BR',
        preferredLanguage: 'pt-BR',
      });

      const creator = await echoApi.createCreatorProfile({
        userId: user.id,
        displayName: setupDisplayName.trim(),
        handle: setupHandle.trim().replace(/^@+/, ''),
        bio: setupBio.trim() || undefined,
        primaryFront: 'echo',
      });

      const updatedCreators = await echoApi.getCreators();

      setCreators(updatedCreators);
      setCreatorId(creator.id);
      setArtistNameDisplay((current) => current || creator.displayName);
      setSetupResultMessage(`Creator ready: ${creator.displayName} (@${creator.handle})`);
      setSetupEmail('');
      setSetupBio('');
    } catch (setupError) {
      setSetupResultMessage(
        setupError instanceof Error ? setupError.message : 'Unable to create creator profile',
      );
    } finally {
      setCreatingCreator(false);
    }
  }

  if (loadingMeta) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 12 }}>Loading upload metadata...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 24, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '600' }}>Upload</Text>
      <Text style={{ color: '#52525b' }}>
        This screen is wired to the real content API and now loads creator/category metadata.
      </Text>
      <DemoSetupCard
        apiBaseUrl={echoApi.baseUrl}
        demoUserId={echoApi.demoUserId}
        demoCreatorId={echoApi.demoCreatorId}
        showCreator
      />
      <View
        style={{
          borderWidth: 1,
          borderColor: '#dbe4ff',
          borderRadius: 16,
          padding: 16,
          gap: 10,
          backgroundColor: '#f8fbff',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Creator setup</Text>
        <Text style={{ color: '#52525b' }}>
          Caminho minimo do MVP para um novo criador: criar conta, gerar perfil e voltar direto
          para o upload sem depender de seed manual.
        </Text>
        <TextInput
          placeholder="Email do criador"
          value={setupEmail}
          onChangeText={setSetupEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={inputStyle}
        />
        <TextInput
          placeholder="Nome artistico"
          value={setupDisplayName}
          onChangeText={setSetupDisplayName}
          style={inputStyle}
        />
        <TextInput
          placeholder="Handle"
          value={setupHandle}
          onChangeText={setSetupHandle}
          autoCapitalize="none"
          style={inputStyle}
        />
        <TextInput
          placeholder="Bio curta (opcional)"
          value={setupBio}
          onChangeText={setSetupBio}
          multiline
          style={[inputStyle, { minHeight: 72 }]}
        />
        <Pressable
          onPress={handleCreatorSetup}
          disabled={creatingCreator}
          style={{
            backgroundColor: creatingCreator ? '#64748b' : '#0f172a',
            padding: 14,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            {creatingCreator ? 'Criando creator...' : 'Criar conta e perfil de creator'}
          </Text>
        </Pressable>
        {setupResultMessage ? <Text>{setupResultMessage}</Text> : null}
      </View>

      <Text style={sectionTitle}>Choose creator</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {creators.map((creator) => (
          <Pressable
            key={creator.id}
            onPress={() => {
              setCreatorId(creator.id);
              if (!artistNameDisplay.trim()) {
                setArtistNameDisplay(creator.displayName);
              }
            }}
            style={[
              chipStyle,
              creator.id === creatorId ? selectedChipStyle : null,
            ]}
          >
            <Text style={creator.id === creatorId ? selectedChipText : chipText}>
              {creator.displayName}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Creator ID"
        value={creatorId}
        onChangeText={setCreatorId}
        style={inputStyle}
      />
      <TextInput
        placeholder="Track title"
        value={title}
        onChangeText={setTitle}
        style={inputStyle}
      />
      <TextInput
        placeholder="Artist display name"
        value={artistNameDisplay}
        onChangeText={setArtistNameDisplay}
        style={inputStyle}
      />

      <Text style={sectionTitle}>Choose category</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {categories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => setPrimaryCategoryId(category.id)}
            style={[
              chipStyle,
              category.id === primaryCategoryId ? selectedChipStyle : null,
            ]}
          >
            <Text style={category.id === primaryCategoryId ? selectedChipText : chipText}>
              {category.displayName}
            </Text>
          </Pressable>
        ))}
      </View>

      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        style={[inputStyle, { minHeight: 96 }]}
      />
      <TextInput
        placeholder="Source tool (optional)"
        value={sourceToolOptional}
        onChangeText={setSourceToolOptional}
        style={inputStyle}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text>AI declaration</Text>
        <Switch value={aiDeclaration} onValueChange={setAiDeclaration} />
      </View>
      <Pressable
        onPress={handleSubmit}
        disabled={submitting}
        style={{
          backgroundColor: submitting ? '#64748b' : '#111827',
          padding: 14,
          borderRadius: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {submitting ? 'Submitting...' : 'Submit track'}
        </Text>
      </Pressable>
      {resultMessage ? <Text>{resultMessage}</Text> : null}
    </ScrollView>
  );
}

const sectionTitle = {
  fontSize: 16,
  fontWeight: '600' as const,
  marginTop: 8,
};

const inputStyle = {
  borderWidth: 1,
  borderColor: '#d4d4d8',
  borderRadius: 12,
  padding: 12,
};

const chipStyle = {
  borderWidth: 1,
  borderColor: '#cbd5e1',
  borderRadius: 999,
  paddingVertical: 8,
  paddingHorizontal: 12,
};

const selectedChipStyle = {
  backgroundColor: '#111827',
  borderColor: '#111827',
};

const chipText = {
  color: '#334155',
};

const selectedChipText = {
  color: '#f8fafc',
};
