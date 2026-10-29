import { Text } from 'react-native';
import CartaoSolicitacao from '../components/CartaoSolicitacao.js';
import { Botao, Pagina, Vazio, estilos } from '../components/ui.js';

// Produtor vê SOMENTE as próprias solicitações.
export default function MinhasSolicitacoes({ navigation, usuario, usuarios, maquinas, solicitacoes, alterarStatus }) {
  const minhas = solicitacoes.filter(function minha(s) { return s.produtorId === usuario.id; });

  return <Pagina>
    <Text style={estilos.subtitulo}>Acompanhe o andamento dos seus pedidos de aluguel.</Text>
    {minhas.length === 0 && <Vazio titulo="Nenhuma solicitação ainda" texto="Encontre uma máquina e faça seu primeiro pedido." />}
    {minhas.map(function cartao(s) {
      const maquina = maquinas.find(function mesma(m) { return m.id === s.maquinaId; });
      const dono = maquina ? usuarios.find(function mesmo(u) { return u.id === maquina.proprietarioId; }) : null;
      return <CartaoSolicitacao key={s.id} solicitacao={s} maquina={maquina} pessoa={dono} rotuloPessoa="Proprietário">
        {s.status === 'pendente' && <Botao titulo="Cancelar solicitação" variante="perigo" onPress={function cancelar() { alterarStatus(s.id, 'cancelada'); }} />}
      </CartaoSolicitacao>;
    })}
    <Botao titulo="Buscar mais máquinas" variante="secundario" onPress={function buscar() { navigation.navigate('Maquinas'); }} />
  </Pagina>;
}
