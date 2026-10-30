// ENTREGA 1 — dados fictícios em memória.
// Simulam o que virá do banco MySQL. Na Entrega 2 este arquivo é substituído
// por services/api.js (fetch() para a API Express); na Entrega 3 o login passa
// a ser validado no servidor com senha em hash (bcrypt) e JWT.
// Os campos já seguem o modelo das tabelas planejadas (docs/PROPOSTA.md).

// Contas de demonstração — nenhuma senha real.
export const usuariosIniciais = [
  { id: 1, nome: 'João Schneider', email: 'produtor@trakto.com', senha: '123456', telefone: '(51) 99999-1001', cidade: 'Lajeado', nivel: 'produtor' },
  { id: 2, nome: 'Marta Kunz', email: 'proprietario@trakto.com', senha: '123456', telefone: '(51) 99999-2002', cidade: 'Estrela', nivel: 'proprietario' },
  { id: 3, nome: 'Equipe TRAKTO', email: 'admin@trakto.com', senha: '123456', telefone: '(51) 99999-3003', cidade: 'Lajeado', nivel: 'admin' },
  { id: 4, nome: 'Paulo Hammes', email: 'paulo@trakto.com', senha: '123456', telefone: '(51) 99999-4004', cidade: 'Teutônia', nivel: 'proprietario' },
  { id: 5, nome: 'Ana Weber', email: 'ana@trakto.com', senha: '123456', telefone: '(51) 99999-5005', cidade: 'Arroio do Meio', nivel: 'produtor' },
];

export const maquinasIniciais = [
  { id: 1, proprietarioId: 2, nome: 'Trator Valtra A750', tipo: 'Trator', potencia: '75 cv', cidade: 'Lajeado', precoHora: 150, disponivel: true, comOperador: true,
    descricao: 'Trator 4x4 revisado, ideal para preparo de solo e transporte em pequenas propriedades.' },
  { id: 2, proprietarioId: 2, nome: 'Semeadeira Múltipla 7 linhas', tipo: 'Semeadeira', potencia: 'Tração 60 cv+', cidade: 'Estrela', precoHora: 80, disponivel: true, comOperador: false,
    descricao: 'Semeadeira para milho, soja e feijão. Regulagem de espaçamento inclusa na entrega.' },
  { id: 3, proprietarioId: 4, nome: 'Pulverizador Jacto 600 L', tipo: 'Pulverizador', potencia: 'Barras de 12 m', cidade: 'Teutônia', precoHora: 95, disponivel: true, comOperador: true,
    descricao: 'Pulverizador de barras com bicos novos. Indicado para lavouras de até 20 hectares.' },
  { id: 4, proprietarioId: 4, nome: 'Colheitadeira New Holland TC5070', tipo: 'Colheitadeira', potencia: '175 cv', cidade: 'Teutônia', precoHora: 420, disponivel: false, comOperador: true,
    descricao: 'Colheitadeira para grãos com plataforma de 17 pés. Alugada sempre com operador experiente.' },
  { id: 5, proprietarioId: 2, nome: 'Grade Aradora 14 discos', tipo: 'Implemento', potencia: 'Tração 75 cv+', cidade: 'Estrela', precoHora: 60, disponivel: true, comOperador: false,
    descricao: 'Grade aradora para preparo de solo e incorporação de restos culturais.' },
  { id: 6, proprietarioId: 4, nome: 'Caminhão Ford Cargo 816', tipo: 'Transporte', potencia: 'Carga de 4 t', cidade: 'Teutônia', precoHora: 110, disponivel: true, comOperador: true,
    descricao: 'Transporte de safra, insumos e pequenos implementos na região do Vale do Taquari.' },
  { id: 7, proprietarioId: 2, nome: 'Trator Massey Ferguson 275', tipo: 'Trator', potencia: '75 cv', cidade: 'Lajeado', precoHora: 130, disponivel: true, comOperador: false,
    descricao: 'Trator clássico, econômico e de manutenção simples. Ótimo para serviços leves.' },
];

export const solicitacoesIniciais = [
  { id: 1, maquinaId: 1, produtorId: 1, data: '05/11/2026', horas: 6, valorTotal: 900, status: 'pendente',
    observacao: 'Preparo de solo para plantio de milho, 3 hectares.' },
  { id: 2, maquinaId: 3, produtorId: 1, data: '22/10/2026', horas: 4, valorTotal: 380, status: 'concluida',
    observacao: 'Aplicação na lavoura de soja.' },
  { id: 3, maquinaId: 2, produtorId: 1, data: '10/11/2026', horas: 5, valorTotal: 400, status: 'aceita', observacao: '' },
  { id: 4, maquinaId: 5, produtorId: 5, data: '08/11/2026', horas: 3, valorTotal: 180, status: 'pendente',
    observacao: 'Gradear área de 2 hectares antes do plantio.' },
];
