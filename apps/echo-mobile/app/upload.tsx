import { Text } from 'react-native';
import { CreatorStudioPanel } from '../src/components/creator-studio-panel';
import { GlassCard, ScreenScroll, SectionIntro } from '../src/components/mobile-ui';

export default function UploadScreen() {
  return (
    <ScreenScroll>
      <GlassCard tone="soft">
        <SectionIntro
          title="Studio isolado"
          caption="No app final o envio mora dentro do perfil profissional. Esta rota fica como atalho tecnico para testes internos."
        />
      </GlassCard>
      <CreatorStudioPanel
        enabled
      />
      <Text style={{ color: '#64748b' }}>Use o perfil profissional como entrada principal.</Text>
    </ScreenScroll>
  );
}
