import { PrismaClient } from "@prisma/client";
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

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.tb_sistema_usuario.findMany({
      orderBy: { id: "asc" },
      take: 100,
      include: {
        tb_sistema_conta: { select: { id: true, nm_conta: true } },
      },
    });

    res.json(serializeBigInt(usuarios));
  } catch (error) {
    console.error("Erro no GET /usuarios:", error);
    res.status(500).json({
      error: "Erro ao listar usuários",
      details: error.message,
    });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuario = await prisma.tb_sistema_usuario.findUnique({
      where: { id },
      include: {
        tb_sistema_conta: { select: { id: true, nm_conta: true } },
      },
    });

    if (!usuario)
      return res.status(404).json({ message: "Usuário não encontrado" });

    res.json(serializeBigInt(usuario));
  } catch (error) {
    console.error("Erro no GET /usuarios/:id:", error);
    res.status(500).json({
      error: "Erro ao buscar usuário",
      details: error.message,
    });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const { id_conta, nome, email, senha, ativo } = req.body;

    if (!id_conta || !nome || !email || !senha)
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });

    const novoUsuario = await prisma.tb_sistema_usuario.create({
      data: {
        id_conta: Number(id_conta),
        nome,
        email,
        senha,
        ativo: ativo ?? true,
      },
    });

    res.status(201).json(serializeBigInt(novoUsuario));
  } catch (error) {
    console.error("Erro no POST /usuarios:", error);

    // Tratamento específico de erro de chave única (email duplicado)
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "E-mail já cadastrado para esta conta." });
    }

    res.status(500).json({
      error: "Erro ao criar usuário",
      details: error.message,
    });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const usuarioExistente = await prisma.tb_sistema_usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente)
      return res.status(404).json({ message: "Usuário não encontrado" });

    const usuarioAtualizado = await prisma.tb_sistema_usuario.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(usuarioAtualizado));
  } catch (error) {
    console.error("Erro no PUT /usuarios/:id:", error);
    res.status(500).json({
      error: "Erro ao atualizar usuário",
      details: error.message,
    });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const usuarioExistente = await prisma.tb_sistema_usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente)
      return res.status(404).json({ message: "Usuário não encontrado" });

    await prisma.tb_sistema_usuario.delete({ where: { id } });

    res.json({ message: "Usuário removido com sucesso" });
  } catch (error) {
    console.error("Erro no DELETE /usuarios/:id:", error);
    res.status(500).json({
      error: "Erro ao deletar usuário",
      details: error.message,
    });
  }
};
