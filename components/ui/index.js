// Componentes visuais reutilizáveis da TRAKTO. Recebem dados por Props.
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Paleta inspirada no campo: verde lavoura, amarelo trigo e marrom terra.
export const cores = {
  fundo: '#F7F4EC',      // palha clara
  papel: '#FFFFFF',
  texto: '#1E261C',
  muted: '#6A6F5F',
  borda: '#E5DFD0',
  verde: '#2E5B34',      // cor principal (lavoura)
  verdeEscuro: '#1E3D23',
  verdeClaro: '#E7EFE2',
  trigo: '#E8A93A',      // destaque (colheita)
  trigoClaro: '#FBF0D9',
  terra: '#8B5E3C',
  terraClara: '#F3E8DE',
  vermelho: '#B4412F',
  vermelhoClaro: '#FBEAE6',
  azul: '#3F6E8C',
  azulClaro: '#E5EEF4',
};

export function Pagina({ children, incluirTopo = false }) {
  return (
    <SafeAreaView style={ui.tela} edges={incluirTopo ? ['top', 'bottom', 'left', 'right'] : ['bottom', 'left', 'right']}>
      <KeyboardAvoidingView style={ui.tela} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={ui.conteudo} keyboardShouldPersistTaps="handled">{children}</ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Painel({ children, style = undefined }) {
  return <View style={[ui.painel, style]}>{children}</View>;
}

export function Botao({ titulo, onPress, disabled = false, variante = 'primario', carregando = false }) {
  const bloqueado = disabled || carregando;
  const corTexto = { primario: '#FFFFFF', destaque: cores.verdeEscuro, secundario: cores.verde, perigo: cores.vermelho }[variante];
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled: bloqueado, busy: carregando }}
      disabled={bloqueado} onPress={onPress}
      style={function estiloBotao({ pressed }) {
        return [ui.botao, variante === 'destaque' && ui.destaque, variante === 'secundario' && ui.secundario,
          variante === 'perigo' && ui.perigo, (pressed || bloqueado) && { opacity: 0.55 }];
      }}>
      {carregando && <ActivityIndicator size="small" color={corTexto} />}
      <Text style={[ui.textoBotao, { color: corTexto }]}>{titulo}</Text>
    </Pressable>
  );
}

export function Campo({ rotulo, dica = '', style = undefined, ...propriedades }) {
  return <View style={ui.campo}>
    <Text style={ui.rotulo}>{rotulo}</Text>
    <TextInput accessibilityLabel={rotulo} placeholderTextColor="#9A9C8E" style={[ui.input, style]} {...propriedades} />
    {!!dica && <Text style={ui.dica}>{dica}</Text>}
  </View>;
}

// Chip serve para filtros e escolhas de opção (tipo de máquina, perfil etc.).
export function Chip({ titulo, ativo = false, onPress }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ selected: ativo }} onPress={onPress}
    style={[ui.chip, ativo && ui.chipAtivo]}>
    <Text style={[ui.chipTexto, ativo && { color: '#FFFFFF' }]}>{titulo}</Text>
  </Pressable>;
}

export function Aviso({ mensagem, tipo = 'erro' }) {
  if (!mensagem) { return null; }
  const sucesso = tipo === 'sucesso';
  return <View style={[ui.aviso, sucesso && { backgroundColor: cores.verdeClaro }]}>
    <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ color: sucesso ? cores.verde : cores.vermelho, lineHeight: 22 }}>{mensagem}</Text>
  </View>;
}

// Cada status de solicitação tem cor própria para leitura rápida.
const coresStatus = {
  pendente: { fundo: cores.trigoClaro, texto: '#8A5B07', nome: 'Pendente' },
  aceita: { fundo: cores.verdeClaro, texto: cores.verde, nome: 'Aceita' },
  recusada: { fundo: cores.vermelhoClaro, texto: cores.vermelho, nome: 'Recusada' },
  concluida: { fundo: cores.azulClaro, texto: cores.azul, nome: 'Concluída' },
  cancelada: { fundo: '#EEEDE8', texto: cores.muted, nome: 'Cancelada' },
};

export function SeloStatus({ status }) {
  const estilo = coresStatus[status] || coresStatus.pendente;
  return <View style={[ui.selo, { backgroundColor: estilo.fundo }]}>
    <Text style={[ui.seloTexto, { color: estilo.texto }]}>{estilo.nome.toUpperCase()}</Text>
  </View>;
}

export function Vazio({ titulo, texto }) {
  return <Painel style={{ alignItems: 'center' }}>
    <Text style={{ fontSize: 34 }}>🌾</Text>
    <Text style={[estilos.subtitulo, { fontWeight: '700', color: cores.texto }]}>{titulo}</Text>
    <Text style={[estilos.subtitulo, { textAlign: 'center' }]}>{texto}</Text>
  </Painel>;
}

export function Carregamento({ mensagem = 'Carregando…' }) {
  return <View style={ui.carregamento}><ActivityIndicator color={cores.verde} size="large" /><Text style={estilos.texto}>{mensagem}</Text></View>;
}

export function moeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export const estilos = StyleSheet.create({
  titulo: { color: cores.texto, fontSize: 26, fontWeight: '800', lineHeight: 34 },
  subtitulo: { color: cores.muted, fontSize: 15, lineHeight: 23 },
  texto: { color: cores.texto, fontSize: 15, lineHeight: 24 },
  linha: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  separador: { height: 1, backgroundColor: cores.borda, marginVertical: 4 },
  etiqueta: { color: cores.terra, fontSize: 12, fontWeight: '800', letterSpacing: 1.5, textTransform: 'uppercase' },
});

const ui = StyleSheet.create({
  tela: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 20, paddingBottom: 40, gap: 16, flexGrow: 1 },
  painel: { backgroundColor: cores.papel, borderWidth: 1, borderColor: cores.borda, borderRadius: 18, padding: 20, gap: 12 },
  botao: { minHeight: 50, paddingHorizontal: 20, paddingVertical: 13, borderRadius: 14, backgroundColor: cores.verde, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  destaque: { backgroundColor: cores.trigo },
  secundario: { backgroundColor: cores.verdeClaro, borderWidth: 1, borderColor: '#D3E0CB' },
  perigo: { backgroundColor: cores.vermelhoClaro, borderWidth: 1, borderColor: '#EDCFC7' },
  textoBotao: { fontSize: 15, fontWeight: '800' },
  campo: { gap: 6 },
  rotulo: { fontSize: 14, fontWeight: '700', color: cores.texto },
  dica: { fontSize: 12, color: cores.muted },
  input: { color: cores.texto, backgroundColor: '#FCFBF7', borderWidth: 1, borderColor: cores.borda, borderRadius: 12, padding: 14, minHeight: 50, fontSize: 16 },
  chip: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 30, borderWidth: 1, borderColor: cores.borda, backgroundColor: cores.papel },
  chipAtivo: { backgroundColor: cores.verde, borderColor: cores.verde },
  chipTexto: { color: cores.texto, fontSize: 13, fontWeight: '700' },
  aviso: { padding: 14, backgroundColor: cores.vermelhoClaro, borderRadius: 12 },
  selo: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  seloTexto: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  carregamento: { flex: 1, minHeight: 160, alignItems: 'center', justifyContent: 'center', gap: 16, backgroundColor: cores.fundo },
});
