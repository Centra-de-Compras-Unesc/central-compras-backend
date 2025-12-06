import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from "./src/generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding usuários...");

  // Hash da senha "123456"
  const senhaHash = await bcrypt.hash("123456", 10);

  // Obter conta existente
  const conta = await prisma.tb_sistema_conta.findFirst();
  if (!conta) {
    console.error("❌ Nenhuma conta encontrada!");
    process.exit(1);
  }
  console.log(`✅ Usando conta ID: ${conta.id}`);

  // Usuários a serem criados
  const usuarios = [
    {
      nome: "Admin",
      email: "admin@teste.com",
      senha: senhaHash,
      ativo: true,
    },
    {
      nome: "Fornecedor Brasil Ltda",
      email: "fornecedor1@teste.com",
      senha: senhaHash,
      cnpj: "11222333000181",
      ativo: true,
    },
    {
      nome: "Fornecedor 2",
      email: "fornecedor2@teste.com",
      senha: senhaHash,
      cnpj: "22333444000182",
      ativo: true,
    },
    {
      nome: "Fornecedor 3",
      email: "fornecedor3@teste.com",
      senha: senhaHash,
      cnpj: "33444555000183",
      ativo: true,
    },
    {
      nome: "Loja 1",
      email: "loja1@teste.com",
      senha: senhaHash,
      loja: "Loja 1",
      ativo: true,
    },
    {
      nome: "Loja 2",
      email: "loja2@teste.com",
      senha: senhaHash,
      loja: "Loja 2",
      ativo: true,
    },
    {
      nome: "Loja 3",
      email: "loja3@teste.com",
      senha: senhaHash,
      loja: "Loja 3",
      ativo: true,
    },
  ];

  for (const usuario of usuarios) {
    const existing = await prisma.tb_sistema_usuario.findUnique({
      where: { email: usuario.email },
    }).catch(() => null);

    if (!existing) {
      await prisma.tb_sistema_usuario.create({
        data: {
          ...usuario,
          id_conta: conta.id,
        },
      });
      console.log(`✅ Usuário criado: ${usuario.email}`);
    } else {
      console.log(`⏭️  Usuário já existe: ${usuario.email}`);
    }
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
