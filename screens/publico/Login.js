import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../../components/Logo.js';
import { Aviso, Botao, Campo, Cartao, Icone, Pagina, estilos } from '../../components/ui/index.js';
import { NIVEIS } from '../../constants/permissoes.js';
import { cores, espaco, raio } from '../../theme/tema.js';

// Atalhos de demonstração (Entrega 1): um para cada nível de usuário.
const CONTAS_DEMO = [
  { nivel: 'produtor', email: 'produtor@trakto.com' },
  { nivel: 'proprietario', email: 'proprietario@trakto.com' },
  { nivel: 'admin', email: 'admin@trakto.com' },
];

export default function Login({ navigation, aoEntrar, aviso }) {
  const insets = useSafeAreaInsets();
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

  return <Pagina semPadding>
    {/* Topo com a marca e a proposta de valor */}
    <View style={[css.hero, { paddingTop: insets.top + espaco.xxl }]}>
      <Logo tamanho={50} claro />
      <Text style={css.heroTitulo}>Máquina parada{'\n'}vira <Text style={{ color: cores.trigo }}>colheita</Text>.</Text>
      <Text style={css.heroTexto}>Alugue tratores, implementos e serviços agrícolas de quem está perto de você — sem precisar comprar.</Text>
      <View style={css.selos}>
        <Selo icone="sprout" texto="Agricultura familiar" />
        <Selo icone="map-marker-radius-outline" texto="Vale do Taquari" />
      </View>
    </View>

    <View style={css.corpo}>
      <Cartao style={css.formulario}>
        <Text style={estilos.titulo}>Entrar</Text>
        <Text style={estilos.subtitulo}>Acesse sua conta para continuar.</Text>
        <Aviso mensagem={aviso} tipo="sucesso" />
        <Aviso mensagem={erro} />
        <Campo rotulo="E-mail" icone="email-outline" value={email} onChangeText={setEmail} placeholder="voce@exemplo.com"
          keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" maxLength={150} />
        <Campo rotulo="Senha" icone="lock-outline" senha value={senha} onChangeText={setSenha} placeholder="Sua senha"
          autoCapitalize="none" onSubmitEditing={realizarLogin} />
        <Botao titulo="Entrar" icone="login" onPress={realizarLogin} />
        <View style={css.ou}><View style={estilos.separador} /><Text style={css.ouTexto}>ainda não tem conta?</Text><View style={estilos.separador} /></View>
        <Botao titulo="Criar conta grátis" icone="account-plus-outline" variante="secundario"
          onPress={function abrirCadastro() { navigation.navigate('CadastroUsuario'); }} />
      </Cartao>

      <View style={css.demo}>
        <View style={estilos.linha}>
          <Icone nome="flask-outline" tamanho={18} cor={cores.trigoEscuro} />
          <Text style={css.demoTitulo}>Acesso de demonstração</Text>
        </View>
        <Text style={estilos.pequeno}>Toque em um perfil para preencher o login (senha 123456).</Text>
        <View style={css.demoLinha}>
          {CONTAS_DEMO.map(function botaoDemo(conta) {
            return <View key={conta.email} style={{ flexGrow: 1, flexBasis: 100 }}>
              <Botao titulo={NIVEIS[conta.nivel].curto} icone={NIVEIS[conta.nivel].icone} variante="destaque" compacto
                onPress={function usar() { preencherDemo(conta); }} />
            </View>;
          })}
        </View>
      </View>

      <Text style={css.rodape}>TRAKTO · Conectando quem precisa com quem tem</Text>
    </View>
  </Pagina>;
}

function Selo({ icone, texto }) {
  return <View style={css.selo}>
    <Icone nome={icone} tamanho={14} cor={cores.trigo} />
    <Text style={css.seloTexto}>{texto}</Text>
  </View>;
}

const css = StyleSheet.create({
  hero: { backgroundColor: cores.verde, paddingHorizontal: espaco.xl, paddingBottom: 64, gap: espaco.lg, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroTitulo: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', lineHeight: 41, letterSpacing: -1, marginTop: espaco.md },
  heroTexto: { color: 'rgba(255,255,255,0.82)', fontSize: 15, lineHeight: 22, maxWidth: 440 },
  selos: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm },
  selo: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: raio.pilula },
  seloTexto: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  corpo: { width: '100%', maxWidth: 560, alignSelf: 'center', paddingHorizontal: espaco.xl, gap: espaco.lg, marginTop: -44 },
  formulario: { gap: espaco.md + 2 },
  ou: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm },
  ouTexto: { color: cores.textoClaro, fontSize: 12 },
  demo: { backgroundColor: cores.trigoClaro, borderRadius: raio.xl, padding: espaco.lg, gap: espaco.sm, borderWidth: 1, borderColor: '#F0DDB3' },
  demoTitulo: { color: cores.trigoEscuro, fontWeight: '800' },
  demoLinha: { flexDirection: 'row', flexWrap: 'wrap', gap: espaco.sm, marginTop: 4 },
  rodape: { color: cores.textoClaro, textAlign: 'center', fontSize: 11, letterSpacing: 0.5, marginTop: espaco.sm },
});
