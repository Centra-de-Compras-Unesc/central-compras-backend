import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Função utilitária para converter BigInt e Decimal em tipos seguros de JSON
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


export const getCampanhas = async (req, res) => {
  try {
    const campanhas = await prisma.tb_fornecedor_campanha.findMany({
      orderBy: { id: "asc" },
      take: 100,
      include: {
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
        tb_sistema_usuario: { select: { id: true, nome: true, email: true } },
      },
    });

    res.json(serializeBigInt(campanhas));
  } catch (error) {
    console.error("Erro no GET /campanhas:", error);
    res.status(500).json({
      error: "Erro ao listar campanhas",
      details: error.message,
    });
  }
};


export const getCampanhaById = async (req, res) => {
  try {
    const campanha = await prisma.tb_fornecedor_campanha.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
        tb_sistema_usuario: { select: { id: true, nome: true, email: true } },
      },
    });

    if (!campanha)
      return res.status(404).json({ message: "Campanha não encontrada" });

    res.json(serializeBigInt(campanha));
  } catch (error) {
    console.error("Erro no GET /campanhas/:id:", error);
    res.status(500).json({
      error: "Erro ao buscar campanha",
      details: error.message,
    });
  }
};


export const createCampanha = async (req, res) => {
  try {
    const {
      id_fornecedor,
      id_usuario,
      id_conta,
      descricao_campanha,
      valor_meta,
      tempo_duracao_campanha,
      dt_inicio,
      dt_fim,
      tipo,
      pedido_minimo,
      percentual_cashback_campanha,
      bloquear_pedidos_se_nao_atingir,
      tem_meta_global,
      ativa,
      status,
      foto,
    } = req.body;

    if (!id_fornecedor || !id_usuario || !id_conta || !descricao_campanha)
      return res
        .status(400)
        .json({ message: "Campos obrigatórios ausentes." });

    const novaCampanha = await prisma.tb_fornecedor_campanha.create({
      data: {
        id_fornecedor: Number(id_fornecedor),
        id_usuario: Number(id_usuario),
        id_conta: Number(id_conta),
        descricao_campanha,
        valor_meta: valor_meta ? parseFloat(valor_meta) : null,
        tempo_duracao_campanha: tempo_duracao_campanha
          ? Number(tempo_duracao_campanha)
          : null,
        dt_inicio: dt_inicio ? new Date(dt_inicio) : null,
        dt_fim: dt_fim ? new Date(dt_fim) : null,
        tipo,
        pedido_minimo: pedido_minimo ? parseFloat(pedido_minimo) : null,
        percentual_cashback_campanha: percentual_cashback_campanha
          ? parseFloat(percentual_cashback_campanha)
          : null,
        bloquear_pedidos_se_nao_atingir:
          bloquear_pedidos_se_nao_atingir ?? false,
        tem_meta_global: tem_meta_global ?? false,
        ativa: ativa ?? true,
        status,
        foto: foto ? Buffer.from(foto, "base64") : null,
      },
    });

    res.status(201).json(serializeBigInt(novaCampanha));
  } catch (error) {
    console.error("Erro no POST /campanhas:", error);
    res.status(500).json({
      error: "Erro ao criar campanha",
      details: error.message,
    });
  }
};


export const updateCampanha = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const campanhaExistente = await prisma.tb_fornecedor_campanha.findUnique({
      where: { id },
    });

    if (!campanhaExistente)
      return res.status(404).json({ message: "Campanha não encontrada" });

    const campanhaAtualizada = await prisma.tb_fornecedor_campanha.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(campanhaAtualizada));
  } catch (error) {
    console.error("Erro no PUT /campanhas/:id:", error);
    res.status(500).json({
      error: "Erro ao atualizar campanha",
      details: error.message,
    });
  }
};


export const deleteCampanha = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const campanhaExistente = await prisma.tb_fornecedor_campanha.findUnique({
      where: { id },
    });

    if (!campanhaExistente)
      return res.status(404).json({ message: "Campanha não encontrada" });

    await prisma.tb_fornecedor_campanha.delete({ where: { id } });

    res.json({ message: "Campanha removida com sucesso" });
  } catch (error) {
    console.error("Erro no DELETE /campanhas/:id:", error);
    res.status(500).json({
      error: "Erro ao deletar campanha",
      details: error.message,
    });
  }
};
