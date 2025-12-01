import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();

export const validateFornecedorOwnership = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id_usuario } = req.user; 

    if (!id || !id_usuario) {
      return res.status(400).json({ error: "Parâmetros inválidos" });
    }

    const condicao = await prisma.tb_fornecedor_condicao.findUnique({
      where: { id: BigInt(id) },
      include: {
        tb_fornecedor: {
          select: { id_usuario: true },
        },
      },
    });

    if (!condicao) {
      return res.status(404).json({ error: "Condição não encontrada" });
    }

    if (condicao.tb_fornecedor.id_usuario !== BigInt(id_usuario)) {
      return res.status(403).json({
        error: "Acesso negado: você não tem permissão para modificar esta condição",
      });
    }

    req.condicao = condicao;
    next();
  } catch (error) {
    res.status(500).json({ error: "Erro ao validar autorização" });
  }
};
