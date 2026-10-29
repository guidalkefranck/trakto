import { useState } from 'react';
import { Text, View } from 'react-native';
import { Aviso, Botao, Campo, Chip, Pagina, Painel, estilos } from '../components/ui.js';

// O cadastro público só permite os perfis de uso. Administradores são
// promovidos por outro administrador (tela Gerenciar usuários).
const PERFIS = [
  { valor: 'produtor', titulo: '🌱 Quero alugar', descricao: 'Sou produtor e preciso de máquinas ou serviços.' },
  { valor: 'proprietario', titulo: '🚜 Quero anunciar', descricao: 'Tenho máquinas paradas e quero gerar renda com elas.' },
];

export default function CadastroUsuario({ navigation, aoCadastrar }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', cidade: '', senha: '', confirmar: '', nivel: 'produtor' });
  const [erro, setErro] = useState('');

  function alterar(campo, valor) { setForm(function atualizar(atual) { return { ...atual, [campo]: valor }; }); }

  function cadastrar() {
    setErro('');
    const email = form.email.trim().toLowerCase();
    if (!form.nome.trim() || !email || !form.cidade.trim() || !form.senha) { setErro('Preencha nome, e-mail, cidade e senha.'); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErro('Informe um e-mail válido.'); return; }
    if (form.senha.length < 6) { setErro('A senha precisa ter pelo menos 6 caracteres.'); return; }
    if (form.senha !== form.confirmar) { setErro('As senhas não conferem.'); return; }
    const falha = aoCadastrar({ nome: form.nome.trim(), email, telefone: form.telefone.trim(), cidade: form.cidade.trim(), senha: form.senha, nivel: form.nivel });
    if (falha) { setErro(falha); return; }
    navigation.goBack();
  }

  return <Pagina>
    <Text style={estilos.titulo}>Crie sua conta</Text>
    <Text style={estilos.subtitulo}>Leva menos de um minuto. Depois é só entrar com seu e-mail e senha.</Text>

    <Painel>
      <Text style={estilos.etiqueta}>Como você vai usar a TRAKTO?</Text>
      {PERFIS.map(function opcao(perfil) {
        const ativo = form.nivel === perfil.valor;
        return <View key={perfil.valor} style={{ gap: 4 }}>
          <Chip titulo={perfil.titulo} ativo={ativo} onPress={function escolher() { alterar('nivel', perfil.valor); }} />
          <Text style={[estilos.subtitulo, { paddingLeft: 6 }]}>{perfil.descricao}</Text>
        </View>;
      })}
    </Painel>

    <Painel>
      <Aviso mensagem={erro} />
      <Campo rotulo="Nome completo" value={form.nome} onChangeText={function v(t) { alterar('nome', t); }} placeholder="Seu nome" maxLength={100} />
      <Campo rotulo="E-mail" value={form.email} onChangeText={function v(t) { alterar('email', t); }} placeholder="voce@exemplo.com"
        keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={150} />
      <Campo rotulo="Telefone / WhatsApp" value={form.telefone} onChangeText={function v(t) { alterar('telefone', t); }} placeholder="(51) 99999-0000" keyboardType="phone-pad" />
      <Campo rotulo="Cidade" value={form.cidade} onChangeText={function v(t) { alterar('cidade', t); }} placeholder="Ex.: Lajeado" />
      <Campo rotulo="Senha" value={form.senha} onChangeText={function v(t) { alterar('senha', t); }} secureTextEntry autoCapitalize="none" dica="Mínimo de 6 caracteres." />
      <Campo rotulo="Confirmar senha" value={form.confirmar} onChangeText={function v(t) { alterar('confirmar', t); }} secureTextEntry autoCapitalize="none" onSubmitEditing={cadastrar} />
      <Botao titulo="Criar conta" onPress={cadastrar} />
    </Painel>
  </Pagina>;
}
