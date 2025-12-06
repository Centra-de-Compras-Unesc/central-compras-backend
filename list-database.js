import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}

async function main() {
  console.log('📊 RESUMO DO BANCO DE DADOS\n');

  const lojas = await prisma.tb_loja.findMany();
  console.log('🛒 LOJAS:');
  lojas.forEach(l => console.log(`   - ${l.nome_fantasia} (${l.cnpj})`));

  const fornecedores = await prisma.tb_fornecedor.findMany();
  console.log('\n🏭 FORNECEDORES:');
  fornecedores.forEach(f => console.log(`   - ${f.nome_fantasia} (${f.cnpj})`));

  const produtos = await prisma.tb_fornecedor_produto.findMany();
  console.log(`\n📦 PRODUTOS: Total de ${produtos.length} produtos`);
  const produtosAgrupados = {};
  for (const p of produtos) {
    const fornec = fornecedores.find(f => f.id === p.id_fornecedor);
    if (!produtosAgrupados[fornec.nome_fantasia]) {
      produtosAgrupados[fornec.nome_fantasia] = [];
    }
    produtosAgrupados[fornec.nome_fantasia].push(p.produto);
  }
  Object.entries(produtosAgrupados).forEach(([fornec, prods]) => {
    console.log(`   📍 ${fornec}: ${prods.length} produtos`);
    prods.slice(0, 3).forEach(p => console.log(`      - ${p}`));
    if (prods.length > 3) console.log(`      ... e mais ${prods.length - 3}`);
  });

  const campanhas = await prisma.tb_fornecedor_campanha.findMany();
  console.log(`\n🎯 CAMPANHAS: Total de ${campanhas.length} campanhas`);
  campanhas.forEach(c => console.log(`   - ${c.descricao_campanha}`));

  const pedidos = await prisma.tb_pedido.findMany();
  console.log(`\n📋 PEDIDOS: Total de ${pedidos.length} pedidos`);

  const cashbacks = await prisma.tb_loja_cashback.findMany();
  console.log(`\n💰 CASHBACKS: Total de ${cashbacks.length} registros de cashback`);

  console.log('\n✅ Todos os dados estão cadastrados no sistema!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
