import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Botao from './Botao.js';
import { cores, espaco, raio } from '../../theme/tema.js';

// Ações destrutivas pedem confirmação na própria tela (funciona no celular e na web).
export default function BotaoConfirmar({ titulo, pergunta, onConfirmar, icone = 'trash-can-outline', tituloConfirmar = 'Sim, confirmar' }) {
  const [confirmando, setConfirmando] = useState(false);
  if (!confirmando) {
    return <Botao titulo={titulo} icone={icone} variante="perigo" onPress={function abrir() { setConfirmando(true); }} />;
  }
  return <View style={css.caixa}>
    <Text style={css.pergunta}>{pergunta}</Text>
    <View style={css.linha}>
      <View style={{ flex: 1 }}><Botao titulo="Voltar" variante="secundario" compacto onPress={function voltar() { setConfirmando(false); }} /></View>
      <View style={{ flex: 1 }}><Botao titulo={tituloConfirmar} variante="perigo" compacto onPress={function confirmar() { setConfirmando(false); onConfirmar(); }} /></View>
    </View>
  </View>;
}

const css = StyleSheet.create({
  caixa: { backgroundColor: cores.erroClaro, borderRadius: raio.lg, padding: espaco.lg, gap: espaco.md, borderWidth: 1, borderColor: '#EDCFC7' },
  pergunta: { color: cores.erro, fontWeight: '700', textAlign: 'center' },
  linha: { flexDirection: 'row', gap: espaco.sm },
});
