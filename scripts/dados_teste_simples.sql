
DELETE FROM tb_loja_cashback_detalhes;
DELETE FROM tb_loja_cashback;
DELETE FROM tb_pedido_item;
DELETE FROM tb_pedido;
DELETE FROM tb_fornecedor_campanha_produto;
DELETE FROM tb_fornecedor_campanha;
DELETE FROM tb_fornecedor_produto;
DELETE FROM tb_categoria;
DELETE FROM tb_fornecedor_condicao;
DELETE FROM tb_fornecedor_endereco;
DELETE FROM tb_fornecedor_contato;
DELETE FROM tb_fornecedor;
DELETE FROM tb_loja_endereco;
DELETE FROM tb_loja_contato;
DELETE FROM tb_loja;
DELETE FROM tb_documento_fiscal;
DELETE FROM tb_sistema_usuario_perfil;
DELETE FROM tb_sistema_usuario;
DELETE FROM tb_sistema_conta;

ALTER SEQUENCE tb_sistema_conta_id_seq RESTART WITH 1;

INSERT INTO tb_sistema_conta (nm_conta, ativo, dh_inc)
VALUES ('Central de Compras Brasil', true, NOW());

ALTER SEQUENCE tb_sistema_usuario_id_seq RESTART WITH 1;

INSERT INTO tb_sistema_usuario (id_conta, nome, email, senha, ativo, loja, telefone, cnpj, cep, endereco, numero, bairro, cidade, estado, "avatarUrl")
VALUES 
  (1, 'João Silva', 'loja@test.com', '123456', true, 'Loja Centro', '(11) 98765-4321', '11.111.111/0001-88', '01310100', 'Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', ''),
  (1, 'Maria Santos', 'fornecedor@test.com', '123456', true, 'Distribuidora Top', '(11) 99999-8888', '22.222.222/0001-99', '02310200', 'Rua das Flores', '500', 'Consolação', 'São Paulo', 'SP', ''),
  (1, 'Admin User', 'admin@test.com', '123456', true, 'Administrativo', '(11) 3333-3333', '33.333.333/0001-00', '03310300', 'Rua Principal', '100', 'Centro', 'São Paulo', 'SP', '');

ALTER SEQUENCE tb_sistema_usuario_perfil_id_seq RESTART WITH 1;

INSERT INTO tb_sistema_usuario_perfil (id_usuario, perfil)
VALUES 
  (1, 'loja'),       
  (2, 'fornecedor'),
  (3, 'admin');    

ALTER SEQUENCE tb_categoria_id_seq RESTART WITH 1;

INSERT INTO tb_categoria (id_conta, nome, dt_inc)
VALUES 
  (1, 'Alimentos', NOW()),
  (1, 'Bebidas', NOW()),
  (1, 'Limpeza', NOW()),
  (1, 'Higiene', NOW());

ALTER SEQUENCE tb_fornecedor_id_seq RESTART WITH 1;

INSERT INTO tb_fornecedor (id_conta, id_usuario, razao_social, nome_fantasia, cnpj, email_fornecedor, telefone, ativo, dt_inc)
VALUES 
  (1, 2, 'FORNECEDOR DO BRASIL LTDA', 'Fornecedor Brasil', '12.345.678/0001-99', 'contato@fornecedor.com.br', '(11) 3000-1111', true, NOW()),
  (1, 2, 'DISTRIBUIDORA NACIONAL SA', 'Distrib. Nacional', '98.765.432/0001-11', 'vendas@distribuidora.com.br', '(21) 3000-2222', true, NOW());

ALTER SEQUENCE tb_loja_id_seq RESTART WITH 1;

INSERT INTO tb_loja (id_conta, id_usuario, cnpj, nome_fantasia, razao_social, email_loja, telefone, ativo, termo_aceito, dt_inc)
VALUES 
  (1, 1, '11.111.111/0001-88', 'Loja Centro', 'LOJA CENTRO LTDA', 'loja@email.com.br', '(11) 4000-1111', true, true, NOW()),
  (1, 1, '22.222.222/0001-99', 'Loja Norte', 'LOJA NORTE LTDA', 'loja2@email.com.br', '(11) 4000-2222', true, true, NOW());

