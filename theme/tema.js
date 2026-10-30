// Design system da TRAKTO: todas as cores, espaçamentos e tamanhos do app
// ficam aqui. Alterar um valor neste arquivo atualiza o app inteiro.

export const cores = {
  // Marca
  verde: '#2E5B34',        // verde lavoura — cor principal
  verdeEscuro: '#1C3A21',
  verdeMedio: '#4C7A52',
  verdeClaro: '#E6EFE1',
  trigo: '#E8A93A',        // amarelo trigo — destaque
  trigoEscuro: '#8A5B07',
  trigoClaro: '#FBF0D9',
  terra: '#8B5E3C',        // marrom terra — detalhes
  terraClara: '#F3E8DE',

  // Neutros
  fundo: '#F7F4EC',        // palha
  papel: '#FFFFFF',
  texto: '#1E261C',
  textoSuave: '#5F6656',
  textoClaro: '#8E9283',
  borda: '#E6E0D2',
  bordaForte: '#D6CEBB',

  // Feedback
  sucesso: '#2E7D45',
  sucessoClaro: '#E4F2E7',
  erro: '#B4412F',
  erroClaro: '#FBEAE6',
  info: '#3F6E8C',
  infoClaro: '#E5EEF4',
  neutroClaro: '#EEEDE8',
};

// Escala de espaçamento (múltiplos de 4).
export const espaco = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40 };

export const raio = { sm: 8, md: 12, lg: 16, xl: 22, pilula: 999 };

export const fonte = {
  legenda: 12,
  pequena: 13,
  corpo: 15,
  destaque: 17,
  titulo: 24,
  tituloGrande: 32,
  hero: 36,
};

// Sombras suaves (boxShadow funciona no Android, iOS e Web).
export const sombra = {
  leve: { boxShadow: '0px 1px 3px rgba(30, 38, 28, 0.06), 0px 4px 14px rgba(30, 38, 28, 0.05)' },
  media: { boxShadow: '0px 6px 24px rgba(30, 38, 28, 0.12)' },
};
