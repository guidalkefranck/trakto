import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { cores, espaco } from '../../theme/tema.js';

// Estrutura padrão de tela: área segura + teclado + rolagem + largura máxima.
export default function Pagina({ children, incluirTopo = false, semPadding = false }) {
  return (
    <SafeAreaView style={css.tela} edges={incluirTopo ? ['top', 'bottom', 'left', 'right'] : ['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={css.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[css.conteudo, semPadding && { padding: 0 }]} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const css = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: espaco.xl, paddingBottom: espaco.xxxl * 2, gap: espaco.lg, flexGrow: 1 },
});
