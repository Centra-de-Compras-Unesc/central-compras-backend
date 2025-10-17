-- MIGRATION: 20251017_update_tipo_embalagem_length
-- Atualiza o tamanho máximo permitido para o campo "tipo_embalagem"

ALTER TABLE "tb_fornecedor_produto"
ALTER COLUMN "tipo_embalagem" TYPE VARCHAR(50);