ALTER SEQUENCE tb_loja_endereco_id_seq RESTART WITH 1;

INSERT INTO tb_loja_endereco (id_loja, logradouro, numero, bairro, cidade, estado, cep, id_usuario, id_conta, is_endereco_principal, dt_inc)
VALUES 
  (1, 'Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310100', 1, 1, true, NOW()),
  (2, 'Av. Tucuruvi', '2500', 'Tucuruvi', 'São Paulo', 'SP', '02304000', 1, 1, true, NOW());

ALTER SEQUENCE tb_fornecedor_condicao_id_seq RESTART WITH 1;

INSERT INTO tb_fornecedor_condicao (id_fornecedor, id_usuario, id_conta, estado, percentual_cashback, prazo_pagamento_dias, ajuste_unitario, observacoes, dt_inc)
VALUES 
  (1, 2, 1, 'SP', 5.00, 30, 0.00, 'Condição SP - 5% cashback, 30 dias', NOW()),
  (1, 2, 1, 'RJ', 4.50, 45, 1.50, 'Condição RJ - 4.5% cashback, 45 dias, +R$1.50/un', NOW()),
  (1, 2, 1, 'MG', 4.00, 30, 2.00, 'Condição MG - 4% cashback, 30 dias, +R$2.00/un', NOW()),
  (1, 2, 1, 'BA', 3.50, 60, 3.00, 'Condição BA - 3.5% cashback, 60 dias, +R$3.00/un', NOW()),
  (2, 2, 1, 'SP', 3.50, 28, 0.00, 'Condição SP - 3.5% cashback, 28 dias', NOW()),
  (2, 2, 1, 'RJ', 3.00, 35, 0.50, 'Condição RJ - 3% cashback, 35 dias, +R$0.50/un', NOW()),
  (2, 2, 1, 'PR', 3.00, 45, 1.00, 'Condição PR - 3% cashback, 45 dias, +R$1.00/un', NOW()),
  (2, 2, 1, 'SC', 2.50, 45, 1.50, 'Condição SC - 2.5% cashback, 45 dias, +R$1.50/un', NOW());

ALTER SEQUENCE tb_fornecedor_produto_id_seq RESTART WITH 1;

INSERT INTO tb_fornecedor_produto (id_fornecedor, id_usuario, id_conta, id_categoria, codigo_produto, produto, tipo_embalagem, valor_produto, dt_inc)
VALUES 
  (1, 2, 1, 1, 'PROD001', 'Arroz 5kg', 'Saco', 45.50, NOW()),
  (1, 2, 1, 1, 'PROD002', 'Feijão 1kg', 'Pacote', 8.90, NOW()),
  (2, 2, 1, 2, 'PROD003', 'Água Mineral 1.5L', 'Garrafa', 12.50, NOW()),
  (2, 2, 1, 3, 'PROD004', 'Detergente 500ml', 'Frasco', 3.50, NOW());

ALTER SEQUENCE tb_fornecedor_campanha_id_seq RESTART WITH 1;

