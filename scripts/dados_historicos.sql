-- Script para popular dados históricos nos últimos 12 meses
-- Este script cria pedidos com datas variadas para gerar gráficos mais interessantes

-- Primeiro, vamos inserir pedidos históricos para as lojas e fornecedores existentes
-- Os pedidos serão distribuídos ao longo dos últimos 12 meses

-- Inserir pedidos históricos (últimos 12 meses)
-- Nota: Ajuste os IDs de loja, fornecedor e usuário conforme necessário

DO $$
DECLARE
  v_loja_id BIGINT := 1;  -- Ajuste conforme necessário
  v_fornecedor_id BIGINT := 1;  -- Ajuste conforme necessário
  v_usuario_id BIGINT := 2;  -- Ajuste conforme necessário
  v_conta_id BIGINT := 1;  -- Ajuste conforme necessário
  v_data DATE;
  v_i INT;
  v_valor DECIMAL(14, 2);
  v_status VARCHAR(50);
  v_status_array VARCHAR(50)[] := ARRAY['Pendente', 'Aprovado', 'Faturado', 'Entregue'];
BEGIN
  -- Loop para cada dia dos últimos 365 dias
  FOR v_i IN 0..364 LOOP
    v_data := CURRENT_DATE - (v_i || ' days')::INTERVAL;
    
    -- Inserir 1-3 pedidos por dia (algumas distribuição)
    IF RANDOM() > 0.3 THEN
      v_valor := (200 + RANDOM() * 2000)::DECIMAL(14, 2);
      v_status := v_status_array[1 + (RANDOM() * 3)::INT];
      
      INSERT INTO tb_pedido (
        id_loja, 
        id_fornecedor, 
        id_usuario, 
        id_conta,
        vl_total_pedido,
        status,
        dt_inc
      ) VALUES (
        v_loja_id,
        v_fornecedor_id,
        v_usuario_id,
        v_conta_id,
        v_valor,
        v_status,
        v_data::TIMESTAMP
      ) ON CONFLICT DO NOTHING;
    END IF;
    
    -- Alguns dias com 2 pedidos
    IF RANDOM() > 0.6 THEN
      v_valor := (150 + RANDOM() * 1500)::DECIMAL(14, 2);
      v_status := v_status_array[1 + (RANDOM() * 3)::INT];
      
      INSERT INTO tb_pedido (
        id_loja,
        id_fornecedor,
        id_usuario,
        id_conta,
        vl_total_pedido,
        status,
        dt_inc
      ) VALUES (
        v_loja_id,
        v_fornecedor_id,
        v_usuario_id,
        v_conta_id,
        v_valor,
        v_status,
        v_data::TIMESTAMP
      ) ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Dados históricos inseridos com sucesso!';
END $$;
