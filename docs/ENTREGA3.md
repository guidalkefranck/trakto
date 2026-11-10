# Entrega 3 — Autenticação, JWT, níveis e sistema funcional

```
CADASTRO ──▶ LOGIN ──▶ JWT ──▶ NÍVEL ──▶ PERMISSÃO ──▶ CRUD
 bcrypt     compare    sign     banco    middleware    MySQL
```

## 1. Cadastro, login e proteção da senha

| Etapa | Onde | Como |
|---|---|---|
| Cadastro | `POST /auth/cadastro` → [`authController.cadastrar`](../backend/controllers/authController.js) | Valida todos os campos no servidor; o perfil público só pode ser `produtor` ou `proprietario` (nunca `admin`). |
| Hash da senha | `bcrypt.hash(senha, 10)` | Só o hash (`$2b$10$…`) é gravado em `usuarios.senha`. A senha original não é salva nem devolvida. |
| Login | `POST /auth/login` → `authController.login` | `bcrypt.compare` confere a senha. A mensagem é a mesma para e-mail inexistente e senha errada (não revela quem tem conta). |
| Força bruta | [`limitarTentativas`](../backend/middlewares/limitarTentativas.js) | 5 tentativas erradas por e-mail + IP a cada 15 min → **429**. |

## 2. JWT e sessão

| Etapa | Onde | Como |
|---|---|---|
| Geração | [`utils/token.js`](../backend/utils/token.js) → `jwt.sign` | Payload mínimo: `sub` (id), `nivel`, `jti` (id único), `exp`. Algoritmo HS256 com `JWT_SECRET` (≥ 32 caracteres, no `.env`). Validade em `JWT_EXPIRA_EM` (padrão 8h). |
| Armazenamento | [`services/sessao.js`](../services/sessao.js) | Token + usuário salvos no **AsyncStorage** do aparelho. |
| Envio | [`services/api.js`](../services/api.js) | Toda requisição leva `Authorization: Bearer <token>`. |
| Validação | [`middlewares/autenticarToken.js`](../backend/middlewares/autenticarToken.js) | `jwt.verify` confere assinatura e validade; recusa tokens revogados; busca o usuário **atual** no banco (nível sempre do banco). |
| Manter a sessão | `App.js` + `GET /auth/me` | Ao reabrir o app, o token salvo é validado na API; o usuário continua logado. |
| Expiração | `api.quandoSessaoExpirar` | Se a API responder 401 com token, o app apaga a sessão e volta ao login avisando. |
| Logout | `POST /auth/logout` | O `jti` do token vai para a tabela `tokens_revogados`: o token deixa de valer **no servidor**, não só no aparelho. |

## 3. Controle de acesso (back-end)

1. `autenticarToken` → sem token ou token inválido: **401**.
2. `exigirPermissao('acao')` → usa a matriz [`constants/permissoes.js`](../constants/permissoes.js), a **mesma** do app → nível sem permissão: **403**.
3. Regras de dono nos controllers → ex.: só o dono (ou admin) edita/exclui a máquina; só o dono responde ao pedido; só o produtor cancela o próprio pedido → **403**.

| Rota | Produtor | Proprietário | Admin |
|---|:---:|:---:|:---:|
| `GET /maquinas`, `GET /maquinas/:id` | ✅ | ✅ | ✅ |
| `POST /maquinas` | 403 | ✅ | 403 |
| `PUT/DELETE /maquinas/:id` | 403 | ✅ só as suas | ✅ moderação |
| `POST /solicitacoes` | ✅ | 403 | 403 |
| `PATCH /solicitacoes/:id/status` | cancelar as suas | aceitar/recusar/concluir das suas máquinas | 403 |
| `GET /usuarios`, `PATCH /usuarios/:id/nivel` | 403 | 403 | ✅ |

## 4. CRUD da entidade principal (máquinas)

| Operação | Rota | Tela do app |
|---|---|---|
| **C**reate | `POST /maquinas` | Anunciar máquina (`FormularioMaquina`) |
| **R**ead | `GET /maquinas`, `GET /maquinas/:id` | Máquinas, Detalhes, Minhas máquinas |
| **U**pdate | `PUT /maquinas/:id` | Editar anúncio |
| **D**elete | `DELETE /maquinas/:id` | Excluir anúncio (com confirmação; bloqueado se houver aluguel ativo) |

## 5. Testes

| Comando | O que testa |
|---|---|
| `npm test` | 9 testes unitários: JWT (geração, adulteração, segredo errado, Bearer) e validações |
| `npm run test:api` | **37 verificações de ponta a ponta** com a API rodando e o MySQL: cadastro, hash, login, JWT, 401/403, CRUD completo, ciclo de status e logout |
| [`backend/requisicoes.http`](../backend/requisicoes.http) | Chamadas manuais no VS Code (REST Client) já usando os tokens |

## 6. Mudanças em relação à Entrega 2

- `identificarUsuario` (cabeçalho `X-Usuario-Id`, provisório) foi **removido** e substituído por `autenticarToken` (JWT). Controllers e permissões não precisaram mudar.
- Novas rotas: `GET /auth/me` e `POST /auth/logout`. `GET /usuarios/eu` foi substituída por `/auth/me`.
- Nova tabela `tokens_revogados` em `database/trakto.sql` (o script pode ser executado de novo sem apagar dados).
- App: sessão persistente, tela de abertura, tela **Meu perfil** (dados, validade do token e permissões do nível) e logout real.
