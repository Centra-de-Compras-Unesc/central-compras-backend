import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

async function seedHistoricoVendas() {
  try {
    console.log("🔄 Iniciando população de dados históricos...");

    const lojas = await prisma.tb_loja.findMany({ take: 5 });
    const fornecedores = await prisma.tb_fornecedor.findMany({ take: 5 });

    if (lojas.length === 0 || fornecedores.length === 0) {
      console.error("❌ Não há lojas ou fornecedores cadastrados!");
      return;
    }

    console.log(
      `📦 Encontradas ${lojas.length} lojas e ${fornecedores.length} fornecedores`
    );

    const statuses = ["Pendente", "Aprovado", "Faturado", "Entregue"];
    let pedidosCriados = 0;

    for (let diaRetrocesso = 0; diaRetrocesso < 365; diaRetrocesso++) {
      const data = new Date();
      data.setDate(data.getDate() - diaRetrocesso);

      const quantidadePedidos = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < quantidadePedidos; i++) {
        const loja = lojas[Math.floor(Math.random() * lojas.length)];
        const fornecedor =
          fornecedores[Math.floor(Math.random() * fornecedores.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        // Valor entre R$ 50 e R$ 800
        const valor = Math.floor(Math.random() * 750) + 50;

        try {
          await prisma.tb_pedido.create({
            data: {
              id_loja: loja.id,
              id_fornecedor: fornecedor.id,
              id_usuario: loja.id_usuario,
              id_conta: loja.id_conta,
              vl_total_pedido: parseFloat(valor.toFixed(2)),
              status,
              dt_inc: data,
            },
          });

          pedidosCriados++;

          if (pedidosCriados % 100 === 0) {
            console.log(`✅ ${pedidosCriados} pedidos criados...`);
          }
        } catch (error) {
          if (!error.message.includes("Unique")) {
            console.error(`Erro ao criar pedido: ${error.message}`);
          }
        }
      }
    }

    console.log(
      `\n✅ População concluída! ${pedidosCriados} pedidos históricos criados.`
    );
  } catch (error) {
    console.error("❌ Erro ao popular dados históricos:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedHistoricoVendas();
