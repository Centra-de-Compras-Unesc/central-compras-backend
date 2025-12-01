
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


INSERT INTO tb_sistema_conta (nm_conta, ativo, dh_inc)
VALUES ('Central de Compras - Região Sudeste', true, NOW());

INSERT INTO tb_sistema_usuario (id_conta, nome, email, senha, ativo, loja, telefone, cnpj, cep, endereco, numero, bairro, cidade, estado, avatarUrl)
VALUES 
  (1, 'Loja Test', 'loja@test.com', '123456', true, 'Loja Central Shopping', '(11) 4000-1111', '11.111.111/0001-88', '01310100', 'Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', ''),
  (1, 'Fornecedor Test', 'fornecedor@test.com', '123456', true, 'Distribuidora Brasil', '(11) 3000-1111', '12.345.678/0001-99', '02310100', 'Rua das Flores', '500', 'Consolação', 'São Paulo', 'SP', '');

INSERT INTO tb_categoria (id_conta, nome, dt_inc)
VALUES 
  (1, 'Alimentos', NOW()),
  (1, 'Bebidas', NOW()),
  (1, 'Limpeza', NOW()),
  (1, 'Higiene Pessoal', NOW()),
  (1, 'Eletrônicos', NOW());

INSERT INTO tb_fornecedor (id_conta, id_usuario, razao_social, nome_fantasia, cnpj, email_fornecedor, telefone, ativo, dt_inc)
VALUES 
  (1, 2, 'FORNECEDOR BRASIL LTDA', 'Fornecedor Brasil', '12.345.678/0001-99', 'contato@fornecedor1.com.br', '(11) 3000-1111', true, NOW()),
  (1, 2, 'DISTRIBUIDORA NACIONAL SA', 'Distribuidora Nacional', '98.765.432/0001-11', 'vendas@distribuidora.com.br', '(21) 3000-2222', true, NOW()),
  (1, 2, 'IMPORTADORA LTDA', 'Importadora Premium', '55.123.456/0001-77', 'info@importadora.com.br', '(31) 3000-3333', true, NOW());

INSERT INTO tb_fornecedor_endereco (id_fornecedor, logradouro, numero, bairro, cidade, estado, cep, id_usuario, id_conta, dt_inc)
VALUES 
  (1, 'Rua Industrial', '100', 'Zona Industrial', 'São Paulo', 'SP', '03530000', 2, 1, NOW()),
  (2, 'Avenida Brasil', '2000', 'Centro', 'Rio de Janeiro', 'RJ', '20000000', 2, 1, NOW()),
  (3, 'Estrada da Mineração', '500', 'Periférico', 'Belo Horizonte', 'MG', '30000000', 2, 1, NOW());

INSERT INTO tb_loja (id_conta, id_usuario, cnpj, nome_fantasia, razao_social, email_loja, telefone, ativo, termo_aceito, dt_inc)
VALUES 
  (1, 1, '11.111.111/0001-88', 'Loja Central Shopping', 'LOJA CENTRAL LTDA', 'loja1@email.com.br', '(11) 4000-1111', true, true, NOW()),
  (1, 1, '22.222.222/0001-99', 'Loja Norte Plaza', 'LOJA NORTE LTDA', 'loja2@email.com.br', '(11) 4000-2222', true, true, NOW()),
  (1, 1, '33.333.333/0001-00', 'Loja West Mall', 'LOJA WEST LTDA', 'loja3@email.com.br', '(11) 4000-3333', true, true, NOW());

INSERT INTO tb_loja_endereco (id_loja, logradouro, numero, bairro, cidade, estado, cep, id_usuario, id_conta, is_endereco_principal, dt_inc)
VALUES 
  (1, 'Av. Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', '01310100', 1, 1, true, NOW()),
  (2, 'Av. Imigrantes', '2000', 'Bom Retiro', 'São Paulo', 'SP', '01310200', 1, 1, true, NOW()),
  (3, 'Rua Oscar Freire', '500', 'Cerqueira César', 'São Paulo', 'SP', '01310300', 1, 1, true, NOW());

