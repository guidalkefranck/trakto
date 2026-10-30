import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CartaoSolicitacao from '../../components/CartaoSolicitacao.js';
import { Botao, Chip, EstadoVazio, Pagina } from '../../components/ui/index.js';
import { COMISSAO_TRAKTO } from '../../constants/negocio.js';
import { pode } from '../../constants/permissoes.js';
import { moeda } from '../../utils/formatadores.js';
import { cores } from '../../theme/tema.js';

const FILTROS = [
  { valor: 'pendente', titulo: 'Pendentes' },
  { valor: 'aceita', titulo: 'Aceitas' },
  { valor: 'concluida', titulo: 'Concluídas' },
  { valor: 'todas', titulo: 'Todas' },
];

// Proprietário: vê e responde apenas pedidos das PRÓPRIAS máquinas.
// Admin: acompanha todos os pedidos da plataforma (somente leitura).
export default function SolicitacoesRecebidas({ usuario, usuarios, maquinas, solicitacoes, alterarStatus }) {
  const [filtro, setFiltro] = useState('pendente');
  const verTudo = pode(usuario, 'verTodasSolicitacoes');
  const podeResponder = pode(usuario, 'responderSolicitacoes');

  const idsVisiveis = maquinas
    .filter(function permitida(m) { return verTudo || m.proprietarioId === usuario.id; })
    .map(function id(m) { return m.id; });
  const visiveis = solicitacoes.filter(function v(s) { return verTudo || idsVisiveis.includes(s.maquinaId); });
  const lista = visiveis.filter(function f(s) { return filtro === 'todas' || s.status === filtro; });

  function contar(valor) {
    return visiveis.filter(function c(s) { return valor === 'todas' || s.status === valor; }).length;
  }

  return <Pagina>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={css.chips}>
      {FILTROS.map(function chip(f) {
        return <Chip key={f.valor} titulo={f.titulo + ' (' + contar(f.valor) + ')'} ativo={filtro === f.valor}
          onPress={function escolher() { setFiltro(f.valor); }} />;
      })}
    </ScrollView>

    {lista.length === 0 && <EstadoVazio icone="inbox-outline" titulo="Nada por aqui"
      texto={verTudo ? 'Nenhuma solicitação com este status.' : 'Quando um produtor pedir uma das suas máquinas, o pedido aparece aqui.'} />}

    {lista.map(function cartao(s) {
      const maquina = maquinas.find(function mesma(m) { return m.id === s.maquinaId; });
      const produtor = usuarios.find(function mesmo(u) { return u.id === s.produtorId; });
      return <CartaoSolicitacao key={s.id} solicitacao={s} maquina={maquina} pessoa={produtor} rotuloPessoa="Produtor">
        {podeResponder && s.status === 'pendente' && <View style={css.acoes}>
          <View style={{ flex: 1 }}><Botao titulo="Recusar" icone="close" variante="perigo" compacto
            onPress={function recusar() { alterarStatus(s.id, 'recusada', 'Solicitação recusada.'); }} /></View>
          <View style={{ flex: 1 }}><Botao titulo="Aceitar" icone="check" compacto
            onPress={function aceitar() { alterarStatus(s.id, 'aceita', 'Pedido aceito! O contato foi liberado.'); }} /></View>
        </View>}
        {podeResponder && s.status === 'aceita' && <>
          <Text style={css.repasse}>Você recebe {moeda(s.valorTotal * (1 - COMISSAO_TRAKTO))} (comissão TRAKTO de {Math.round(COMISSAO_TRAKTO * 100)}%).</Text>
          <Botao titulo="Marcar serviço como concluído" icone="flag-checkered" variante="suave" compacto
            onPress={function concluir() { alterarStatus(s.id, 'concluida', 'Serviço concluído. Bom trabalho!'); }} />
        </>}
      </CartaoSolicitacao>;
    })}
  </Pagina>;
}

const css = StyleSheet.create({
  chips: { gap: 8 },
  acoes: { flexDirection: 'row', gap: 8 },
  repasse: { color: cores.textoSuave, fontSize: 12 },
});
