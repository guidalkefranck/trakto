import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import CartaoSolicitacao from '../components/CartaoSolicitacao.js';
import { Botao, Chip, Pagina, Vazio, estilos } from '../components/ui.js';

const FILTROS = [
  { valor: 'pendente', titulo: 'Pendentes' },
  { valor: 'aceita', titulo: 'Aceitas' },
  { valor: 'todas', titulo: 'Todas' },
];

// Proprietário vê apenas pedidos das PRÓPRIAS máquinas. O admin vê todos.
export default function SolicitacoesRecebidas({ usuario, usuarios, maquinas, solicitacoes, alterarStatus }) {
  const [filtro, setFiltro] = useState('pendente');
  const idsVisiveis = maquinas
    .filter(function permitida(m) { return usuario.nivel === 'admin' || m.proprietarioId === usuario.id; })
    .map(function id(m) { return m.id; });
  const recebidas = solicitacoes.filter(function visivel(s) {
    return idsVisiveis.includes(s.maquinaId) && (filtro === 'todas' || s.status === filtro);
  });

  return <Pagina>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
      {FILTROS.map(function chip(f) {
        return <Chip key={f.valor} titulo={f.titulo} ativo={filtro === f.valor} onPress={function escolher() { setFiltro(f.valor); }} />;
      })}
    </ScrollView>
    <Text style={estilos.subtitulo}>{recebidas.length} {recebidas.length === 1 ? 'solicitação' : 'solicitações'}</Text>
    {recebidas.length === 0 && <Vazio titulo="Nada por aqui" texto="Quando um produtor pedir uma das suas máquinas, o pedido aparece aqui." />}
    {recebidas.map(function cartao(s) {
      const maquina = maquinas.find(function mesma(m) { return m.id === s.maquinaId; });
      const produtor = usuarios.find(function mesmo(u) { return u.id === s.produtorId; });
      return <CartaoSolicitacao key={s.id} solicitacao={s} maquina={maquina} pessoa={produtor} rotuloPessoa="Produtor">
        {s.status === 'pendente' && <View style={estilos.linha}>
          <View style={{ flex: 1 }}><Botao titulo="Aceitar" onPress={function aceitar() { alterarStatus(s.id, 'aceita'); }} /></View>
          <View style={{ flex: 1 }}><Botao titulo="Recusar" variante="perigo" onPress={function recusar() { alterarStatus(s.id, 'recusada'); }} /></View>
        </View>}
        {s.status === 'aceita' && <Botao titulo="Marcar como concluída" variante="secundario" onPress={function concluir() { alterarStatus(s.id, 'concluida'); }} />}
      </CartaoSolicitacao>;
    })}
  </Pagina>;
}
