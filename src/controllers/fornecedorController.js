import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Função utilitária para converter BigInt em string antes de enviar como JSON
 */
function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export const getFornecedores = async (req, res) => {
  try {
    const fornecedores = await prisma.tb_fornecedor.findMany({
      orderBy: { id: "asc" },
      take: 50,
    });

    const safeData = JSON.parse(
      JSON.stringify(fornecedores, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    res.json(safeData);
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar fornecedores",
      details: error.message,
    });
  }
};

export const getFornecedorById = async (req, res) => {
  try {
    const fornecedor = await prisma.tb_fornecedor.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!fornecedor)
      return res.status(404).json({ message: "Fornecedor não encontrado" });

    res.json(serializeBigInt(fornecedor));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar fornecedor",
      details: error.message,
    });
  }
};

export const createFornecedor = async (req, res) => {
  try {
    const {
      id_conta,
      id_usuario,
      razao_social,
      nome_fantasia,
      cnpj,
      email_fornecedor,
      telefone,
      site,
      ativo,
    } = req.body;

    if (!id_conta || !id_usuario || !cnpj || !email_fornecedor)
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });

    const novoFornecedor = await prisma.tb_fornecedor.create({
      data: {
        id_conta: Number(id_conta),
        id_usuario: Number(id_usuario),
        razao_social,
        nome_fantasia,
        cnpj,
        email_fornecedor,
        telefone,
        site,
        ativo: ativo ?? true,
      },
    });

    res.status(201).json(serializeBigInt(novoFornecedor));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar fornecedor",
      details: error.message,
    });
  }
};

export const updateFornecedor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const fornecedorExistente = await prisma.tb_fornecedor.findUnique({
      where: { id },
    });

    if (!fornecedorExistente)
      return res.status(404).json({ message: "Fornecedor não encontrado" });

    const fornecedorAtualizado = await prisma.tb_fornecedor.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(fornecedorAtualizado));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar fornecedor",
      details: error.message,
    });
  }
};

export const deleteFornecedor = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const fornecedorExistente = await prisma.tb_fornecedor.findUnique({
      where: { id },
    });

    if (!fornecedorExistente)
      return res.status(404).json({ message: "Fornecedor não encontrado" });

    await prisma.tb_fornecedor.delete({ where: { id } });

    res.json({ message: "Fornecedor removido com sucesso" });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar fornecedor",
      details: error.message,
    });
  }
};
