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


export const getCampanhaProdutos = async (req, res) => {
  try {
    const campanhaProdutos = await prisma.tb_fornecedor_campanha_produto.findMany({
      orderBy: { id: "asc" },
      take: 100,
      include: {
        tb_fornecedor_campanha: {
          select: { id: true, descricao_campanha: true, ativa: true },
        },
        tb_fornecedor_produto: {
          select: { id: true, produto: true, valor_produto: true },
        },
      },
    });

    res.json(serializeBigInt(campanhaProdutos));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar campanha-produto",
      details: error.message,
    });
  }
};


export const getCampanhaProdutoById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const campanhaProduto = await prisma.tb_fornecedor_campanha_produto.findUnique({
      where: { id },
      include: {
        tb_fornecedor_campanha: { select: { id: true, descricao_campanha: true } },
        tb_fornecedor_produto: { select: { id: true, produto: true } },
      },
    });

    if (!campanhaProduto)
      return res.status(404).json({ message: "Relação campanha-produto não encontrada" });

    res.json(serializeBigInt(campanhaProduto));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar relação campanha-produto",
      details: error.message,
    });
  }
};


export const createCampanhaProduto = async (req, res) => {
  try {
    const { id_conta, id_usuario, id_campanha, id_produto, preco_promocional } = req.body;

    if (!id_conta || !id_usuario || !id_campanha || !id_produto) {
      return res
        .status(400)
        .json({ message: "Campos obrigatórios ausentes (id_conta, id_usuario, id_campanha, id_produto)" });
    }

    const novaRelacao = await prisma.tb_fornecedor_campanha_produto.create({
      data: {
        id_conta: Number(id_conta),
        id_usuario: Number(id_usuario),
        id_campanha: Number(id_campanha),
        id_produto: Number(id_produto),
        preco_promocional: preco_promocional ? parseFloat(preco_promocional) : null,
      },
    });

    res.status(201).json(serializeBigInt(novaRelacao));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar relação campanha-produto",
      details: error.message,
    });
  }
};


export const updateCampanhaProduto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const relacaoExistente = await prisma.tb_fornecedor_campanha_produto.findUnique({
      where: { id },
    });

    if (!relacaoExistente)
      return res.status(404).json({ message: "Relação campanha-produto não encontrada" });

    const relacaoAtualizada = await prisma.tb_fornecedor_campanha_produto.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(relacaoAtualizada));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar relação campanha-produto",
      details: error.message,
    });
  }
};


export const deleteCampanhaProduto = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const relacaoExistente = await prisma.tb_fornecedor_campanha_produto.findUnique({
      where: { id },
    });

    if (!relacaoExistente)
      return res.status(404).json({ message: "Relação campanha-produto não encontrada" });

    await prisma.tb_fornecedor_campanha_produto.delete({ where: { id } });

    res.json({ message: "Relação campanha-produto removida com sucesso" });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar relação campanha-produto",
      details: error.message,
    });
  }
};
