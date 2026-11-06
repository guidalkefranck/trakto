// Validações da API. O app também valida, mas qualquer pessoa pode chamar a
// API diretamente (Postman, curl...), então o servidor nunca confia no cliente.
import { LIMITE_HORAS, TIPOS_MAQUINA } from '../../constants/negocio.js';

const TIPOS = TIPOS_MAQUINA.map(function nome(t) { return t.nome; });

export function idValido(id) {
  return /^\d+$/.test(String(id)) && Number(id) > 0 && Number(id) <= 4294967295;
}

export function emailValido(email) {
  return typeof email === 'string' && email.length <= 150 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function senhaValida(senha) {
  // bcrypt usa no máximo 72 bytes; acima disso a senha seria truncada sem aviso.
  return typeof senha === 'string' && senha.length >= 8 && senha.trim().length > 0 && Buffer.byteLength(senha, 'utf8') <= 72;
}

function texto(valor) { return typeof valor === 'string' ? valor.trim() : ''; }

// Devolve { erro } ou { dados } já limpos, só com os campos permitidos.
export function validarCadastroUsuario(corpo) {
  const dados = {
    nome: texto(corpo.nome),
    email: texto(corpo.email).toLowerCase(),
    telefone: texto(corpo.telefone),
    cidade: texto(corpo.cidade),
    senha: corpo.senha,
    // Só os perfis de uso podem ser escolhidos no cadastro público (RN01).
    nivel: corpo.nivel === 'proprietario' ? 'proprietario' : 'produtor',
  };
  if (dados.nome.length < 3 || dados.nome.length > 100) { return { erro: 'Informe o nome completo (3 a 100 caracteres).' }; }
  if (!emailValido(dados.email)) { return { erro: 'Informe um e-mail válido.' }; }
  if (dados.telefone.replace(/\D/g, '').length < 10 || dados.telefone.length > 20) { return { erro: 'Informe um telefone com DDD.' }; }
  if (!dados.cidade || dados.cidade.length > 80) { return { erro: 'Informe a cidade (até 80 caracteres).' }; }
  if (!senhaValida(dados.senha)) { return { erro: 'A senha precisa ter de 8 a 72 caracteres.' }; }
  return { dados };
}

export function validarMaquina(corpo) {
  const preco = Number(corpo.precoHora);
  const dados = {
    nome: texto(corpo.nome),
    tipo: texto(corpo.tipo),
    potencia: texto(corpo.potencia) || null,
    cidade: texto(corpo.cidade),
    precoHora: preco,
    disponivel: corpo.disponivel === undefined ? true : Boolean(corpo.disponivel),
    comOperador: Boolean(corpo.comOperador),
    descricao: texto(corpo.descricao) || null,
  };
  if (dados.nome.length < 3 || dados.nome.length > 120) { return { erro: 'Informe o nome da máquina (3 a 120 caracteres).' }; }
  if (!TIPOS.includes(dados.tipo)) { return { erro: 'Tipo inválido. Use: ' + TIPOS.join(', ') + '.' }; }
  if (dados.potencia && dados.potencia.length > 40) { return { erro: 'A potência deve ter até 40 caracteres.' }; }
  if (!dados.cidade || dados.cidade.length > 80) { return { erro: 'Informe a cidade (até 80 caracteres).' }; }
  if (!Number.isFinite(preco) || preco <= 0 || preco > 99999999.99) { return { erro: 'Informe um preço por hora maior que zero.' }; }
  if (dados.descricao && dados.descricao.length > 500) { return { erro: 'A descrição deve ter até 500 caracteres.' }; }
  dados.precoHora = Math.round(preco * 100) / 100;
  return { dados };
}

// Data no formato da API (AAAA-MM-DD), real e de hoje em diante.
export function dataServicoValida(valor, hoje = new Date()) {
  const partes = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor || ''));
  if (!partes) { return false; }
  const ano = Number(partes[1]); const mes = Number(partes[2]) - 1; const dia = Number(partes[3]);
  const data = new Date(ano, mes, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes || data.getDate() !== dia) { return false; }
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return data >= inicioHoje;
}

export function validarSolicitacao(corpo, hoje = new Date()) {
  const horas = Number(corpo.horas);
  const dados = {
    maquinaId: corpo.maquinaId,
    dataServico: texto(corpo.dataServico),
    horas,
    observacao: texto(corpo.observacao) || null,
  };
  if (!idValido(dados.maquinaId)) { return { erro: 'Informe a máquina (maquinaId).' }; }
  if (!dataServicoValida(dados.dataServico, hoje)) { return { erro: 'Informe uma data válida (AAAA-MM-DD), de hoje em diante.' }; }
  if (!Number.isFinite(horas) || horas < LIMITE_HORAS.minimo || horas > LIMITE_HORAS.maximo) {
    return { erro: 'Informe entre ' + LIMITE_HORAS.minimo + ' e ' + LIMITE_HORAS.maximo + ' horas.' };
  }
  if (dados.observacao && dados.observacao.length > 300) { return { erro: 'A observação deve ter até 300 caracteres.' }; }
  dados.maquinaId = Number(dados.maquinaId);
  dados.horas = Math.round(horas * 10) / 10;
  return { dados };
}

// Quem pode levar uma solicitação de um status para outro (RN06).
export const TRANSICOES = {
  aceita: { de: ['pendente'], quem: 'dono' },
  recusada: { de: ['pendente'], quem: 'dono' },
  concluida: { de: ['aceita'], quem: 'dono' },
  cancelada: { de: ['pendente'], quem: 'produtor' },
};
