import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function serializeBigInt(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export const getLojas = async (req, res) => {
  try {
    const lojas = await prisma.tb_loja.findMany({
      orderBy: { id: "asc" },
      take: 50,
    });

    res.json(serializeBigInt(lojas));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar lojas",
      details: error.message,
    });
  }
};

export const getLojaById = async (req, res) => {
  try {
    const loja = await prisma.tb_loja.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!loja) return res.status(404).json({ message: "Loja não encontrada" });

    res.json(serializeBigInt(loja));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar loja",
      details: error.message,
    });
  }
};

export const createLoja = async (req, res) => {
  try {
    const {
      id_conta,
      id_usuario,
      razao_social,
      nome_fantasia,
      cnpj,
      email_loja,
      telefone,
      site,
      ativo,
    } = req.body;

    if (!id_conta || !id_usuario || !razao_social || !cnpj) {
      return res.status(400).json({
        message:
          "Campos obrigatórios ausentes: id_conta, id_usuario, razao_social, cnpj",
      });
    }

    const novaLoja = await prisma.tb_loja.create({
      data: {
        id_conta: Number(id_conta),
        id_usuario: Number(id_usuario),
        razao_social,
        nome_fantasia: nome_fantasia || null,
        cnpj,
        email_loja,
        telefone,
        site,
        ativo: ativo ?? true,
      },
    });

    res.status(201).json(serializeBigInt(novaLoja));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar loja",
      details: error.message,
    });
  }
};

export const updateLoja = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const lojaExistente = await prisma.tb_loja.findUnique({
      where: { id },
    });

    if (!lojaExistente)
      return res.status(404).json({ message: "Loja não encontrada" });

    const lojaAtualizada = await prisma.tb_loja.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(lojaAtualizada));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar loja",
      details: error.message,
    });
  }
};

export const deleteLoja = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const lojaExistente = await prisma.tb_loja.findUnique({
      where: { id },
    });

    if (!lojaExistente)
      return res.status(404).json({ message: "Loja não encontrada" });

    await prisma.tb_loja.delete({ where: { id } });

    res.json({ message: "Loja removida com sucesso" });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar loja",
      details: error.message,
    });
  }
};
