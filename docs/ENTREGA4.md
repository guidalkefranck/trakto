# Entrega 4 — Finalização, testes, APK e apresentação

**Versão final:** 1.0.0 · **Pacote Android:** `com.guidalke.trakto`

## 1. Finalização técnica

| Item do enunciado | O que foi feito |
|---|---|
| Revisar funcionalidades | Todas as funcionalidades da proposta (RF01–RF15 em [PROPOSTA.md](PROPOSTA.md)) estão implementadas e integradas à API. |
| Corrigir erros | ECONNREFUSED/porta do MySQL (Entrega 3) · texto exagerado sobre segurança da sessão no Perfil · app travava sem resposta quando o IP da API estava errado (agora há tempo limite de 15 s). |
| Testar navegação | Roteiro manual da seção 3 (todas as telas dos 3 níveis). |
| Testar autenticação e permissões | `npm run test:api` (37 verificações) + roteiro manual. |
| Revisar CRUD | Máquinas: criar, listar/filtrar, detalhar, editar, excluir (com confirmação e bloqueio se houver aluguel ativo). |
| Revisar interface e mensagens | Mensagens de erro da API exibidas nas telas, carregamento em todos os botões, "puxar para atualizar", tela de abertura e status da conexão. |
| Organizar o código | Camadas: `screens/` por perfil, `components/ui`, `navigation/`, `constants/` (regras compartilhadas com a API), `services/`, `backend/` (routes, controllers, middlewares). |
| Atualizar README | README com status final, execução, APK e links da documentação. |
| Commit e push da versão final | Tag **v1.0.0** no commit usado para gerar o APK. |
| Gerar o APK | EAS Build, perfil `preview` (seção 2). |

### Ajustes para o app funcionar no celular (APK)

- **Servidor da API configurável no próprio app:** na tela de login, toque no status da conexão → informe o IP do computador que roda a API (ex.: `192.168.0.15:3000`) → *Testar e salvar*. O endereço fica salvo no aparelho. Assim o mesmo APK funciona em casa, na escola ou na apresentação.
- **HTTP liberado no Android:** apps Android bloqueiam `http://` por padrão; o plugin `expo-build-properties` (`usesCleartextTraffic: true` em `app.json`) libera a conexão com a API local. Em produção real o correto seria publicar a API com HTTPS.

## 2. Gerando o APK

