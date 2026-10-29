// ENTREGA 1 — dados fictícios em memória.
// Servem apenas para demonstrar telas e navegação. Na Entrega 2 estes dados
// passam a vir da API (Node.js/Express + MySQL) via fetch(), e na Entrega 3
// o login será validado no servidor com senha em hash (bcrypt) e JWT.

export const NIVEIS = {
  produtor: 'Produtor rural',
  proprietario: 'Proprietário de máquinas',
  admin: 'Administrador',
};

export const TIPOS_MAQUINA = ['Trator', 'Colheitadeira', 'Semeadeira', 'Pulverizador', 'Implemento', 'Transporte'];

export const ICONES_TIPO = {
  Trator: '🚜', Colheitadeira: '🌾', Semeadeira: '🌱', Pulverizador: '💧', Implemento: '⚙️', Transporte: '🚚',
};

// Contas de demonstração (somente Entrega 1 — nenhuma senha real).
export const usuariosIniciais = [
  { id: 1, nome: 'João Schneider', email: 'produtor@trakto.com', senha: '123456', telefone: '(51) 99999-1001', cidade: 'Lajeado', nivel: 'produtor' },
  { id: 2, nome: 'Marta Kunz', email: 'proprietario@trakto.com', senha: '123456', telefone: '(51) 99999-2002', cidade: 'Estrela', nivel: 'proprietario' },
  { id: 3, nome: 'Equipe TRAKTO', email: 'admin@trakto.com', senha: '123456', telefone: '(51) 99999-3003', cidade: 'Lajeado', nivel: 'admin' },
  { id: 4, nome: 'Paulo Hammes', email: 'paulo@trakto.com', senha: '123456', telefone: '(51) 99999-4004', cidade: 'Teutônia', nivel: 'proprietario' },
];

export const maquinasIniciais = [
  { id: 1, proprietarioId: 2, nome: 'Trator Valtra A750', tipo: 'Trator', potencia: '75 cv', cidade: 'Lajeado', precoHora: 150, disponivel: true,
    descricao: 'Trator 4x4 revisado, ideal para preparo de solo e transporte em pequenas propriedades. Pode ir com operador.' },
  { id: 2, proprietarioId: 2, nome: 'Semeadeira Múltipla 7 linhas', tipo: 'Semeadeira', potencia: 'Tração 60 cv+', cidade: 'Estrela', precoHora: 80, disponivel: true,
    descricao: 'Semeadeira para milho, soja e feijão. Regulagem de espaçamento inclusa na entrega.' },
  { id: 3, proprietarioId: 4, nome: 'Pulverizador Jacto 600 L', tipo: 'Pulverizador', potencia: 'Acoplado ao trator', cidade: 'Teutônia', precoHora: 95, disponivel: true,
    descricao: 'Pulverizador de barras de 12 m, bicos novos. Indicado para lavouras de até 20 ha.' },
  { id: 4, proprietarioId: 4, nome: 'Colheitadeira New Holland TC5070', tipo: 'Colheitadeira', potencia: '175 cv', cidade: 'Teutônia', precoHora: 420, disponivel: false,
    descricao: 'Colheitadeira para grãos com plataforma de 17 pés. Sempre alugada com operador experiente.' },
  { id: 5, proprietarioId: 2, nome: 'Grade Aradora 14 discos', tipo: 'Implemento', potencia: 'Tração 75 cv+', cidade: 'Estrela', precoHora: 60, disponivel: true,
    descricao: 'Grade aradora para preparo e incorporação de restos culturais.' },
  { id: 6, proprietarioId: 4, nome: 'Caminhão Ford Cargo 816', tipo: 'Transporte', potencia: '4 t', cidade: 'Teutônia', precoHora: 110, disponivel: true,
    descricao: 'Transporte de safra, insumos e pequenos implementos na região do Vale do Taquari.' },
];

export const solicitacoesIniciais = [
  { id: 1, maquinaId: 1, produtorId: 1, data: '05/11/2026', horas: 6, valorTotal: 900, status: 'pendente',
    observacao: 'Preparo de solo para plantio de milho, 3 ha.' },
  { id: 2, maquinaId: 3, produtorId: 1, data: '22/10/2026', horas: 4, valorTotal: 380, status: 'concluida',
    observacao: 'Aplicação na lavoura de soja.' },
  { id: 3, maquinaId: 2, produtorId: 1, data: '10/11/2026', horas: 5, valorTotal: 400, status: 'aceita',
    observacao: '' },
];
