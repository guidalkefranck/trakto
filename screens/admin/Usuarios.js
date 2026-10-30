import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar, Campo, Cartao, Chip, EstadoVazio, Icone, Pagina, estilos } from '../../components/ui/index.js';
import { NIVEIS } from '../../constants/permissoes.js';
import { cores, espaco, raio } from '../../theme/tema.js';

// Somente o administrador acessa esta tela e altera níveis de acesso.
export default function Usuarios({ usuario, usuarios, alterarNivel }) {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const termo = busca.trim().toLowerCase();
  const lista = usuarios.filter(function f(u) {
    const casaBusca = !termo || u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo);
    return casaBusca && (filtro === 'todos' || u.nivel === filtro);
  });

  function contar(nivel) { return usuarios.filter(function c(u) { return u.nivel === nivel; }).length; }

  return <Pagina>
    <View style={css.resumo}>
      {Object.keys(NIVEIS).map(function bloco(nivel) {
        return <View key={nivel} style={css.resumoItem}>
          <Icone nome={NIVEIS[nivel].icone} tamanho={20} cor={cores.verde} />
          <Text style={css.resumoNumero}>{contar(nivel)}</Text>
          <Text style={css.resumoRotulo}>{NIVEIS[nivel].curto}</Text>
        </View>;
      })}
    </View>

    <Campo icone="magnify" value={busca} onChangeText={setBusca} placeholder="Buscar por nome ou e-mail…" autoCapitalize="none" />
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      <Chip titulo="Todos" ativo={filtro === 'todos'} onPress={function t() { setFiltro('todos'); }} />
      {Object.keys(NIVEIS).map(function chip(nivel) {
        return <Chip key={nivel} titulo={NIVEIS[nivel].curto} icone={NIVEIS[nivel].icone} ativo={filtro === nivel} onPress={function e() { setFiltro(nivel); }} />;
      })}
    </ScrollView>

    {lista.length === 0 && <EstadoVazio icone="account-search-outline" titulo="Nenhum usuário encontrado" />}

    {lista.map(function cartao(u) {
      const euMesmo = u.id === usuario.id;
      return <Cartao key={u.id}>
        <View style={css.linha}>
          <Avatar nome={u.nome} tamanho={44} claro={u.nivel === 'admin'} />
          <View style={{ flex: 1 }}>
            <Text style={estilos.forte}>{u.nome}{euMesmo ? '  (você)' : ''}</Text>
            <Text style={estilos.pequeno}>{u.email}</Text>
            <Text style={estilos.pequeno}>{u.cidade} · {u.telefone}</Text>
          </View>
        </View>
        <Text style={css.rotulo}>Nível de acesso</Text>
        <View style={estilos.linha}>
          {Object.keys(NIVEIS).map(function chip(nivel) {
            return <Chip key={nivel} titulo={NIVEIS[nivel].curto} icone={NIVEIS[nivel].icone} ativo={u.nivel === nivel}
              onPress={function trocar() { if (!euMesmo && u.nivel !== nivel) { alterarNivel(u.id, nivel); } }} />;
          })}
        </View>
        {euMesmo && <View style={css.protecao}>
          <Icone nome="shield-lock-outline" tamanho={16} cor={cores.info} />
          <Text style={[estilos.pequeno, { color: cores.info, flex: 1 }]}>Por segurança, um administrador não altera o próprio nível.</Text>
        </View>}
      </Cartao>;
    })}
  </Pagina>;
}

const css = StyleSheet.create({
  resumo: { flexDirection: 'row', gap: espaco.sm },
  resumoItem: { flex: 1, alignItems: 'center', gap: 2, backgroundColor: cores.papel, borderRadius: raio.lg, borderWidth: 1, borderColor: cores.borda, paddingVertical: espaco.md },
  resumoNumero: { color: cores.verdeEscuro, fontSize: 22, fontWeight: '900' },
  resumoRotulo: { color: cores.textoSuave, fontSize: 12, fontWeight: '700' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espaco.md },
  rotulo: { color: cores.textoSuave, fontSize: 12, fontWeight: '700' },
  protecao: { flexDirection: 'row', alignItems: 'center', gap: espaco.sm, backgroundColor: cores.infoClaro, borderRadius: raio.md, padding: espaco.md },
});