Pré-requisito: conta gratuita em [expo.dev](https://expo.dev).

```bash
npm install -g eas-cli
eas login
npm run apk            # = eas build -p android --profile preview
```

- Na primeira vez o EAS pergunta se deve criar o projeto e a chave de assinatura: responda **Yes** às duas.
- O build roda na nuvem da Expo (10 a 30 min). No fim aparece um **link e um QR Code** para baixar o `.apk`.
- O `.apk` é publicado na aba **Releases** do GitHub, na versão **v1.0.0**, junto da tag do commit usado no build — assim o APK corresponde exatamente ao código do repositório.

### Instalando e conectando o APK

1. No celular Android, abra o link do APK e permita "instalar apps desconhecidos".
2. No computador: MySQL ligado e `npm run api` rodando. Descubra o IP com `ipconfig` (Endereço IPv4 do Wi-Fi).
3. Se o celular não conectar, libere a porta 3000 no Firewall do Windows (uma vez, terminal como administrador):
   ```
   netsh advfirewall firewall add rule name="TRAKTO API" dir=in action=allow protocol=TCP localport=3000
   ```
4. No app: status da conexão → `IP:3000` → *Testar e salvar* → ponto verde → entrar.

## 3. Roteiro de testes da versão final

Marque ✅ ao testar no **APK** (ou no navegador com `npx expo start` → `w`).

| # | Teste | Resultado esperado | ✅ |
|---|---|---|---|
| 1 | Abrir o app | Tela de abertura → Login com status verde | |
| 2 | Criar conta (proprietário) | Volta ao login com "Conta criada" | |
| 3 | Entrar com senha errada | "E-mail ou senha inválidos." | |
| 4 | Entrar como **proprietário** | Início com painel do proprietário | |
| 5 | Anunciar máquina | Aparece em *Minhas máquinas* | |
| 6 | Editar o anúncio (preço) | Preço novo nos detalhes | |
| 7 | Fechar e reabrir o app | Continua logado (sessão salva) | |
| 8 | Sair e entrar como **produtor** | Painel do produtor; sem telas de proprietário/admin | |
| 9 | Buscar/filtrar e solicitar aluguel | Pedido *Pendente* com valor calculado | |
| 10 | Entrar como **proprietário** e aceitar | Pedido *Aceito*, WhatsApp do produtor liberado | |
| 11 | Excluir máquina com aluguel aceito | Mensagem de bloqueio (409) | |
| 12 | Concluir o serviço | Renda aparece no Início (−10% comissão) | |
| 13 | Entrar como **admin** | Ver usuários, mudar nível de alguém, moderar anúncio | |
| 14 | Admin tenta mudar o próprio nível | Bloqueado | |
| 15 | Meu perfil → Sair | Volta ao login; o token antigo não vale mais | |
| 16 | `npm run test:api` | "37 verificações passaram" | |

## 4. Roteiro da apresentação (≈ 10 min)

Slides: link no README. Ordem sugerida, seguindo os itens de "Apresentação e defesa" do enunciado:

1. **Problema** (1 min) — agricultura familiar sem máquina própria × máquinas paradas; dados do IBGE e pesquisa.
2. **Solução** (1 min) — TRAKTO conecta quem precisa com quem tem; 3 perfis.
3. **Arquitetura** (1 min) — App (Expo) → `fetch()` → API Express → MySQL.
4. **Demonstração no APK** (4 min) — cadastro → login → produtor solicita → proprietário aceita → CRUD de máquina → admin muda nível.
5. **Segurança** (1,5 min) — hash bcrypt, JWT, Bearer Token, middleware `autenticarToken` + `exigirPermissao`, 401/403.
6. **Banco de dados** (0,5 min) — Workbench: tabelas e `SELECT` mostrando o hash das senhas.
7. **Repositório** (0,5 min) — histórico de commits por entrega, README, release com o APK.
8. **Encerramento** (0,5 min) — evoluções futuras e perguntas.

## 5. Perguntas prováveis na defesa

| Pergunta | Resposta |
|---|---|
| Por que hash e não guardar a senha? | Se o banco vazar, ninguém descobre as senhas. O bcrypt usa um "sal" aleatório e é lento de propósito, dificultando força bruta. No login, `bcrypt.compare` refaz o hash e compara. |
| O que tem dentro do seu JWT? | Só o id (`sub`), o nível, um id único do token (`jti`) e a validade (`exp`). Nada sensível: o JWT é assinado, não criptografado — qualquer um pode ler o conteúdo, mas ninguém consegue alterá-lo sem o `JWT_SECRET`. |
| Como a API sabe quem está chamando? | O app envia `Authorization: Bearer <token>`. O middleware `autenticarToken` confere a assinatura e a validade com `jwt.verify` e busca o usuário no banco. |
| E se alguém editar o token para virar admin? | A assinatura deixa de bater e a API responde 401 (há um teste automático para isso). |
| Esconder botão no app não basta? | Não. A permissão é conferida na API (`exigirPermissao` + regra de dono). Mesmo chamando a API pelo Postman, um produtor recebe 403. |
| Como funciona o logout se o JWT não tem estado? | O id do token (`jti`) é gravado em `tokens_revogados`; o middleware recusa tokens dessa lista. |
| Por que o nível vem do banco e não do token? | Se o admin rebaixar alguém, vale na hora, sem esperar o token expirar. |
| Por que o valor do aluguel é calculado na API? | Para o cliente não conseguir mandar um valor falso; a API usa o preço gravado no banco. |
| Qual a diferença entre 401 e 403? | 401: não sei quem você é (sem token/inválido). 403: sei quem você é, mas seu nível não pode fazer isso. |
| O que você faria a seguir? | Publicar a API com HTTPS, pagamento no app, mapa das máquinas e avaliações. |

## 6. Decisões técnicas

| Decisão | Por quê |
|---|---|
| Mesma matriz de permissões no app e na API (`constants/`) | Uma fonte única de regras: o app só mostra o que a API vai aceitar. |
| `X-Usuario-Id` na Entrega 2 → JWT na Entrega 3 | Evolução por etapas: controllers e permissões ficaram prontos antes e não mudaram com o JWT. |
| Revogação de token no logout | JWT puro continuaria válido até expirar; a tabela `tokens_revogados` torna o logout real. |
| Telefone só após o aceite (regra no servidor) | Privacidade: o dado nem chega ao app antes da hora. |
| Exclusão bloqueada com aluguel ativo (409) | Não deixar o produtor com um pedido para uma máquina que sumiu. |
| Servidor da API configurável no app | O APK precisa do IP do computador, que muda conforme a rede. |