INSERT INTO tb_fornecedor_produto (id_fornecedor, id_usuario, id_conta, id_categoria, codigo_produto, produto, tipo_embalagem, valor_produto, dt_inc)
VALUES 
  (1, 2, 1, 1, 'PROD001', 'Arroz Integral 5kg', 'Saco', 45.50, NOW()),
  (1, 2, 1, 1, 'PROD002', 'Feijão Carioca 1kg', 'Pacote', 8.90, NOW()),
  (2, 2, 1, 2, 'PROD003', 'Água Mineral 1.5L (pack 6)', 'Garrafa', 12.50, NOW()),
  (2, 2, 1, 2, 'PROD004', 'Refrigerante 2L', 'Garrafa', 7.80, NOW()),
  (3, 2, 1, 3, 'PROD005', 'Detergente Neutro 500ml', 'Frasco', 3.50, NOW()),
  (3, 2, 1, 3, 'PROD006', 'Desinfetante 1L', 'Frasco', 5.20, NOW()),
  (1, 2, 1, 4, 'PROD007', 'Sabonete Líquido 250ml', 'Frasco', 6.90, NOW()),
  (2, 2, 1, 4, 'PROD008', 'Shampoo 400ml', 'Frasco', 12.50, NOW());

INSERT INTO tb_fornecedor_campanha (id_fornecedor, id_usuario, id_conta, descricao_campanha, valor_meta, tempo_duracao_campanha, dt_inicio, dt_fim, ativa, percentual_cashback_campanha, tipo, status, dt_inc)
VALUES 
  (1, 2, 1, 'Black Friday - Desconto 30% em Arroz', 15000.00, 30, NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', true, 5.00, 'Desconto', 'Ativa', NOW()),
  (2, 2, 1, 'Promoção de Inverno - Bebidas Quentes', 25000.00, 45, NOW() - INTERVAL '10 days', NOW() + INTERVAL '35 days', true, 3.50, 'Cashback', 'Ativa', NOW()),
  (3, 2, 1, 'Limpeza em Destaque', 10000.00, 20, NOW() - INTERVAL '3 days', NOW() + INTERVAL '17 days', true, 4.00, 'Desconto', 'Ativa', NOW());

INSERT INTO tb_fornecedor_campanha_produto (id_conta, id_usuario, id_campanha, id_produto, preco_promocional, dt_inc)
VALUES 
  (1, 2, 1, 1, 38.50, NOW()),
  (1, 2, 2, 3, 11.00, NOW()),
  (1, 2, 3, 5, 2.99, NOW());

INSERT INTO tb_pedido (id_usuario, id_conta, id_fornecedor, id_loja, status, status_norm, vl_total_pedido, canal, dt_inc)
VALUES 
  (1, 1, 1, 1, 'Aprovado', 'Entregue', 2275.00, 'WEB', NOW() - INTERVAL '10 days'),
  (1, 1, 2, 1, 'Em análise', 'Aguardando', 450.00, 'WEB', NOW() - INTERVAL '3 days'),
  (1, 1, 1, 2, 'Faturado', 'Processando', 1234.50, 'WEB', NOW() - INTERVAL '1 days'),
  (1, 1, 3, 1, 'Aprovado', 'Entregue', 890.00, 'WEB', NOW() - INTERVAL '15 days'),
  (1, 1, 2, 3, 'Aprovado', 'Entregue', 567.30, 'WEB', NOW() - INTERVAL '8 days'),
  (1, 1, 1, 2, 'Em análise', 'Aguardando', 1823.45, 'WEB', NOW() - INTERVAL '2 days'),
  (1, 1, 3, 1, 'Faturado', 'Processando', 654.99, 'WEB', NOW() - INTERVAL '5 days'),
  (1, 1, 2, 1, 'Aprovado', 'Entregue', 345.67, 'WEB', NOW() - INTERVAL '12 days'),
  (1, 1, 1, 3, 'Aprovado', 'Entregue', 2100.00, 'WEB', NOW() - INTERVAL '7 days'),
  (1, 1, 3, 2, 'Em análise', 'Aguardando', 433.21, 'WEB', NOW() - INTERVAL '4 days');

INSERT INTO tb_pedido_item (id_pedido, id_conta, id_fornecedor, id_loja, id_usuario, id_produto, quantidade, valor_unitario, valor_total, percentual_cashback_aplicado, valor_cashback_previsto, codigo_produto, produto, dt_inc)
VALUES 
  (1, 1, 1, 1, 1, 1, 50.00, 45.50, 2275.00, 5.00, 113.75, 'PROD001', 'Arroz Integral 5kg', NOW() - INTERVAL '10 days'),
  (2, 1, 2, 1, 1, 3, 36.00, 12.50, 450.00, 3.50, 15.75, 'PROD003', 'Água Mineral 1.5L', NOW() - INTERVAL '3 days'),
  (3, 1, 1, 2, 1, 2, 138.50, 8.90, 1234.50, 5.00, 61.73, 'PROD002', 'Feijão Carioca 1kg', NOW() - INTERVAL '1 days'),
  (4, 1, 3, 1, 1, 5, 254.29, 3.50, 890.00, 4.00, 35.60, 'PROD005', 'Detergente Neutro 500ml', NOW() - INTERVAL '15 days'),
  (5, 1, 2, 3, 1, 4, 72.73, 7.80, 567.30, 3.50, 19.86, 'PROD004', 'Refrigerante 2L', NOW() - INTERVAL '8 days'),
  (6, 1, 1, 2, 1, 1, 40.13, 45.50, 1823.45, 5.00, 91.17, 'PROD001', 'Arroz Integral 5kg', NOW() - INTERVAL '2 days'),
  (7, 1, 3, 1, 1, 6, 125.77, 5.20, 654.99, 4.00, 26.20, 'PROD006', 'Desinfetante 1L', NOW() - INTERVAL '5 days'),
  (8, 1, 2, 1, 1, 3, 27.73, 12.50, 345.67, 3.50, 12.10, 'PROD003', 'Água Mineral 1.5L', NOW() - INTERVAL '12 days'),
  (9, 1, 1, 3, 1, 1, 46.15, 45.50, 2100.00, 5.00, 105.00, 'PROD001', 'Arroz Integral 5kg', NOW() - INTERVAL '7 days'),
  (10, 1, 3, 2, 1, 7, 62.81, 6.90, 433.21, 4.00, 17.33, 'PROD007', 'Sabonete Líquido 250ml', NOW() - INTERVAL '4 days');

INSERT INTO tb_loja_cashback (id_pedido, vl_previsto, vl_realizado, id_usuario, id_conta, id_loja, id_fornecedor, pago, vl_pago, competencia, dt_inc)
VALUES 
  (1, 113.75, 113.75, 1, 1, 1, 1, false, 0.00, NOW(), NOW() - INTERVAL '10 days'),
  (2, 15.75, 15.75, 1, 1, 1, 2, false, 0.00, NOW(), NOW() - INTERVAL '3 days'),
  (3, 61.73, 61.73, 1, 1, 2, 1, false, 0.00, NOW(), NOW() - INTERVAL '1 days'),
  (4, 35.60, 35.60, 1, 1, 1, 3, true, 35.60, NOW(), NOW() - INTERVAL '15 days'),
  (5, 19.86, 19.86, 1, 1, 3, 2, true, 19.86, NOW(), NOW() - INTERVAL '8 days'),
  (6, 91.17, 91.17, 1, 1, 2, 1, false, 0.00, NOW(), NOW() - INTERVAL '2 days'),
  (7, 26.20, 26.20, 1, 1, 1, 3, true, 26.20, NOW(), NOW() - INTERVAL '5 days'),
  (8, 12.10, 12.10, 1, 1, 1, 2, true, 12.10, NOW(), NOW() - INTERVAL '12 days'),
  (9, 105.00, 105.00, 1, 1, 3, 1, false, 0.00, NOW(), NOW() - INTERVAL '7 days'),
  (10, 17.33, 17.33, 1, 1, 2, 3, false, 0.00, NOW(), NOW() - INTERVAL '4 days');

INSERT INTO tb_loja_cashback_detalhes (vl_previsto, vl_realizado, id_usuario, id_conta, id_loja, id_fornecedor, id_cashback, id_pedido_item, dt_inc)
VALUES 
  (113.75, 113.75, 1, 1, 1, 1, 1, 1, NOW() - INTERVAL '10 days'),
  (15.75, 15.75, 1, 1, 1, 2, 2, 2, NOW() - INTERVAL '3 days'),
  (61.73, 61.73, 1, 1, 2, 1, 3, 3, NOW() - INTERVAL '1 days'),
  (35.60, 35.60, 1, 1, 1, 3, 4, 4, NOW() - INTERVAL '15 days'),
  (19.86, 19.86, 1, 1, 3, 2, 5, 5, NOW() - INTERVAL '8 days'),
  (91.17, 91.17, 1, 1, 2, 1, 6, 6, NOW() - INTERVAL '2 days'),
  (26.20, 26.20, 1, 1, 1, 3, 7, 7, NOW() - INTERVAL '5 days'),
  (12.10, 12.10, 1, 1, 1, 2, 8, 8, NOW() - INTERVAL '12 days'),
  (105.00, 105.00, 1, 1, 3, 1, 9, 9, NOW() - INTERVAL '7 days'),
  (17.33, 17.33, 1, 1, 2, 3, 10, 10, NOW() - INTERVAL '4 days');

SELECT 
  'Contas' AS Tipo, COUNT(*) AS Quantidade
FROM tb_sistema_conta
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
SELECT 'Itens Pedido', COUNT(*) FROM tb_pedido_item
UNION ALL
SELECT 'Cashback', COUNT(*) FROM tb_loja_cashback
ORDER BY Tipo;
