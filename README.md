# 🚜 TRAKTO — Aluguel fácil de máquinas e serviços agrícolas

> **Conectando quem precisa com quem tem.**

Aplicação mobile (React Native + Expo) que conecta **pequenos produtores rurais** que precisam de máquinas agrícolas a **proprietários com maquinário ocioso**, por meio de um fluxo simples de anúncio, busca e solicitação de aluguel.

**Autor:** Guilherme Dalke — 3º ano do Ensino Médio Técnico
**Projeto Avaliativo:** Aplicação Mobile com JWT e Níveis de Usuário

![React Native](https://img.shields.io/badge/React%20Native-0.88-2E5B34) ![Expo](https://img.shields.io/badge/Expo-SDK%2058-2E5B34) ![React Navigation](https://img.shields.io/badge/React%20Navigation-7-E8A93A) ![Status](https://img.shields.io/badge/Entrega-3%20de%204-8B5E3C) ![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-1C3A21) ![Node](https://img.shields.io/badge/Node.js-Express%205-2E5B34) ![MySQL](https://img.shields.io/badge/MySQL-8-E8A93A)

> 📄 **Documento completo da proposta** — personas, requisitos funcionais e não funcionais, regras de negócio, modelo de dados e rotas da API: **[docs/PROPOSTA.md](docs/PROPOSTA.md)**

| Entrega | Conteúdo | Situação |
|---|---|---|
| 1 | Proposta, estrutura inicial, telas e navegação | ✅ Entregue |
| 2 | Modelagem, MySQL, API Express e integração com `fetch()` | ✅ Entregue — veja **[docs/ENTREGA2.md](docs/ENTREGA2.md)** |
| 3 | Cadastro, login, hash, JWT, níveis, rotas protegidas e CRUD completo | ✅ Entregue — veja **[docs/ENTREGA3.md](docs/ENTREGA3.md)** |
| 4 | Testes, correções, APK e apresentação | ⏳ |

---

## 1. Problema identificado

O acesso a máquinas agrícolas ainda é um desafio para a agricultura familiar:

- Muitos **pequenos produtores não possuem maquinário próprio** e dependem de favores, empréstimos informais ou de prestadores difíceis de encontrar.
- **Comprar máquinas novas tem custo muito alto** — um trator de pequeno porte pode custar o equivalente a vários anos de lucro de uma pequena propriedade.
- Ao mesmo tempo, **existem máquinas ociosas** na região que passam boa parte do ano paradas.
- **Falta uma forma simples de conectar quem precisa com quem tem.** Hoje a negociação acontece de boca a boca, por grupos de mensagens ou por telefone, sem organização de datas, preços e disponibilidade.

## 2. Contexto e público afetado

- **Região-foco:** Vale do Taquari (RS), onde **mais de 80% dos agricultores são de base familiar** (fonte: IBGE).
- **Público potencial estimado:** de **40 a 45 mil produtores** apenas no Vale do Taquari.
- **Público-alvo:**
  - **Produtores rurais** (principalmente pequenos e familiares) que precisam de máquinas por algumas horas ou dias;
  - **Proprietários de máquinas** (produtores maiores, prestadores de serviço, cooperativas) que querem gerar renda com equipamentos parados.

## 3. Justificativa

Em uma pesquisa inicial com agricultores e empresários locais, a ideia teve **90% de aprovação**. Uma plataforma de aluguel compartilhado:

- **reduz custos** de produção para quem não pode comprar máquinas;
- **aumenta a renda** de quem tem máquinas ociosas;
- **melhora o aproveitamento** do maquinário já existente na região;
- **facilita o acesso à tecnologia** no campo e incentiva a **economia de uso compartilhado**.

O celular é o meio mais acessível para o produtor rural, por isso a solução é um **aplicativo mobile**.

## 4. Proposta de solução

A **TRAKTO** é um aplicativo onde:

1. o **proprietário** anuncia suas máquinas (tipo, potência, cidade, preço por hora e disponibilidade);
2. o **produtor** busca máquinas por nome, cidade e tipo, vê os detalhes e **solicita o aluguel** informando data e horas — o app calcula o valor estimado;
3. o proprietário **aceita ou recusa** a solicitação; quando aceita, o **contato (WhatsApp) é liberado** para as duas partes combinarem os detalhes;
4. após o serviço, a solicitação é marcada como **concluída**;
5. o **administrador** gerencia usuários e níveis de acesso e modera anúncios irregulares.

**Diferencial em relação a um catálogo simples:** a TRAKTO tem um **fluxo de status entre dois usuários** e **permissões por dono do registro** (cada proprietário só edita as próprias máquinas e só responde a pedidos das próprias máquinas).

```
Produtor solicita ──► PENDENTE ──► Proprietário aceita ──► ACEITA ──► CONCLUÍDA
                         │                    │
                         │                    └─► Proprietário recusa ──► RECUSADA
                         └─► Produtor cancela ──► CANCELADA
```

**Fora do escopo** (possíveis evoluções futuras): pagamento dentro do app, cobrança automática da comissão, mapa/GPS, chat interno e avaliações.

## 5. Tipos de usuário e permissões

| Funcionalidade | Produtor | Proprietário | Admin |
|---|:---:|:---:|:---:|
| Criar conta e fazer login | ✅ | ✅ | ✅ |
| Buscar e ver detalhes de máquinas | ✅ | ✅ | ✅ |
| Solicitar aluguel | ✅ | — | — |
| Ver e cancelar **as próprias** solicitações | ✅ | — | — |
| Cadastrar, editar e excluir **as próprias** máquinas | — | ✅ | — |
| Aceitar, recusar e concluir solicitações **das próprias** máquinas | — | ✅ | — |
| Ver todas as solicitações | — | — | ✅ |
| Editar ou remover **qualquer** anúncio (moderação) | — | — | ✅ |
| Gerenciar usuários e alterar níveis | — | — | ✅ |

- No cadastro público o usuário escolhe entre **Produtor** e **Proprietário**. O nível **Admin** só pode ser concedido por outro administrador.
- As regras estão centralizadas em **[`constants/permissoes.js`](constants/permissoes.js)** (`pode(usuario, acao)` e `podeAlterarMaquina`) e são usadas tanto pela navegação quanto pelas telas.
- Na Entrega 3, cada permissão será **validada no back-end** (middleware que lê o JWT enviado como *Bearer Token* e confere o nível e o dono do registro). Esconder botões no app é apenas visual.

## 6. Principais funcionalidades

- Cadastro com escolha de perfil e login
- Página inicial personalizada por nível (indicadores e atalhos)
- Busca de máquinas por texto, filtro por tipo e por disponibilidade
- Detalhes da máquina e do anunciante
- Solicitação de aluguel com cálculo do valor estimado
- Acompanhamento de solicitações por status (pendente, aceita, recusada, concluída, cancelada)
- CRUD de máquinas pelo proprietário (entidade principal)
- Resposta às solicitações recebidas (aceitar, recusar, concluir)
- Gerenciamento de usuários e níveis pelo administrador

## 7. Telas

| # | Tela | Arquivo | Quem acessa |
|---|---|---|---|
| 1 | Login | `screens/publico/Login.js` | público |
| 2 | Criar conta | `screens/publico/CadastroUsuario.js` | público |
| 3 | Início (painel por nível) | `screens/comum/Home.js` | todos logados |
| 4 | Máquinas disponíveis (busca e filtros) | `screens/comum/Maquinas.js` | todos logados |
| 5 | Detalhes da máquina | `screens/comum/DetalhesMaquina.js` | todos logados |
| 6 | Solicitar aluguel | `screens/produtor/SolicitarAluguel.js` | produtor |
| 7 | Minhas solicitações | `screens/produtor/MinhasSolicitacoes.js` | produtor |
| 8 | Minhas máquinas | `screens/proprietario/MinhasMaquinas.js` | proprietário |
| 9 | Cadastrar / editar máquina | `screens/proprietario/FormularioMaquina.js` | proprietário, admin |
| 10 | Solicitações recebidas | `screens/proprietario/SolicitacoesRecebidas.js` | proprietário, admin |
| 11 | Gerenciar usuários | `screens/admin/Usuarios.js` | admin |

## 8. Fluxo de navegação

```mermaid
flowchart TD
    L[Login] -->|Criar conta| C[Cadastro]
    C -->|Conta criada| L
    L -->|Entrar| H{Início<br/>conforme o nível}

    H -->|Produtor| M[Máquinas]
    M --> D[Detalhes da máquina]
    D --> S[Solicitar aluguel]
    S --> MS[Minhas solicitações]
    H -->|Produtor| MS

    H -->|Proprietário| MM[Minhas máquinas]
    MM --> F[Cadastrar / editar máquina]
    MM --> D
    D -->|Dono| F
    H -->|Proprietário| R[Solicitações recebidas]

    H -->|Admin| U[Gerenciar usuários]
    H -->|Admin| M
    H -->|Admin| R
    D -->|Admin: moderação| F

    H -->|Sair| L
```

A navegação usa **React Navigation (native stack)**. As telas disponíveis mudam conforme o login: sem sessão, apenas *Login* e *Cadastro*; com sessão, a pilha é montada de acordo com o nível do usuário (o botão Voltar não reabre uma sessão encerrada).

## 9. Estrutura do projeto

```text
trakto/
├── App.js                    # estado da sessão e dos dados + ações (entrar, salvar, alterar status…)
├── index.js                  # ponto de entrada do Expo
├── app.json                  # nome, ícones, splash e pacote Android
├── navigation/
│   └── Rotas.js              # React Navigation: rotas públicas e privadas guiadas por permissão
├── screens/                  # telas agrupadas por perfil de acesso
│   ├── publico/              # Login, CadastroUsuario
│   ├── comum/                # Home, Maquinas, DetalhesMaquina
│   ├── produtor/             # SolicitarAluguel, MinhasSolicitacoes
│   ├── proprietario/         # MinhasMaquinas, FormularioMaquina, SolicitacoesRecebidas
│   └── admin/                # Usuarios
├── components/
│   ├── ui/                   # biblioteca visual: Botao, Campo, Cartao, Chip, Aviso, Toast, Avatar…
│   ├── Logo.js               # marca da TRAKTO
│   ├── CartaoMaquina.js      # cartão da listagem de máquinas
│   ├── CartaoSolicitacao.js  # cartão do pedido com linha do tempo e contato
│   ├── LinhaDoTempo.js       # Enviada → Aceita → Concluída
│   ├── Indicador.js          # número de destaque dos painéis
│   └── AcaoRapida.js         # atalhos da tela inicial
├── constants/
│   ├── permissoes.js         # níveis e matriz de permissões (pode / podeAlterarMaquina)
│   └── negocio.js            # comissão, limites, tipos de máquina, ciclo de status
├── theme/
│   └── tema.js               # design system: cores, espaçamentos, raios, fontes, sombras
├── utils/
│   └── formatadores.js       # moeda, máscaras de data/telefone, validações
├── services/
│   └── api.js                # todas as chamadas fetch() para a API
├── backend/                  # API Node.js + Express (veja docs/ENTREGA2.md)
├── database/
│   └── trakto.sql            # script do banco MySQL
├── assets/                   # ícone, ícone adaptativo Android, splash, favicon
└── docs/
    └── PROPOSTA.md           # documento completo da proposta
```

**Camadas:** as *telas* só montam a interface; as *regras* (permissões, comissão, status) ficam em `constants/`; o *visual* vem de `theme/` + `components/ui/`; os *dados* chegam pelo `App.js` (via `services/api.js` com `fetch()` → API Express → MySQL).

## 10. Identidade visual

| Cor | Hex | Uso |
|---|---|---|
| 🟩 Verde lavoura | `#2E5B34` | cor principal, botões |
| 🟨 Amarelo trigo | `#E8A93A` | destaques e chamadas |
| 🟫 Marrom terra | `#8B5E3C` | etiquetas e detalhes |
| ⬜ Palha | `#F7F4EC` | fundo |

O símbolo é um **"T" com dois sulcos de lavoura** em amarelo trigo. Ícones: Material Community Icons (`@expo/vector-icons`, já incluído no Expo). Os valores ficam em [`theme/tema.js`](theme/tema.js).

## 11. Tecnologias

**Entrega 1:** React Native · Expo SDK 58 · React Navigation 7 (native stack) · @expo/vector-icons · JavaScript (ES Modules)
**Próximas entregas:** Node.js · Express · MySQL (mysql2) · bcryptjs · jsonwebtoken · AsyncStorage · EAS Build (APK)

## 12. Como executar (Entrega 2: app + API + MySQL)

Pré-requisitos: **Node.js 20+**, **MySQL 8** (com Workbench) e o app **Expo Go** no celular (ou navegador).

```bash
# 1. Dependências do app e da API
npm install

# 2. Banco de dados: abra database/trakto.sql no MySQL Workbench e execute (⚡)

# 3. Configuração da API: copie backend/.env.example para backend/.env,
#    coloque a senha do SEU MySQL em DB_PASSWORD e um segredo em JWT_SECRET
copy backend\.env.example backend\.env        # Windows  (Linux/Mac: cp)

# 4. Dados de demonstração (contas, máquinas e pedidos; senhas em hash)
npm run db:popular

# 5. API (deixe este terminal aberto)
npm run api            # → http://localhost:3000  e  "Conectada ao MySQL"

# 6. App (em outro terminal)
npx expo start         # w = navegador · QR Code = Expo Go
```

**No celular (Expo Go):** copie `.env.example` para `.env` na raiz e troque `localhost` pelo IP do computador (comando `ipconfig`), por exemplo `EXPO_PUBLIC_API_URL=http://192.168.0.15:3000`. Celular e computador precisam estar no mesmo Wi-Fi.

**JWT_SECRET:** gere um segredo com `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` e cole em `backend/.env`. Sem ele a API não inicia (de propósito).

**Testes:** `npm test` (unitários: JWT e validações) · `npm run test:api` (37 verificações de ponta a ponta, com a API rodando) · chamadas manuais em [`backend/requisicoes.http`](backend/requisicoes.http).

> Atualizando da Entrega 2? Execute de novo `database/trakto.sql` no Workbench (cria a tabela `tokens_revogados` sem apagar dados) e acrescente `JWT_SECRET` e `JWT_EXPIRA_EM` ao seu `backend/.env`.

### Contas de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Produtor | `produtor@trakto.com` | `trakto123` |
| Proprietário | `proprietario@trakto.com` | `trakto123` |
| Admin | `admin@trakto.com` | `trakto123` |

> As senhas ficam no MySQL **somente como hash bcrypt**. Nenhuma senha real ou `.env` vai para o repositório.

## 13. Roteiro de teste rápido

1. Entre como **Produtor** → toque na busca → filtre por *Trator* → abra o **Trator Valtra A750** → *Solicitar aluguel* (data futura + 6 h) → o pedido aparece como **Pendente** em *Minhas solicitações*, com a linha do tempo.
2. Saia e entre como **Proprietário** → o alerta mostra os pedidos aguardando → **Aceitar** → o WhatsApp do produtor é liberado → *Marcar serviço como concluído* → a renda (já sem a comissão de 10%) aparece no Início.
3. Ainda como proprietário → *Anunciar máquina* → publique → abra em *Minhas máquinas* → **Editar** → **Excluir** (com confirmação). Tente abrir a máquina de outro proprietário: não há botões de edição.
4. Entre como **Admin** → *Usuários* → altere o nível de um usuário (o próprio nível fica bloqueado) → *Moderar anúncios* → remova um anúncio.
5. Volte ao login como **Produtor**: as telas de proprietário e admin não existem na navegação desse perfil.

---

*O projeto de loja online usado em aula serviu apenas como **referência técnica** de arquitetura (sessão no `App.js`, componentes por Props e futura API com JWT). Tema, problema, regras de negócio, telas e identidade visual são autorais.*
