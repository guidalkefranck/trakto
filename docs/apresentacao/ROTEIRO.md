# TRAKTO — Roteiro da apresentação (notas do apresentador)

Slides: https://claude.ai/artifact/V9QhZTiBBwM2Zm7s9W6Nw4 · PDF: [TRAKTO-apresentacao.pdf](TRAKTO-apresentacao.pdf) · tempo total sugerido: ~10 min

## 1. Máquina parada vira colheita.

Bom dia. Eu sou o Guilherme e vou apresentar a TRAKTO, um aplicativo que conecta pequenos produtores rurais que precisam de máquinas com quem tem máquinas paradas. Vou mostrar o problema, a solução, como o sistema foi construído, a parte de segurança com JWT, uma demonstração no APK e o repositório.

## 2. Quem planta pequeno não tem máquina. Quem tem máquina, deixa parada.

O problema: a maior parte dos produtores do Rio Grande do Sul é de agricultura familiar, 80,5% dos estabelecimentos segundo o Censo Agropecuário do IBGE. Muitos não têm máquina própria porque comprar não compensa numa propriedade pequena. Ao mesmo tempo, quem tem máquina deixa ela parada boa parte do ano. Na minha pesquisa com agricultores e empresários da região, a ideia teve 90% de aprovação. O que falta é uma forma organizada de ligar um ao outro.

## 3. TRAKTO: conectando quem precisa com quem tem.

A solução é a TRAKTO. São três tipos de usuário: o produtor, que quer alugar; o proprietário, que quer anunciar as máquinas paradas; e o administrador, que cuida da plataforma. Cada um vê telas diferentes e tem permissões diferentes, e isso é controlado tanto no app quanto na API.

## 4. Do pedido ao serviço concluído

Este é o coração do sistema. O produtor solicita, o pedido fica pendente, o dono aceita ou recusa, e depois marca como concluído. Detalhe importante: o telefone das pessoas só é enviado pela API depois do aceite, e o valor é calculado no servidor com o preço gravado no banco, então ninguém consegue mandar um valor falso. A comissão de 10% vem do modelo de negócio da pesquisa.

## 5. Três camadas, uma única fonte de regras

A arquitetura tem três camadas. O app em React Native faz chamadas com fetch, enviando o token no cabeçalho Authorization Bearer. A API em Node com Express recebe, passa pelos middlewares de autenticação e permissão e acessa o MySQL. Uma decisão que eu tomei: as regras de permissão ficam num único arquivo, usado tanto pelo app quanto pela API, então não tem como os dois discordarem.

## 6. Modelagem em MySQL

No banco são quatro tabelas. Usuários guarda a senha só como hash. Máquinas é a entidade principal do CRUD. Solicitações liga máquina e produtor e guarda o status. E a tokens_revogados serve para o logout funcionar de verdade. O próprio banco também garante regras: e-mail único, níveis e status limitados por ENUM e preço positivo. Aqui eu mostro o Workbench com um SELECT na tabela de usuários para verem o hash.

## 7. A senha nunca é guardada

Primeiro a senha. No cadastro, a API usa bcrypt para gerar o hash, e só ele vai para o banco. Se o banco vazar, ninguém descobre as senhas. No login, o bcrypt.compare refaz o hash e compara. A mensagem de erro é a mesma para e-mail que não existe e senha errada, para não revelar quem tem conta. Também bloqueio depois de cinco tentativas erradas, e ninguém consegue se cadastrar como administrador.

## 8. Cada requisição passa por dois portões

Agora o JWT. No login, a API gera um token assinado com uma chave secreta que fica no .env. Dentro dele vão só o id, o nível, um identificador único e a validade, nada sensível. O app guarda o token e manda em toda requisição como Bearer. Na API, cada rota protegida passa por dois middlewares: o autenticarToken confere a assinatura e a validade, e responde 401 se falhar; o exigirPermissao confere o nível e responde 403 se o nível não pode. Se alguém editar o token para virar admin, a assinatura não bate e a API recusa; isso está nos testes automáticos. No logout, o id do token vai para a tabela de revogados, então o token deixa de valer de verdade.

