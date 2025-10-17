import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function atualizarSenhas() {
  try {
    const usuarios = await prisma.tb_sistema_usuario.findMany();

    for (const user of usuarios) {
      // se a senha não for hash (bcrypt sempre começa com "$2a$" ou "$2b$")
      if (!user.senha.startsWith("$2")) {
        const novaSenhaHash = await bcrypt.hash(user.senha, 10);
        await prisma.tb_sistema_usuario.update({
          where: { id: user.id },
          data: { senha: novaSenhaHash },
        });
        console.log(`✅ Senha atualizada para: ${user.email}`);
      }
    }

    console.log("✅ Todas as senhas foram verificadas e atualizadas com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao atualizar senhas:", error);
  } finally {
    await prisma.$disconnect();
  }
}

atualizarSenhas();
