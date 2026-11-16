import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Aviso, Botao, Campo, Icone } from './ui/index.js';
import { API_URL_PADRAO, definirApiUrl, normalizarApiUrl, obterApiUrl, testarApi } from '../services/api.js';
import { esquecerServidor, salvarServidor } from '../services/configuracao.js';
import { cores, espaco, raio } from '../theme/tema.js';

// Mostra se a API está conectada e permite trocar o endereço.
// No APK, o celular precisa do IP do computador que roda "npm run api".
export default function ConfiguracaoServidor({ status, aoAlterar }) {
  const [aberto, setAberto] = useState(false);
  const [texto, setTexto] = useState(obterApiUrl());
  const [testando, setTestando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  async function testarESalvar() {
    setMensagem('');
    const url = normalizarApiUrl(texto);
    if (!url) { setMensagem('Endereço inválido. Exemplo: 192.168.0.15:3000'); return; }
    setTestando(true);
    const resultado = await testarApi(url);
    setTestando(false);
    if (!resultado.ok) { setMensagem(resultado.mensagem); return; }
    definirApiUrl(url);
    await salvarServidor(url);
    setTexto(url);
    setAberto(false);
    aoAlterar();
  }

  async function restaurarPadrao() {
    definirApiUrl(API_URL_PADRAO);
    await esquecerServidor();
    setTexto(API_URL_PADRAO);
    setMensagem('');
    aoAlterar();
  }

  const cor = status === 'online' ? cores.sucesso : status === 'offline' ? cores.erro : cores.trigo;
  const rotulo = status === 'online' ? 'Conectado à API e ao banco de dados' : status === 'offline' ? 'API indisponível' : 'Verificando conexão…';

  return <View style={css.caixa}>
    <Pressable accessibilityRole="button" accessibilityLabel="Configurar servidor da API" onPress={function alternar() { setAberto(!aberto); setTexto(obterApiUrl()); }} style={css.linha}>
      <View style={[css.bolinha, { backgroundColor: cor }]} />
      <View style={{ flex: 1 }}>
        <Text style={css.rotulo}>{rotulo}</Text>
        <Text style={css.url} numberOfLines={1}>{obterApiUrl()}</Text>
      </View>
      <Icone nome={aberto ? 'chevron-up' : 'cog-outline'} tamanho={20} cor={cores.textoSuave} />
    </Pressable>

    {aberto && <View style={css.form}>
      <Campo rotulo="Servidor da API" icone="server-network" value={texto} onChangeText={setTexto}
        placeholder="192.168.0.15:3000" autoCapitalize="none" autoCorrect={false} keyboardType="url"
        dica="No celular, use o IP do computador que roda a API (comando ipconfig) e a porta 3000. Celular e computador no mesmo Wi-Fi." />
      <Aviso mensagem={mensagem} />
      <Botao titulo="Testar e salvar" icone="lan-connect" compacto carregando={testando} onPress={testarESalvar} />
      <Botao titulo="Voltar ao padrão" icone="restore" variante="secundario" compacto onPress={restaurarPadrao} />
    </View>}
  </View>;
}

const css = StyleSheet.create({
  caixa: { backgroundColor: cores.papel, borderRadius: raio.lg, borderWidth: 1, borderColor: cores.borda, padding: espaco.md, gap: espaco.md },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm + 2 },
  bolinha: { width: 10, height: 10, borderRadius: 5 },
  rotulo: { color: cores.texto, fontSize: 13, fontWeight: '700' },
  url: { color: cores.textoSuave, fontSize: 12 },
  form: { gap: espaco.sm },
});
