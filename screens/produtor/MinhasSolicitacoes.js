import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import CartaoSolicitacao from '../../components/CartaoSolicitacao.js';
import { Botao, BotaoConfirmar, Chip, EstadoVazio, Pagina } from '../../components/ui/index.js';

const FILTROS = [
  { valor: 'andamento', titulo: 'Em andamento', status: ['pendente', 'aceita'] },
  { valor: 'historico', titulo: 'Histórico', status: ['concluida', 'recusada', 'cancelada'] },
  { valor: 'todas', titulo: 'Todas', status: null },
];

// O produtor vê SOMENTE as próprias solicitações (regra de dono do registro).
export default function MinhasSolicitacoes({ navigation, usuario, usuarios, maquinas, solicitacoes, alterarStatus }) {
  const [filtro, setFiltro] = useState('andamento');
  const regra = FILTROS.find(function f(x) { return x.valor === filtro; });
  const minhas = solicitacoes.filter(function minha(s) {
    return s.produtorId === usuario.id && (!regra.status || regra.status.includes(s.status));
  });

  return <Pagina>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={css.chips}>
      {FILTROS.map(function chip(f) {
        return <Chip key={f.valor} titulo={f.titulo} ativo={filtro === f.valor} onPress={function escolher() { setFiltro(f.valor); }} />;
      })}
    </ScrollView>

    {minhas.length === 0 && <EstadoVazio icone="clipboard-text-outline" titulo="Nenhuma solicitação aqui"
      texto="Encontre uma máquina e faça seu pedido de aluguel em poucos toques.">
      <Botao titulo="Buscar máquinas" icone="magnify" compacto onPress={function buscar() { navigation.navigate('Maquinas'); }} />
    </EstadoVazio>}

    {minhas.map(function cartao(s) {
      const maquina = maquinas.find(function mesma(m) { return m.id === s.maquinaId; });
      const dono = maquina ? usuarios.find(function mesmo(u) { return u.id === maquina.proprietarioId; }) : null;
      return <CartaoSolicitacao key={s.id} solicitacao={s} maquina={maquina} pessoa={dono} rotuloPessoa="Proprietário">
        {s.status === 'pendente' && <BotaoConfirmar titulo="Cancelar solicitação" icone="close" pergunta="Cancelar este pedido de aluguel?"
          tituloConfirmar="Sim, cancelar" onConfirmar={function cancelar() { alterarStatus(s.id, 'cancelada', 'Solicitação cancelada.'); }} />}
      </CartaoSolicitacao>;
    })}
  </Pagina>;
}

const css = StyleSheet.create({
  chips: { gap: 8 },
});
