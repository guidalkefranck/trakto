import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Logo from '../components/Logo.js';
import { Aviso, Botao, Campo, Pagina, Painel, cores, estilos } from '../components/ui.js';

// Atalhos de demonstração para a Entrega 1 (um por nível de usuário).
const CONTAS_DEMO = [
  { rotulo: 'Produtor', email: 'produtor@trakto.com' },
  { rotulo: 'Proprietário', email: 'proprietario@trakto.com' },
  { rotulo: 'Admin', email: 'admin@trakto.com' },
];

export default function Login({ navigation, aoEntrar, aviso }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function realizarLogin() {
    setErro('');
    if (!email.trim() || !senha) { setErro('Preencha o e-mail e a senha.'); return; }
    const falha = aoEntrar(email.trim().toLowerCase(), senha);
    if (falha) { setErro(falha); } else { setSenha(''); }
  }

  function preencherDemo(conta) {
    setEmail(conta.email);
    setSenha('123456');
    setErro('');
  }

  return <Pagina incluirTopo>
    <View style={css.topo}><Logo tamanho={52} /></View>

    <View style={css.apresentacao}>
      <Text style={css.titulo}>Máquina parada{'\n'}vira <Text style={{ color: cores.verde }}>colheita</Text>.</Text>
      <Text style={estilos.subtitulo}>Alugue tratores, implementos e serviços agrícolas de produtores da sua região, sem precisar comprar.</Text>
    </View>

    <Painel>
      <Text style={estilos.titulo}>Entrar</Text>
      <Aviso mensagem={aviso} tipo="sucesso" />
      <Aviso mensagem={erro} />
      <Campo rotulo="E-mail" value={email} onChangeText={setEmail} placeholder="voce@exemplo.com"
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" maxLength={150} />
      <Campo rotulo="Senha" value={senha} onChangeText={setSenha} placeholder="Sua senha"
        secureTextEntry autoCapitalize="none" onSubmitEditing={realizarLogin} />
      <Botao titulo="Entrar" onPress={realizarLogin} />
      <Text style={css.legenda}>Ainda não tem conta?</Text>
      <Botao titulo="Criar conta" variante="secundario" onPress={function abrirCadastro() { navigation.navigate('CadastroUsuario'); }} />
    </Painel>

    <Painel style={css.demo}>
      <Text style={estilos.etiqueta}>Contas de demonstração</Text>
      <Text style={estilos.subtitulo}>Toque em um perfil para preencher o login (senha 123456).</Text>
      <View style={estilos.linha}>
        {CONTAS_DEMO.map(function botaoDemo(conta) {
          return <View key={conta.email} style={{ flexGrow: 1 }}>
            <Botao titulo={conta.rotulo} variante="destaque" onPress={function usar() { preencherDemo(conta); }} />
          </View>;
        })}
      </View>
    </Painel>

    <Text style={css.rodape}>TRAKTO • VALE DO TAQUARI • RS</Text>
  </Pagina>;
}

const css = StyleSheet.create({
  topo: { paddingTop: 16 },
  apresentacao: { paddingVertical: 12, gap: 12 },
  titulo: { color: cores.texto, fontSize: 38, fontWeight: '900', lineHeight: 44, letterSpacing: -1 },
  legenda: { textAlign: 'center', color: cores.muted, fontSize: 14 },
  demo: { backgroundColor: cores.trigoClaro, borderColor: '#F0DDB3' },
  rodape: { color: cores.muted, textAlign: 'center', fontSize: 10, letterSpacing: 2, marginTop: 4 },
});
