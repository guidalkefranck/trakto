-- =====================================================================
-- TRAKTO — Banco de dados (MySQL 8)
-- Plataforma de aluguel de máquinas e serviços agrícolas
--
-- Como usar: abra este arquivo no MySQL Workbench e execute tudo (⚡).
-- Depois rode `npm run db:popular` para criar as contas e os dados de
-- demonstração (as senhas são gravadas com hash bcrypt pelo script).
--
-- O script é idempotente: IF NOT EXISTS permite executá-lo de novo sem
-- apagar dados. Para recomeçar do zero, descomente a linha DROP abaixo.
-- =====================================================================

-- DROP DATABASE IF EXISTS trakto;

CREATE DATABASE IF NOT EXISTS trakto
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE trakto;

-- ---------------------------------------------------------------------
-- USUARIOS — produtores, proprietários de máquinas e administradores
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  nome        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  NOT NULL,
  -- Somente o hash bcrypt (60 caracteres). A senha original nunca é gravada.
  senha       VARCHAR(255)  NOT NULL,
  telefone    VARCHAR(20)   NOT NULL,
  cidade      VARCHAR(80)   NOT NULL,
  -- Nível de acesso: define o que o usuário pode fazer na API.
  nivel       ENUM('produtor', 'proprietario', 'admin') NOT NULL DEFAULT 'produtor',
  criado_em   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_email UNIQUE (email),
  INDEX idx_usuarios_nivel (nivel)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- MAQUINAS — entidade principal: anúncios de máquinas para aluguel
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS maquinas (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  proprietario_id  INT UNSIGNED  NOT NULL,
  nome             VARCHAR(120)  NOT NULL,
  tipo             ENUM('Trator', 'Colheitadeira', 'Semeadeira', 'Pulverizador', 'Implemento', 'Transporte') NOT NULL,
  potencia         VARCHAR(40)   NULL,
  cidade           VARCHAR(80)   NOT NULL,
  preco_hora       DECIMAL(10,2) NOT NULL,
  disponivel       BOOLEAN       NOT NULL DEFAULT TRUE,
  com_operador     BOOLEAN       NOT NULL DEFAULT FALSE,
  descricao        VARCHAR(500)  NULL,
  criado_em        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  -- Um anúncio sempre pertence a um usuário. Excluir o usuário exclui seus anúncios.
  CONSTRAINT fk_maquinas_proprietario FOREIGN KEY (proprietario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_maquinas_preco CHECK (preco_hora > 0),
  INDEX idx_maquinas_tipo (tipo),
  INDEX idx_maquinas_cidade (cidade),
  INDEX idx_maquinas_disponivel (disponivel)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- SOLICITACOES — pedidos de aluguel feitos por produtores
-- Ciclo: pendente → aceita → concluida | pendente → recusada | pendente → cancelada
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitacoes (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  maquina_id    INT UNSIGNED  NOT NULL,
  produtor_id   INT UNSIGNED  NOT NULL,
  data_servico  DATE          NOT NULL,
  horas         DECIMAL(5,1)  NOT NULL,
  -- Calculado pela API (preco_hora × horas) no momento do pedido; guardado
  -- para que uma mudança futura de preço não altere pedidos já feitos.
  valor_total   DECIMAL(10,2) NOT NULL,
  status        ENUM('pendente', 'aceita', 'recusada', 'concluida', 'cancelada') NOT NULL DEFAULT 'pendente',
  observacao    VARCHAR(300)  NULL,
  criado_em     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_solicitacoes_maquina FOREIGN KEY (maquina_id)
    REFERENCES maquinas (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_solicitacoes_produtor FOREIGN KEY (produtor_id)
    REFERENCES usuarios (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_solicitacoes_horas CHECK (horas >= 1 AND horas <= 200),
  CONSTRAINT chk_solicitacoes_valor CHECK (valor_total >= 0),
  INDEX idx_solicitacoes_status (status),
  INDEX idx_solicitacoes_data (data_servico)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- TOKENS_REVOGADOS — logout real no servidor (Entrega 3)
-- O JWT não tem estado: até expirar, ele continuaria válido. No logout, o
-- identificador único do token (jti) é guardado aqui e a API passa a recusá-lo.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tokens_revogados (
  jti          CHAR(36)      NOT NULL,
  usuario_id   INT UNSIGNED  NOT NULL,
  expira_em    DATETIME      NOT NULL,
  revogado_em  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (jti),
  CONSTRAINT fk_tokens_usuario FOREIGN KEY (usuario_id)
    REFERENCES usuarios (id) ON DELETE CASCADE,
  INDEX idx_tokens_expira (expira_em)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Consultas úteis para conferir os dados no Workbench
-- ---------------------------------------------------------------------
-- SELECT id, nome, email, nivel, cidade, LEFT(senha, 7) AS inicio_do_hash FROM usuarios;  -- "$2b$10$" = bcrypt
-- SELECT m.id, m.nome, m.tipo, m.preco_hora, u.nome AS proprietario
--   FROM maquinas m JOIN usuarios u ON u.id = m.proprietario_id;
-- SELECT s.id, m.nome AS maquina, p.nome AS produtor, s.data_servico, s.horas, s.valor_total, s.status
--   FROM solicitacoes s
--   JOIN maquinas m ON m.id = s.maquina_id
--   JOIN usuarios p ON p.id = s.produtor_id
--   ORDER BY s.criado_em DESC;