INSERT INTO tb_fornecedor_campanha (id_fornecedor, id_usuario, id_conta, descricao_campanha, valor_meta, tempo_duracao_campanha, dt_inicio, dt_fim, ativa, percentual_cashback_campanha, tipo, status, dt_inc)
VALUES 
  (1, 2, 1, 'Black Friday - Arroz', 15000.00, 30, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', true, 5.00, 'Desconto', 'Ativa', NOW()),
  (2, 2, 1, 'Promoção Bebidas', 25000.00, 45, NOW() - INTERVAL '10 days', NOW() + INTERVAL '35 days', true, 3.50, 'Cashback', 'Ativa', NOW());

ALTER SEQUENCE tb_pedido_id_seq RESTART WITH 1;

INSERT INTO tb_pedido (id_usuario, id_conta, id_fornecedor, id_loja, status, status_norm, vl_total_pedido, canal, dt_inc)
VALUES 
  (1, 1, 1, 1, 'Aprovado', 'Entregue', 2275.00, 'WEB', NOW() - INTERVAL '10 days'),
  (1, 1, 2, 1, 'Em análise', 'Aguardando', 450.00, 'WEB', NOW() - INTERVAL '3 days'),
  (1, 1, 1, 2, 'Faturado', 'Processando', 1234.50, 'WEB', NOW() - INTERVAL '1 days'),
  (1, 1, 2, 1, 'Aprovado', 'Entregue', 890.00, 'WEB', NOW() - INTERVAL '15 days');

ALTER SEQUENCE tb_pedido_item_id_seq RESTART WITH 1;

INSERT INTO tb_pedido_item (id_pedido, id_conta, id_fornecedor, id_loja, id_usuario, id_produto, quantidade, valor_unitario, valor_total, percentual_cashback_aplicado, valor_cashback_previsto, codigo_produto, produto, dt_inc)
VALUES 
  (1, 1, 1, 1, 1, 1, 50.00, 45.50, 2275.00, 5.00, 113.75, 'PROD001', 'Arroz 5kg', NOW() - INTERVAL '10 days'),
  (2, 1, 2, 1, 1, 3, 36.00, 12.50, 450.00, 3.50, 15.75, 'PROD003', 'Água Mineral 1.5L', NOW() - INTERVAL '3 days'),
  (3, 1, 1, 2, 1, 2, 138.50, 8.90, 1234.50, 5.00, 61.73, 'PROD002', 'Feijão 1kg', NOW() - INTERVAL '1 days'),
  (4, 1, 2, 1, 1, 4, 254.29, 3.50, 890.00, 4.00, 35.60, 'PROD004', 'Detergente 500ml', NOW() - INTERVAL '15 days');

ALTER SEQUENCE tb_loja_cashback_id_seq RESTART WITH 1;

INSERT INTO tb_loja_cashback (id_pedido, vl_previsto, vl_realizado, id_usuario, id_conta, id_loja, id_fornecedor, pago, vl_pago, competencia, dt_inc)
VALUES 
  (1, 113.75, 113.75, 1, 1, 1, 1, false, 0.00, NOW(), NOW() - INTERVAL '10 days'),
  (2, 15.75, 15.75, 1, 1, 1, 2, false, 0.00, NOW(), NOW() - INTERVAL '3 days'),
  (3, 61.73, 61.73, 1, 1, 2, 1, false, 0.00, NOW(), NOW() - INTERVAL '1 days'),
  (4, 35.60, 35.60, 1, 1, 1, 2, true, 35.60, NOW(), NOW() - INTERVAL '15 days');

SELECT 'DADOS INSERIDOS COM SUCESSO!' AS Status;

SELECT 
  'Contas' AS Tipo, COUNT(*) AS Qtd FROM tb_sistema_conta
UNION ALL
SELECT 'Usuários', COUNT(*) FROM tb_sistema_usuario
UNION ALL
SELECT 'Fornecedores', COUNT(*) FROM tb_fornecedor
UNION ALL
SELECT 'Lojas', COUNT(*) FROM tb_loja
UNION ALL
SELECT 'Categorias', COUNT(*) FROM tb_categoria
UNION ALL
SELECT 'Produtos', COUNT(*) FROM tb_fornecedor_produto
UNION ALL
SELECT 'Campanhas', COUNT(*) FROM tb_fornecedor_campanha
UNION ALL
SELECT 'Pedidos', COUNT(*) FROM tb_pedido
UNION ALL
SELECT 'Itens', COUNT(*) FROM tb_pedido_item
UNION ALL
SELECT 'Cashback', COUNT(*) FROM tb_loja_cashback
ORDER BY Tipo;

SELECT '
╔════════════════════════════════════════════════╗
║     CREDENCIAIS PARA LOGAR NO SISTEMA         ║
╚════════════════════════════════════════════════╝

LOJA (Comprador):
  Email: loja@test.com
  Senha: 123456

FORNECEDOR (Vendedor):
  Email: fornecedor@test.com
  Senha: 123456

ADMIN:
  Email: admin@test.com
  Senha: 123456

Acesse: http://localhost:5174
Backend: http://localhost:3000

' AS Credenciais;