## 9. Cada nível, só o que pode — conferido na API

São três níveis. A tabela mostra o que cada um pode fazer. O importante é que isso não é só esconder botão: se um produtor chamar a API pelo Postman tentando anunciar uma máquina, recebe 403. Além do nível, a API confere quem é o dono: um proprietário não edita a máquina de outro. E o nível é lido do banco a cada requisição, então mudar o nível de alguém vale na hora. Aqui eu demonstro entrando com perfis diferentes.

## 10. Máquinas: do anúncio à exclusão

O CRUD é das máquinas, a entidade principal. Criar é o anúncio; ler é a busca com filtros e os detalhes; atualizar é editar o anúncio, só o dono ou o admin; e excluir pede confirmação e é bloqueado se tiver um aluguel pendente ou aceito, para não deixar um produtor com pedido de uma máquina que sumiu. Aqui eu demonstro criando, editando e excluindo uma máquina no APK.

## 11. Roteiro ao vivo

Agora a demonstração no celular. Antes: MySQL ligado, npm run api rodando, o app conectado ao IP do computador pela tela de login. Sigo os seis passos: cadastro e login; como proprietário, o CRUD de uma máquina; como produtor, um pedido de aluguel; de volta como proprietário, aceito o pedido; como admin, mudo o nível de alguém; e por fim mostro o Meu perfil e saio. Se der tempo, abro o Workbench e mostro o pedido gravado na tabela solicitacoes.

## 12. O TRAKTO funcionando

Este vídeo mostra o sistema completo funcionando, com a API e o MySQL de verdade. O produtor navega, abre uma máquina e faz um pedido; o valor de R$ 640,00 é calculado pela API. O pedido é gravado no banco e aparece como pendente. Depois, como proprietário, aceito o pedido, e o WhatsApp das partes é liberado. Se a demonstração ao vivo falhar por causa da rede, este vídeo é o plano B. O vídeo também está no repositório, em docs/midia.

## 13. Testado de ponta a ponta com o MySQL

Sobre testes: escrevi um teste automático que faz 37 verificações usando a API e o MySQL de verdade, e todas passaram no computador do laboratório. Também tem 9 testes unitários e um roteiro manual de 16 passos no app. Durante os testes apareceram problemas reais, que eu corrigi: o MySQL do laboratório usava outra porta; o APK não conectava porque o celular não acha o localhost do computador, então criei a configuração de servidor no app; e coloquei um tempo limite para o app não travar.

## 14. Quatro entregas, um histórico só

O repositório guarda o projeto desde a primeira entrega. Aqui eu abro o GitHub e mostro o histórico de commits, organizado por tipo: feat para funcionalidade, fix para correção, docs e test. Na pasta docs tem a proposta e um documento para cada entrega, e o README explica como rodar tudo. Nenhuma senha vai para o GitHub: o arquivo .env com a senha do banco e o segredo do JWT fica fora do Git.

## 15. O TRAKTO instalado no celular

O APK foi gerado com o EAS Build da Expo, a partir do mesmo commit marcado com a tag v1.0.0, e está publicado na aba Releases do GitHub. No vídeo, o app aparece instalado no celular com o ícone da TRAKTO e abre na tela de login. Um cuidado que precisei ter: o celular não enxerga o localhost do computador, então criei a configuração de servidor na tela de login, onde informo o IP do computador. E o Android bloqueia http sem criptografia, então liberei isso no build. Em produção, a API ficaria num servidor com HTTPS.

## 16. API publicada com HTTPS · pagamento no app · mapa das máquinas · avaliações

Para fechar: os próximos passos seriam publicar a API com HTTPS para funcionar fora da rede local, colocar o pagamento dentro do app, um mapa das máquinas e avaliações entre usuários. Obrigado, fico à disposição para perguntas. Perguntas prováveis e respostas estão em docs/ENTREGA4.md, seção 5.
