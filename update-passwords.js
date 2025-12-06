import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from "./src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🔐 Atualizando senhas para 123456...");

  const senhaHash = await bcrypt.hash("123456", 10);

  const usuarios = await prisma.tb_sistema_usuario.findMany({
    select: { id: true, email: true }
  });

  for (const usuario of usuarios) {
    await prisma.tb_sistema_usuario.update({
      where: { id: usuario.id },
      data: { senha: senhaHash },
    });
    console.log(`✅ Senha atualizada: ${usuario.email}`);
  }

  console.log("✅ Todas as senhas foram atualizadas para 123456!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
