import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


router.get("/", async (req, res) => {
  try {
    const condicoes = await prisma.tb_condicoes_comerciais.findMany({
      include: {
        tb_loja: true,
        tb_fornecedor: true,
      },
    });
    res.json(condicoes);
  } catch (error) {
    console.error("Erro ao listar condições:", error);
    res.status(500).json({ error: "Erro ao listar condições comerciais" });
  }
});


router.get("/:uf", async (req, res) => {
  const { uf } = req.params;
  try {
    const condicoes = await prisma.tb_condicoes_comerciais.findMany({
      where: { uf: uf.toUpperCase() },
      include: {
        tb_loja: true,
        tb_fornecedor: true,
      },
    });
    res.json(condicoes);
  } catch (error) {
    console.error("Erro ao buscar condições por UF:", error);
    res.status(500).json({ error: "Erro ao buscar condições" });
  }
});


router.post("/", async (req, res) => {
  const {
    id_loja,
    id_fornecedor,
    uf,
    cashback_percent,
    prazo_dias,
    acrescimo_percent,
  } = req.body;

  if (!id_loja || !id_fornecedor || !uf) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  try {
    const condicao = await prisma.tb_condicoes_comerciais.create({
      data: {
        id_loja: parseInt(id_loja),
        id_fornecedor: parseInt(id_fornecedor),
        uf: uf.toUpperCase(),
        cashback_percent: parseFloat(cashback_percent) || 0,
        prazo_dias: parseInt(prazo_dias) || 30,
        acrescimo_percent: parseFloat(acrescimo_percent) || 0,
        ativo: true,
        dt_inc: new Date(),
      },
    });
    res.status(201).json(condicao);
  } catch (error) {
    console.error("Erro ao criar condição:", error);
    res.status(500).json({ error: "Erro ao criar condição comercial" });
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { cashback_percent, prazo_dias, acrescimo_percent, ativo } = req.body;

  try {
    const condicao = await prisma.tb_condicoes_comerciais.update({
      where: { id: parseInt(id) },
      data: {
        cashback_percent:
          cashback_percent !== undefined
            ? parseFloat(cashback_percent)
            : undefined,
        prazo_dias: prazo_dias !== undefined ? parseInt(prazo_dias) : undefined,
        acrescimo_percent:
          acrescimo_percent !== undefined
            ? parseFloat(acrescimo_percent)
            : undefined,
        ativo: ativo !== undefined ? ativo : undefined,
        dt_upd: new Date(),
      },
    });
    res.json(condicao);
  } catch (error) {
    console.error("Erro ao atualizar condição:", error);
    res.status(500).json({ error: "Erro ao atualizar condição comercial" });
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.tb_condicoes_comerciais.delete({
      where: { id: parseInt(id) },
    });
    res.json({ mensagem: "Condição comercial deletada com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar condição:", error);
    res.status(500).json({ error: "Erro ao deletar condição comercial" });
  }
});

export default router;
