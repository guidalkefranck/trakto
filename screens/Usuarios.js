import { Text, View } from 'react-native';
import { NIVEIS } from '../services/dadosFicticios.js';
import { Chip, Painel, Pagina, cores, estilos } from '../components/ui.js';

// Somente o administrador acessa esta tela e altera níveis de acesso.
export default function Usuarios({ usuario, usuarios, alterarNivel }) {
  return <Pagina>
    <Text style={estilos.subtitulo}>Altere o nível de acesso dos usuários cadastrados. Você não pode alterar o próprio nível.</Text>
    {usuarios.map(function cartao(u) {
      const euMesmo = u.id === usuario.id;
      return <Painel key={u.id}>
        <View>
          <Text style={[estilos.texto, { fontWeight: '800' }]}>{u.nome}{euMesmo ? ' (você)' : ''}</Text>
          <Text style={estilos.subtitulo}>{u.email} • {u.cidade}</Text>
        </View>
        <View style={estilos.linha}>
          {Object.keys(NIVEIS).map(function chip(nivel) {
            return <Chip key={nivel} titulo={NIVEIS[nivel]} ativo={u.nivel === nivel}
              onPress={function trocar() { if (!euMesmo) { alterarNivel(u.id, nivel); } }} />;
          })}
        </View>
        {euMesmo && <Text style={{ color: cores.muted, fontSize: 12 }}>Proteção: um admin não remove o próprio acesso.</Text>}
      </Painel>;
    })}
  </Pagina>;
}
