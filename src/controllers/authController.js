import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "segredo_super_seguro";

export const login = async (req, res) => {
  const { email, senha, id_conta } = req.body;

  try {
    const usuario = await prisma.tb_sistema_usuario.findUnique({
      where: {
        id_conta_email: {
          id_conta: Number(id_conta),
          email,
        },
      },
    });

    if (!usuario)
      return res.status(401).json({ message: "Usuário não encontrado" });

    let senhaCorreta = false;
    if (usuario.senha.startsWith("$2b$")) {
      senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    } else {
      senhaCorreta = usuario.senha === senha;
    }
    if (!senhaCorreta)
      return res.status(401).json({ message: "Senha incorreta" });

    const token = jwt.sign(
      {
        id: Number(usuario.id),
        email: usuario.email,
        nome: usuario.nome,
        id_conta: Number(usuario.id_conta),
      },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login realizado com sucesso!",
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro ao realizar login" });
  }
};

export const register = async (req, res) => {
  const { id_conta, nome, email, senha } = req.body;

  try {
    const usuarioExistente = await prisma.tb_sistema_usuario.findUnique({
      where: {
        id_conta_email: {
          id_conta: Number(id_conta),
          email,
        },
      },
    });

    if (usuarioExistente)
      return res
        .status(409)
        .json({ message: "E-mail já cadastrado para esta conta." });

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.tb_sistema_usuario.create({
      data: {
        id_conta: Number(id_conta),
        nome,
        email,
        senha: senhaHash,
        ativo: true,
      },
    });

    res.status(201).json({
      message: "Usuário registrado com sucesso",
      usuario: { id: novoUsuario.id, nome, email },
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ message: "Erro ao registrar usuário" });
  }
};
