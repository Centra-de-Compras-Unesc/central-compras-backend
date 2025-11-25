import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Utilitário para converter BigInt e Decimal em tipos JSON seguros
 */
function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) => {
      if (typeof value === "bigint") return value.toString();
      if (
        typeof value === "object" &&
        value !== null &&
        value.constructor?.name === "Decimal"
      )
        return parseFloat(value.toString());
      return value;
    })
  );
}


export const getPedidoItens = async (req, res) => {
  try {
    const itens = await prisma.tb_pedido_item.findMany({
      orderBy: { id: "asc" },
      take: 100,
      include: {
        tb_pedido: { select: { id: true, status: true, vl_total_pedido: true } },
        tb_fornecedor_produto: { select: { id: true, produto: true } },
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
      },
    });

    res.json(serializeBigInt(itens));
  } catch (error) {
    console.error("Erro no GET /pedido-itens:", error);
    res.status(500).json({
      error: "Erro ao listar itens de pedido",
      details: error.message,
    });
  }
};


export const getPedidoItemById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.tb_pedido_item.findUnique({
      where: { id },
      include: {
        tb_pedido: { select: { id: true, status: true } },
        tb_fornecedor_produto: { select: { id: true, produto: true } },
      },
    });

    if (!item)
      return res.status(404).json({ message: "Item de pedido não encontrado" });

    res.json(serializeBigInt(item));
  } catch (error) {
    console.error("Erro no GET /pedido-itens/:id:", error);
    res.status(500).json({
      error: "Erro ao buscar item de pedido",
      details: error.message,
    });
  }
};


export const createPedidoItem = async (req, res) => {
  try {
    const {
      id_pedido,
      id_conta,
      id_fornecedor,
      id_loja,
      id_usuario,
      id_produto,
      id_campanha,
      quantidade,
      valor_unitario,
      valor_total,
      percentual_cashback_aplicado,
      valor_cashback_previsto,
      codigo_produto,
      codigo_referencia,
      produto,
    } = req.body;

    if (!id_pedido || !id_conta || !id_fornecedor || !id_usuario)
      return res
        .status(400)
        .json({ message: "Campos obrigatórios ausentes." });

    const novoItem = await prisma.tb_pedido_item.create({
      data: {
        id_pedido: Number(id_pedido),
        id_conta: Number(id_conta),
        id_fornecedor: Number(id_fornecedor),
        id_loja: id_loja ? Number(id_loja) : null,
        id_usuario: Number(id_usuario),
        id_produto: id_produto ? Number(id_produto) : null,
        id_campanha: id_campanha ? Number(id_campanha) : null,
        quantidade: quantidade ? parseFloat(quantidade) : null,
        valor_unitario: valor_unitario ? parseFloat(valor_unitario) : null,
        valor_total: valor_total ? parseFloat(valor_total) : null,
        percentual_cashback_aplicado: percentual_cashback_aplicado
          ? parseFloat(percentual_cashback_aplicado)
          : null,
        valor_cashback_previsto: valor_cashback_previsto
          ? parseFloat(valor_cashback_previsto)
          : null,
        codigo_produto,
        codigo_referencia,
        produto,
      },
    });

    res.status(201).json(serializeBigInt(novoItem));
  } catch (error) {
    console.error("Erro no POST /pedido-itens:", error);
    res.status(500).json({
      error: "Erro ao criar item de pedido",
      details: error.message,
    });
  }
};


export const updatePedidoItem = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const itemExistente = await prisma.tb_pedido_item.findUnique({ where: { id } });

    if (!itemExistente)
      return res.status(404).json({ message: "Item de pedido não encontrado" });

    const itemAtualizado = await prisma.tb_pedido_item.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(itemAtualizado));
  } catch (error) {
    console.error("Erro no PUT /pedido-itens/:id:", error);
    res.status(500).json({
      error: "Erro ao atualizar item de pedido",
      details: error.message,
    });
  }
};


export const deletePedidoItem = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const itemExistente = await prisma.tb_pedido_item.findUnique({ where: { id } });

    if (!itemExistente)
      return res.status(404).json({ message: "Item de pedido não encontrado" });

    await prisma.tb_pedido_item.delete({ where: { id } });

    res.json({ message: "Item de pedido removido com sucesso" });
  } catch (error) {
    console.error("Erro no DELETE /pedido-itens/:id:", error);
    res.status(500).json({
      error: "Erro ao deletar item de pedido",
      details: error.message,
    });
  }
};
