import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CartaoSolicitacao from '../../components/CartaoSolicitacao.js';
import { Aviso, Botao, BotaoConfirmar, Chip, EstadoVazio, Pagina } from '../../components/ui/index.js';

const FILTROS = [
  { valor: 'andamento', titulo: 'Em andamento', status: ['pendente', 'aceita'] },
  { valor: 'historico', titulo: 'Histórico', status: ['concluida', 'recusada', 'cancelada'] },
  { valor: 'todas', titulo: 'Todas', status: null },
];

// O produtor vê SOMENTE as próprias solicitações (regra de dono do registro).
export default function MinhasSolicitacoes({ navigation, usuario, solicitacoes, alterarStatus, recarregar, carregando, erroCarga }) {
  const [filtro, setFiltro] = useState('andamento');
  const [erro, setErro] = useState('');
  const regra = FILTROS.find(function f(x) { return x.valor === filtro; });
  const minhas = solicitacoes.filter(function minha(s) {
    return s.produtorId === usuario.id && (!regra.status || regra.status.includes(s.status));
  });

  async function cancelar(id) {
    setErro('');
    try { await alterarStatus(id, 'cancelada', 'Solicitação cancelada.'); } catch (e) { setErro(e.message); }
  }

  return <Pagina aoAtualizar={recarregar} atualizando={carregando} erro={erroCarga}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={css.chips}>
      {FILTROS.map(function chip(f) {
        return <Chip key={f.valor} titulo={f.titulo} ativo={filtro === f.valor} onPress={function escolher() { setFiltro(f.valor); }} />;
      })}
    </ScrollView>

    <Aviso mensagem={erro} />
    {minhas.length === 0 && !carregando && <EstadoVazio icone="clipboard-text-outline" titulo="Nenhuma solicitação aqui"
      texto="Encontre uma máquina e faça seu pedido de aluguel em poucos toques.">
      <Botao titulo="Buscar máquinas" icone="magnify" compacto onPress={function buscar() { navigation.navigate('Maquinas'); }} />
    </EstadoVazio>}

    {minhas.map(function cartao(s) {
      return <CartaoSolicitacao key={s.id} solicitacao={s} pessoa={s.proprietario} rotuloPessoa="Proprietário">
        {s.status === 'pendente' && <BotaoConfirmar titulo="Cancelar solicitação" icone="close" pergunta="Cancelar este pedido de aluguel?"
          tituloConfirmar="Sim, cancelar" onConfirmar={function confirmar() { return cancelar(s.id); }} />}
      </CartaoSolicitacao>;
    })}
  </Pagina>;
}

const css = StyleSheet.create({
  chips: { gap: 8 },
});
