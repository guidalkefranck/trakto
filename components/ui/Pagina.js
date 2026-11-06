import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Botao from './Botao.js';
import Icone from './Icone.js';
import { cores, espaco, raio } from '../../theme/tema.js';

// Estrutura padrão de tela: área segura + teclado + rolagem + largura máxima.
// Com aoAtualizar, a tela ganha "puxar para atualizar" (busca de novo na API).
// Com erro, mostra a falha de conexão e um botão "Tentar novamente".
export default function Pagina({ children, incluirTopo = false, semPadding = false, aoAtualizar = undefined, atualizando = false, erro = '' }) {
  return (
    <SafeAreaView style={css.tela} edges={incluirTopo ? ['top', 'bottom', 'left', 'right'] : ['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={css.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={[css.conteudo, semPadding && css.semPadding]} keyboardShouldPersistTaps="handled"
          refreshControl={aoAtualizar ? <RefreshControl refreshing={atualizando} onRefresh={aoAtualizar} colors={[cores.verde]} tintColor={cores.verde} /> : undefined}>
          {!!erro && <View style={[css.erro, semPadding && { margin: espaco.xl }]}>
            <View style={css.erroLinha}>
              <Icone nome="wifi-off" tamanho={22} cor={cores.erro} />
              <Text style={css.erroTexto}>{erro}</Text>
            </View>
            {aoAtualizar && <Botao titulo="Tentar novamente" icone="refresh" variante="perigo" compacto onPress={aoAtualizar} />}
          </View>}
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const css = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: espaco.xl, paddingBottom: espaco.xxxl * 2, gap: espaco.lg, flexGrow: 1 },
  semPadding: { padding: 0, maxWidth: '100%' },
  erro: { backgroundColor: cores.erroClaro, borderRadius: raio.lg, padding: espaco.lg, gap: espaco.md, borderWidth: 1, borderColor: '#EDCFC7' },
  erroLinha: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  erroTexto: { flex: 1, color: cores.erro, fontWeight: '600', lineHeight: 20 },
});
