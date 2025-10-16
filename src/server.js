import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import { jsonBigIntMiddleware } from "./middlewares/jsonBigIntMiddleware.js";

import fornecedoresRoutes from "./routes/fornecedores.js";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use(jsonBigIntMiddleware);

// Teste: conexão com o banco
app.get("/", async (req, res) => {
  try {
    const now = await prisma.$queryRaw`SELECT NOW() as current_time`;
    res.send(`🚀 Conectado ao banco db_interdisciplinar! Hora atual: ${now[0].current_time}`);
  } catch (error) {
    res.status(500).json({ error: "Erro ao conectar ao banco", details: error.message });
  }
});

// Exemplo: listar fornecedores
app.get("/fornecedores", async (req, res) => {
  try {
    const fornecedores = await prisma.tb_fornecedor.findMany({
      take: 10,
    });
    res.json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar fornecedores" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});

app.use("/fornecedores", fornecedoresRoutes);
