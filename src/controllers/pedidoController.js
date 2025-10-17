import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Função utilitária para converter BigInt e Decimal em tipos JSON seguros
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

// ===========================
// GET: Lista todos os pedidos
// ===========================
export const getPedidos = async (req, res) => {
  try {
    const pedidos = await prisma.tb_pedido.findMany({
      orderBy: { id: "asc" },
      take: 100,
      include: {
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
        tb_loja: { select: { id: true, nome_fantasia: true } },
        tb_sistema_usuario: { select: { id: true, nome: true, email: true } },
      },
    });

    res.json(serializeBigInt(pedidos));
  } catch (error) {
    console.error("Erro no GET /pedidos:", error);
    res.status(500).json({
      error: "Erro ao listar pedidos",
      details: error.message,
    });
  }
};

// ===========================
// GET: Pedido específico
// ===========================
export const getPedidoById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedido = await prisma.tb_pedido.findUnique({
      where: { id },
      include: {
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
        tb_loja: { select: { id: true, nome_fantasia: true } },
        tb_sistema_usuario: { select: { id: true, nome: true, email: true } },
        tb_pedido_item: true,
      },
    });

    if (!pedido) return res.status(404).json({ message: "Pedido não encontrado" });

    res.json(serializeBigInt(pedido));
  } catch (error) {
    console.error("Erro no GET /pedidos/:id:", error);
    res.status(500).json({
      error: "Erro ao buscar pedido",
      details: error.message,
    });
  }
};

// ===========================
// POST: Cria novo pedido
// ===========================
export const createPedido = async (req, res) => {
  try {
    const {
      id_usuario,
      id_conta,
      id_fornecedor,
      id_loja,
      status,
      status_norm,
      codigo_rastreamento,
      vl_total_pedido,
      numero_nota_fiscal,
      chave_nota_fiscal,
      canal,
      is_televenda,
    } = req.body;

    // Validação mínima
    if (!id_usuario || !id_conta || !id_fornecedor || !id_loja)
      return res
        .status(400)
        .json({ message: "Campos obrigatórios ausentes (usuário, conta, fornecedor, loja)." });

    const novoPedido = await prisma.tb_pedido.create({
      data: {
        id_usuario: Number(id_usuario),
        id_conta: Number(id_conta),
        id_fornecedor: Number(id_fornecedor),
        id_loja: Number(id_loja),
        status,
        status_norm,
        codigo_rastreamento,
        vl_total_pedido: vl_total_pedido ? parseFloat(vl_total_pedido) : null,
        numero_nota_fiscal,
        chave_nota_fiscal,
        canal,
        is_televenda: is_televenda ?? false,
      },
    });

    res.status(201).json(serializeBigInt(novoPedido));
  } catch (error) {
    console.error("Erro no POST /pedidos:", error);
    res.status(500).json({
      error: "Erro ao criar pedido",
      details: error.message,
    });
  }
};

// ===========================
// PUT: Atualiza pedido
// ===========================
export const updatePedido = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedidoExistente = await prisma.tb_pedido.findUnique({
      where: { id },
    });

    if (!pedidoExistente)
      return res.status(404).json({ message: "Pedido não encontrado" });

    const pedidoAtualizado = await prisma.tb_pedido.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(pedidoAtualizado));
  } catch (error) {
    console.error("Erro no PUT /pedidos/:id:", error);
    res.status(500).json({
      error: "Erro ao atualizar pedido",
      details: error.message,
    });
  }
};

// ===========================
// DELETE: Remove pedido
// ===========================
export const deletePedido = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedidoExistente = await prisma.tb_pedido.findUnique({
      where: { id },
    });

    if (!pedidoExistente)
      return res.status(404).json({ message: "Pedido não encontrado" });

    await prisma.tb_pedido.delete({ where: { id } });

    res.json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    console.error("Erro no DELETE /pedidos/:id:", error);
    res.status(500).json({
      error: "Erro ao deletar pedido",
      details: error.message,
    });
  }
};
