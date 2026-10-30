// Regras de negócio e catálogos fixos da TRAKTO.

// Comissão da plataforma sobre cada aluguel concluído (modelo de 8% a 12%
// definido na pesquisa do projeto; 10% é o valor usado no protótipo).
export const COMISSAO_TRAKTO = 0.10;

export const LIMITE_HORAS = { minimo: 1, maximo: 200 };

export const TIPOS_MAQUINA = [
  { nome: 'Trator', icone: 'tractor' },
  { nome: 'Colheitadeira', icone: 'barley' },
  { nome: 'Semeadeira', icone: 'seed-outline' },
  { nome: 'Pulverizador', icone: 'spray' },
  { nome: 'Implemento', icone: 'cog-outline' },
  { nome: 'Transporte', icone: 'truck-outline' },
];

export function iconeDoTipo(tipo) {
  const encontrado = TIPOS_MAQUINA.find(function mesmo(t) { return t.nome === tipo; });
  return encontrado ? encontrado.icone : 'tractor';
}

// Ciclo de vida de uma solicitação de aluguel.
// pendente → aceita → concluida   |   pendente → recusada   |   pendente → cancelada
export const STATUS = {
  pendente: { nome: 'Pendente', icone: 'clock-outline', cor: 'trigoEscuro', fundo: 'trigoClaro' },
  aceita: { nome: 'Aceita', icone: 'check-circle-outline', cor: 'sucesso', fundo: 'sucessoClaro' },
  recusada: { nome: 'Recusada', icone: 'close-circle-outline', cor: 'erro', fundo: 'erroClaro' },
  concluida: { nome: 'Concluída', icone: 'flag-checkered', cor: 'info', fundo: 'infoClaro' },
  cancelada: { nome: 'Cancelada', icone: 'cancel', cor: 'textoSuave', fundo: 'neutroClaro' },
};
