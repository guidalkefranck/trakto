import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Aviso, Botao, Campo, Cartao, Icone, Pagina, estilos } from '../../components/ui/index.js';
import { emailValido, mascaraTelefone } from '../../utils/formatadores.js';
import { cores, espaco, raio } from '../../theme/tema.js';

// O cadastro público oferece apenas os perfis de uso. O nível "admin" só é
// concedido por outro administrador (regra de segurança).
const PERFIS = [
  { valor: 'produtor', titulo: 'Quero alugar', descricao: 'Sou produtor e preciso de máquinas ou serviços.', icone: 'sprout' },
  { valor: 'proprietario', titulo: 'Quero anunciar', descricao: 'Tenho máquinas paradas e quero gerar renda.', icone: 'tractor-variant' },
];

export default function CadastroUsuario({ navigation, aoCadastrar }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', cidade: '', senha: '', confirmar: '', nivel: 'produtor' });
  const [erros, setErros] = useState({});
  const [erroGeral, setErroGeral] = useState('');
  const [enviando, setEnviando] = useState(false);

  function alterar(campo, valor) {
    setForm(function atualizar(atual) { return { ...atual, [campo]: valor }; });
    setErros(function limpar(atual) { return { ...atual, [campo]: '' }; });
  }

  function validar() {
    const e = {};
    if (form.nome.trim().length < 3) { e.nome = 'Informe seu nome completo.'; }
    if (!emailValido(form.email.trim())) { e.email = 'Informe um e-mail válido.'; }
    if (form.telefone.replace(/\D/g, '').length < 10) { e.telefone = 'Informe um telefone com DDD.'; }
    if (!form.cidade.trim()) { e.cidade = 'Informe sua cidade.'; }
    if (form.senha.length < 8) { e.senha = 'A senha precisa ter pelo menos 8 caracteres.'; }
    if (form.confirmar !== form.senha) { e.confirmar = 'As senhas não conferem.'; }
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function cadastrar() {
    setErroGeral('');
    if (!validar()) { return; }
    setEnviando(true);
    const falha = await aoCadastrar({
      nome: form.nome.trim(), email: form.email.trim().toLowerCase(), telefone: form.telefone,
      cidade: form.cidade.trim(), senha: form.senha, nivel: form.nivel,
    });
    setEnviando(false);
    if (falha) { setErroGeral(falha); return; }
    navigation.goBack();
  }

  return <Pagina>
    <View style={{ gap: 4 }}>
      <Text style={estilos.titulo}>Crie sua conta</Text>
      <Text style={estilos.subtitulo}>Leva menos de um minuto. Escolha como você vai usar a TRAKTO.</Text>
    </View>

    <View style={css.perfis}>
      {PERFIS.map(function opcao(perfil) {
        const ativo = form.nivel === perfil.valor;
        return <Pressable key={perfil.valor} accessibilityRole="radio" accessibilityState={{ checked: ativo }}
          onPress={function escolher() { alterar('nivel', perfil.valor); }} style={[css.perfil, ativo && css.perfilAtivo]}>
          <View style={[css.perfilIcone, ativo && { backgroundColor: cores.verde }]}>
            <Icone nome={perfil.icone} tamanho={24} cor={ativo ? '#FFFFFF' : cores.verde} />
          </View>
          <Text style={css.perfilTitulo}>{perfil.titulo}</Text>
          <Text style={css.perfilTexto}>{perfil.descricao}</Text>
          <View style={[css.radio, ativo && css.radioAtivo]}>{ativo && <Icone nome="check" tamanho={14} cor="#FFFFFF" />}</View>
        </Pressable>;
      })}
    </View>

    <Cartao>
      <Aviso mensagem={erroGeral} />
      <Campo rotulo="Nome completo" icone="account-outline" value={form.nome} erro={erros.nome}
        onChangeText={function v(t) { alterar('nome', t); }} placeholder="Seu nome" maxLength={100} />
      <Campo rotulo="E-mail" icone="email-outline" value={form.email} erro={erros.email}
        onChangeText={function v(t) { alterar('email', t); }} placeholder="voce@exemplo.com"
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={150} />
      <Campo rotulo="Telefone / WhatsApp" icone="whatsapp" value={form.telefone} erro={erros.telefone}
        onChangeText={function v(t) { alterar('telefone', mascaraTelefone(t)); }} placeholder="(51) 99999-0000" keyboardType="phone-pad"
        dica="Só é mostrado depois que um aluguel for aceito." />
      <Campo rotulo="Cidade" icone="map-marker-outline" value={form.cidade} erro={erros.cidade}
        onChangeText={function v(t) { alterar('cidade', t); }} placeholder="Ex.: Lajeado" />
      <Campo rotulo="Senha" icone="lock-outline" senha value={form.senha} erro={erros.senha}
        onChangeText={function v(t) { alterar('senha', t); }} autoCapitalize="none" dica="Mínimo de 8 caracteres." />
      <Campo rotulo="Confirmar senha" icone="lock-check-outline" senha value={form.confirmar} erro={erros.confirmar}
        onChangeText={function v(t) { alterar('confirmar', t); }} autoCapitalize="none" onSubmitEditing={cadastrar} />
      <Botao titulo="Criar minha conta" icone="check" onPress={cadastrar} carregando={enviando} />
    </Cartao>

    <View style={css.privacidade}>
      <Icone nome="shield-lock-outline" tamanho={16} cor={cores.textoSuave} />
      <Text style={[estilos.pequeno, { flex: 1 }]}>Sua senha é guardada no banco apenas como hash (bcrypt) — nem a equipe TRAKTO consegue vê-la.</Text>
    </View>
  </Pagina>;
}

const css = StyleSheet.create({
  perfis: { flexDirection: 'row', gap: espaco.md },
  perfil: { flex: 1, backgroundColor: cores.papel, borderRadius: raio.xl, borderWidth: 1.5, borderColor: cores.borda, padding: espaco.lg, gap: 6 },
  perfilAtivo: { borderColor: cores.verde, backgroundColor: '#F6FAF3' },
  perfilIcone: { width: 46, height: 46, borderRadius: 14, backgroundColor: cores.verdeClaro, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  perfilTitulo: { color: cores.texto, fontSize: 16, fontWeight: '800' },
  perfilTexto: { color: cores.textoSuave, fontSize: 12, lineHeight: 17 },
  radio: { position: 'absolute', top: 14, right: 14, width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: cores.bordaForte, alignItems: 'center', justifyContent: 'center' },
  radioAtivo: { backgroundColor: cores.verde, borderColor: cores.verde },
  privacidade: { flexDirection: 'row', gap: espaco.sm, alignItems: 'center', paddingHorizontal: espaco.xs },
});
