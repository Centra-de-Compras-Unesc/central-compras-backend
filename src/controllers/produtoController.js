import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

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

export const getProdutos = async (req, res) => {
  try {
    const produtos = await prisma.tb_fornecedor_produto.findMany({
      orderBy: { id: "asc" },
      take: 100,
      include: {
        tb_categoria: { select: { id: true, nome: true } }, // ✅ campo 'nome' corrigido
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
      },
    });

    res.json(serializeBigInt(produtos));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar produtos",
      details: error.message,
    });
  }
};

export const getProdutoById = async (req, res) => {
  try {
    const produto = await prisma.tb_fornecedor_produto.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        tb_categoria: { select: { id: true, nome: true } },
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
      },
    });

    if (!produto)
      return res.status(404).json({ message: "Produto não encontrado" });

    res.json(serializeBigInt(produto));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar produto",
      details: error.message,
    });
  }
};

export const createProduto = async (req, res) => {
  try {
    const {
      id_fornecedor,
      id_usuario,
      id_conta,
      id_categoria,
      codigo_produto,
      produto,
      gtin,
      codigo_referencia,
      tipo_embalagem,
      valor_produto,
      foto,
    } = req.body;

    if (
      !id_fornecedor ||
      !id_usuario ||
      !id_conta ||
      !produto ||
      !valor_produto
    )
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });

    const novoProduto = await prisma.tb_fornecedor_produto.create({
      data: {
        id_fornecedor: Number(id_fornecedor),
        id_usuario: Number(id_usuario),
        id_conta: Number(id_conta),
        id_categoria: id_categoria ? Number(id_categoria) : null,
        codigo_produto,
        produto,
        gtin,
        codigo_referencia,
        tipo_embalagem,
        valor_produto: parseFloat(valor_produto),
        foto: foto ? Buffer.from(foto, "base64") : null,
      },
    });

    res.status(201).json(serializeBigInt(novoProduto));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar produto",
      details: error.message,
    });
  }
};

export const updateProduto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const produtoExistente = await prisma.tb_fornecedor_produto.findUnique({
      where: { id },
    });

    if (!produtoExistente)
      return res.status(404).json({ message: "Produto não encontrado" });

    const produtoAtualizado = await prisma.tb_fornecedor_produto.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(produtoAtualizado));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar produto",
      details: error.message,
    });
  }
};

export const deleteProduto = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const produtoExistente = await prisma.tb_fornecedor_produto.findUnique({
      where: { id },
    });

    if (!produtoExistente)
      return res.status(404).json({ message: "Produto não encontrado" });

    await prisma.tb_fornecedor_produto.delete({ where: { id } });

    res.json({ message: "Produto removido com sucesso" });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar produto",
      details: error.message,
    });
  }
};
