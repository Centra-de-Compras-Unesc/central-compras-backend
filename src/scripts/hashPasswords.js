import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function atualizarSenhas() {
  try {
    const usuarios = await prisma.tb_sistema_usuario.findMany();

    for (const user of usuarios) {
      if (!user.senha.startsWith("$2")) {
        const novaSenhaHash = await bcrypt.hash(user.senha, 10);
        await prisma.tb_sistema_usuario.update({
          where: { id: user.id },
          data: { senha: novaSenhaHash },
        });
      }
    }

  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
}

atualizarSenhas();
