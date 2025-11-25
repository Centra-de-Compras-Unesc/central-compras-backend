-- CreateTable
CREATE TABLE "tb_arquivo" (
    "id" BIGSERIAL NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "owner_tipo" VARCHAR(20) NOT NULL,
    "owner_id" BIGINT NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "titulo" VARCHAR(300),
    "url" VARCHAR(3000),
    "conteudo" BYTEA,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_arquivo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_categoria" (
    "id" BIGSERIAL NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_documento_fiscal" (
    "id" BIGSERIAL NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "id_loja" BIGINT NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "numero" VARCHAR(20),
    "serie" VARCHAR(10),
    "chave_nfe" VARCHAR(44),
    "dt_emissao" DATE,
    "valor_produtos" DECIMAL(14,2),
    "xml_texto" TEXT,
    "arquivo" BYTEA,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_documento_fiscal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_fornecedor" (
    "id" BIGSERIAL NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "razao_social" VARCHAR(500),
    "nome_fantasia" VARCHAR(500),
    "inscricao_estadual" VARCHAR(20),
    "tipo_classificacao" VARCHAR(200),
    "observacoes" VARCHAR(2000),
    "cnpj" VARCHAR(20),
    "email_fornecedor" VARCHAR(200) NOT NULL,
    "email_nfe" VARCHAR(200),
    "telefone" VARCHAR(20),
    "site" VARCHAR(200),
    "foto" BYTEA,
    "ativo" BOOLEAN DEFAULT true,

    CONSTRAINT "tb_fornecedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_fornecedor_campanha" (
    "id" BIGSERIAL NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "descricao_campanha" VARCHAR(2000) NOT NULL,
    "valor_meta" DECIMAL(14,2),
    "tempo_duracao_campanha" INTEGER,
    "foto" BYTEA,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor_atingido" DECIMAL(14,2),
    "quantidade_meta" INTEGER DEFAULT 0,
    "quantidade_atingida" INTEGER DEFAULT 0,
    "tipo" VARCHAR(20),
    "dt_inicio" TIMESTAMPTZ(6),
    "dt_fim" TIMESTAMPTZ(6),
    "ativa" BOOLEAN DEFAULT true,
    "pedido_minimo" DECIMAL(14,2),
    "tem_meta_global" BOOLEAN DEFAULT false,
    "status" VARCHAR(20),
    "bloquear_pedidos_se_nao_atingir" BOOLEAN DEFAULT false,
    "percentual_cashback_campanha" DECIMAL(5,2),

    CONSTRAINT "tb_fornecedor_campanha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_fornecedor_campanha_produto" (
    "id" BIGSERIAL NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_campanha" BIGINT NOT NULL,
    "id_produto" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "preco_promocional" DECIMAL(14,2),

    CONSTRAINT "tb_fornecedor_campanha_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_fornecedor_condicao" (
    "id" BIGSERIAL NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pedido_minimo" DECIMAL(14,2),
    "pedido_minimo_frete_cif" DECIMAL(14,2),
    "prazo_entrega" INTEGER,
    "valor_desconto_a_vista" DECIMAL(14,2),
    "percentual_desconto_a_vista" DECIMAL(5,2),
    "observacoes" VARCHAR(500),
    "percentual_cashback" DECIMAL(5,2),
    "condicao_especial" VARCHAR(2000),
    "politica_devolucao" VARCHAR(2000),
    "estado" CHAR(2) DEFAULT '--',
    "prazo_pagamento" VARCHAR(2000),
    "prazo_pagamento_dias" INTEGER,
    "prazo_pagamento_json" JSONB,
    "ajuste_unitario" DECIMAL(14,2),
    "link_catalogo" VARCHAR(3000),

    CONSTRAINT "tb_fornecedor_condicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_fornecedor_contato" (
    "id" BIGSERIAL NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200),
    "fone1" VARCHAR(20),
    "fone2" VARCHAR(20),
    "is_responsavel" BOOLEAN,
    "id_usuario" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outras_informacoes" VARCHAR(1000),

    CONSTRAINT "tb_fornecedor_contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_fornecedor_endereco" (
    "id" BIGSERIAL NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "logradouro" VARCHAR(200) NOT NULL,
    "numero" VARCHAR(10),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "estado" CHAR(2),
    "cep" VARCHAR(10) NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pais" VARCHAR(100),

    CONSTRAINT "tb_fornecedor_endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_fornecedor_produto" (
    "id" BIGSERIAL NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "id_categoria" BIGINT,
    "codigo_produto" VARCHAR(20),
    "produto" VARCHAR(200) NOT NULL,
    "gtin" VARCHAR(20),
    "codigo_referencia" VARCHAR(20),
    "tipo_embalagem" VARCHAR(20),
    "valor_produto" DECIMAL(14,2) NOT NULL,
    "foto" BYTEA,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_fornecedor_produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_loja" (
    "id" BIGSERIAL NOT NULL,
    "cnpj" VARCHAR(20) NOT NULL,
    "nome_fantasia" VARCHAR(500) NOT NULL,
    "razao_social" VARCHAR(500),
    "inscricao_estadual" VARCHAR(50),
    "id_usuario" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email_loja" VARCHAR(200),
    "email_nfe" VARCHAR(200),
    "site" VARCHAR(200),
    "telefone" VARCHAR(20),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "termo_aceito" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_loja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_loja_cashback" (
    "id" BIGSERIAL NOT NULL,
    "id_pedido" BIGINT,
    "vl_previsto" DECIMAL(14,2) NOT NULL,
    "vl_realizado" DECIMAL(14,2) NOT NULL,
    "id_usuario" BIGINT,
    "id_conta" BIGINT,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_loja" BIGINT NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "vl_pago" DECIMAL(14,2) NOT NULL DEFAULT 0.00,
    "tipo_processamento" VARCHAR(200),
    "competencia" DATE,

    CONSTRAINT "tb_loja_cashback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_loja_cashback_detalhes" (
    "id" BIGSERIAL NOT NULL,
    "vl_previsto" DECIMAL(14,2) NOT NULL,
    "vl_realizado" DECIMAL(14,2) NOT NULL,
    "id_usuario" BIGINT,
    "id_conta" BIGINT,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_loja" BIGINT NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "id_cashback" BIGINT NOT NULL,
    "id_pedido_item" BIGINT,

    CONSTRAINT "tb_loja_cashback_detalhes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_loja_contato" (
    "id" BIGSERIAL NOT NULL,
    "id_loja" BIGINT NOT NULL,
    "nome" VARCHAR(200) NOT NULL,
    "email" VARCHAR(200),
    "fone1" VARCHAR(20),
    "fone2" VARCHAR(20),
    "is_responsavel" BOOLEAN,
    "id_usuario" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "outras_informacoes" VARCHAR(1000),

    CONSTRAINT "tb_loja_contato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_loja_endereco" (
    "id" BIGSERIAL NOT NULL,
    "id_loja" BIGINT NOT NULL,
    "logradouro" VARCHAR(200) NOT NULL,
    "numero" VARCHAR(10),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "estado" CHAR(2),
    "cep" VARCHAR(10) NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_endereco_principal" BOOLEAN DEFAULT false,
    "is_endereco_entrega" BOOLEAN DEFAULT false,
    "pais" VARCHAR(100),

    CONSTRAINT "tb_loja_endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_pedido" (
    "id" BIGSERIAL NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "id_loja" BIGINT NOT NULL,
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "status" VARCHAR(100),
    "status_norm" VARCHAR(20),
    "codigo_rastreamento" VARCHAR(50),
    "vl_total_pedido" DECIMAL(14,2),
    "is_televenda" BOOLEAN NOT NULL DEFAULT false,
    "numero_nota_fiscal" VARCHAR(20),
    "chave_nota_fiscal" VARCHAR(100),
    "canal" VARCHAR(30),

    CONSTRAINT "tb_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_pedido_item" (
    "id" BIGSERIAL NOT NULL,
    "id_pedido" BIGINT NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "id_fornecedor" BIGINT NOT NULL,
    "id_loja" BIGINT,
    "id_usuario" BIGINT NOT NULL,
    "id_produto" BIGINT,
    "id_campanha" BIGINT,
    "quantidade" DECIMAL(14,3),
    "valor_unitario" DECIMAL(14,2),
    "valor_total" DECIMAL(14,2),
    "percentual_cashback_aplicado" DECIMAL(5,2),
    "valor_cashback_previsto" DECIMAL(14,2),
    "dt_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codigo_produto" VARCHAR(20),
    "codigo_referencia" VARCHAR(20),
    "produto" VARCHAR(200),

    CONSTRAINT "tb_pedido_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_sistema_conta" (
    "id" BIGSERIAL NOT NULL,
    "dh_inc" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nm_conta" VARCHAR(200) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT false,
    "dh_desativacao" TIMESTAMPTZ(6),

    CONSTRAINT "tb_sistema_conta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_sistema_usuario" (
    "id" BIGSERIAL NOT NULL,
    "id_conta" BIGINT NOT NULL,
    "nome" VARCHAR(200),
    "email" VARCHAR(200) NOT NULL,
    "senha" VARCHAR(200) NOT NULL,
    "ativo" BOOLEAN DEFAULT false,
    "loja" VARCHAR(200),
    "telefone" VARCHAR(20),
    "cnpj" VARCHAR(20),
    "cep" VARCHAR(10),
    "endereco" VARCHAR(200),
    "numero" VARCHAR(10),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "estado" CHAR(2),
    "avatarUrl" VARCHAR(3000),

    CONSTRAINT "tb_sistema_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_sistema_usuario_perfil" (
    "id" BIGSERIAL NOT NULL,
    "id_usuario" BIGINT NOT NULL,
    "perfil" VARCHAR(100) NOT NULL,

    CONSTRAINT "tb_sistema_usuario_perfil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_arquivo_owner" ON "tb_arquivo"("owner_tipo", "owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_categoria_conta_nome" ON "tb_categoria"("id_conta", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "uq_docfiscal_chave" ON "tb_documento_fiscal"("chave_nfe");

-- CreateIndex
CREATE UNIQUE INDEX "uq_fornecedor_cnpj" ON "tb_fornecedor"("cnpj");

-- CreateIndex
CREATE INDEX "idx_fornecedor_cnpj" ON "tb_fornecedor"("cnpj");

-- CreateIndex
CREATE INDEX "idx_fornecedor_condicao_estado" ON "tb_fornecedor_condicao"("id_fornecedor", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "uq_fornecedor_condicao_fornecedor_estado" ON "tb_fornecedor_condicao"("id_fornecedor", "estado");

-- CreateIndex
CREATE INDEX "idx_fornecedor_contato_fornecedor" ON "tb_fornecedor_contato"("id_fornecedor");

-- CreateIndex
CREATE INDEX "idx_fornecedor_endereco_fornecedor" ON "tb_fornecedor_endereco"("id_fornecedor");

-- CreateIndex
CREATE UNIQUE INDEX "uq_fornecedor_produto_codigo" ON "tb_fornecedor_produto"("id_fornecedor", "codigo_produto");

-- CreateIndex
CREATE UNIQUE INDEX "uq_fornecedor_produto_nome" ON "tb_fornecedor_produto"("id_fornecedor", "produto");

-- CreateIndex
CREATE UNIQUE INDEX "uq_loja_cnpj" ON "tb_loja"("cnpj");

-- CreateIndex
CREATE INDEX "idx_loja_cnpj" ON "tb_loja"("cnpj");

-- CreateIndex
CREATE INDEX "idx_loja_contato_loja" ON "tb_loja_contato"("id_loja");

-- CreateIndex
CREATE INDEX "idx_pedido_fornecedor" ON "tb_pedido"("id_fornecedor", "status");

-- CreateIndex
CREATE INDEX "idx_pedido_loja_dt" ON "tb_pedido"("id_loja", "dt_inc");

-- CreateIndex
CREATE INDEX "idx_pedido_status_norm" ON "tb_pedido"("status_norm");

-- CreateIndex
CREATE INDEX "idx_item_fornecedor_dt" ON "tb_pedido_item"("id_fornecedor", "dt_inc");

-- CreateIndex
CREATE INDEX "idx_item_pedido" ON "tb_pedido_item"("id_pedido");

-- CreateIndex
CREATE INDEX "idx_item_pedido_produto" ON "tb_pedido_item"("id_pedido", "id_produto");

-- CreateIndex
CREATE UNIQUE INDEX "uq_usuario_email_por_conta" ON "tb_sistema_usuario"("id_conta", "email");

-- CreateIndex
CREATE UNIQUE INDEX "uq_usuario_perfil" ON "tb_sistema_usuario_perfil"("id_usuario", "perfil");

-- AddForeignKey
ALTER TABLE "tb_arquivo" ADD CONSTRAINT "fk_arquivo_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_categoria" ADD CONSTRAINT "fk_categoria_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_documento_fiscal" ADD CONSTRAINT "fk_docfiscal_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_documento_fiscal" ADD CONSTRAINT "fk_docfiscal_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_documento_fiscal" ADD CONSTRAINT "fk_docfiscal_loja" FOREIGN KEY ("id_loja") REFERENCES "tb_loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor" ADD CONSTRAINT "fk_fornecedor_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor" ADD CONSTRAINT "fk_fornecedor_usuario" FOREIGN KEY ("id_usuario") REFERENCES "tb_sistema_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_campanha" ADD CONSTRAINT "fk_campanha_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_campanha" ADD CONSTRAINT "fk_campanha_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_campanha" ADD CONSTRAINT "fk_campanha_usuario" FOREIGN KEY ("id_usuario") REFERENCES "tb_sistema_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_campanha_produto" ADD CONSTRAINT "fk_campanha_produto_campanha" FOREIGN KEY ("id_campanha") REFERENCES "tb_fornecedor_campanha"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_campanha_produto" ADD CONSTRAINT "fk_campanha_produto_produto" FOREIGN KEY ("id_produto") REFERENCES "tb_fornecedor_produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_condicao" ADD CONSTRAINT "fk_condicao_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_condicao" ADD CONSTRAINT "fk_condicao_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_condicao" ADD CONSTRAINT "fk_condicao_usuario" FOREIGN KEY ("id_usuario") REFERENCES "tb_sistema_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_contato" ADD CONSTRAINT "fk_fornecedor_contato_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_endereco" ADD CONSTRAINT "fk_fornecedor_endereco_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_produto" ADD CONSTRAINT "fk_fornecedor_produto_categoria" FOREIGN KEY ("id_categoria") REFERENCES "tb_categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_fornecedor_produto" ADD CONSTRAINT "fk_fornecedor_produto_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja" ADD CONSTRAINT "fk_loja_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja" ADD CONSTRAINT "fk_loja_usuario" FOREIGN KEY ("id_usuario") REFERENCES "tb_sistema_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_cashback" ADD CONSTRAINT "fk_cashback_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_cashback" ADD CONSTRAINT "fk_cashback_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_cashback" ADD CONSTRAINT "fk_cashback_loja" FOREIGN KEY ("id_loja") REFERENCES "tb_loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_cashback_detalhes" ADD CONSTRAINT "fk_cashback_det_cashback" FOREIGN KEY ("id_cashback") REFERENCES "tb_loja_cashback"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_cashback_detalhes" ADD CONSTRAINT "fk_cashback_det_forn" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_cashback_detalhes" ADD CONSTRAINT "fk_cashback_det_item" FOREIGN KEY ("id_pedido_item") REFERENCES "tb_pedido_item"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_cashback_detalhes" ADD CONSTRAINT "fk_cashback_det_loja" FOREIGN KEY ("id_loja") REFERENCES "tb_loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_contato" ADD CONSTRAINT "fk_loja_contato_loja" FOREIGN KEY ("id_loja") REFERENCES "tb_loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_loja_endereco" ADD CONSTRAINT "fk_loja_endereco_loja" FOREIGN KEY ("id_loja") REFERENCES "tb_loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido" ADD CONSTRAINT "fk_pedido_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido" ADD CONSTRAINT "fk_pedido_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido" ADD CONSTRAINT "fk_pedido_loja" FOREIGN KEY ("id_loja") REFERENCES "tb_loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido" ADD CONSTRAINT "fk_pedido_usuario" FOREIGN KEY ("id_usuario") REFERENCES "tb_sistema_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido_item" ADD CONSTRAINT "fk_item_campanha" FOREIGN KEY ("id_campanha") REFERENCES "tb_fornecedor_campanha"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido_item" ADD CONSTRAINT "fk_item_fornecedor" FOREIGN KEY ("id_fornecedor") REFERENCES "tb_fornecedor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido_item" ADD CONSTRAINT "fk_item_loja" FOREIGN KEY ("id_loja") REFERENCES "tb_loja"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido_item" ADD CONSTRAINT "fk_item_pedido" FOREIGN KEY ("id_pedido") REFERENCES "tb_pedido"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido_item" ADD CONSTRAINT "fk_item_produto" FOREIGN KEY ("id_produto") REFERENCES "tb_fornecedor_produto"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_pedido_item" ADD CONSTRAINT "fk_item_usuario" FOREIGN KEY ("id_usuario") REFERENCES "tb_sistema_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_sistema_usuario" ADD CONSTRAINT "fk_usuario_conta" FOREIGN KEY ("id_conta") REFERENCES "tb_sistema_conta"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tb_sistema_usuario_perfil" ADD CONSTRAINT "fk_usuario_perfil_usuario" FOREIGN KEY ("id_usuario") REFERENCES "tb_sistema_usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
