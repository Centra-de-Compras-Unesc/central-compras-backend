-- MIGRATION: 20251017_update_tipo_embalagem_length
-- Atualiza o tamanho máximo permitido para o campo "tipo_embalagem"

DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tb_fornecedor_produto') THEN
    ALTER TABLE "tb_fornecedor_produto"
    ALTER COLUMN "tipo_embalagem" TYPE VARCHAR(50);
  END IF;
END $$;
