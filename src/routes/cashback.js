import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


router.get("/saldo/:id_loja", async (req, res) => {
  const { id_loja } = req.params;

  try {
    const saldo = await prisma.tb_loja_cashback.findFirst({
      where: { id_loja: parseInt(id_loja) },
    });

    if (!saldo) {
      return res.json({
        id_loja: parseInt(id_loja),
        saldo_disponivel: 0,
        saldo_acumulado: 0,
        saldo_resgatado: 0,
      });
    }

    res.json(saldo);
  } catch (error) {
    console.error("Erro ao buscar saldo:", error);
    res.status(500).json({ error: "Erro ao buscar saldo de cashback" });
  }
});


router.get("/historico/:id_loja", async (req, res) => {
  const { id_loja } = req.params;

  try {
    const historico = await prisma.tb_loja_cashback_detalhes.findMany({
      where: { id_loja: parseInt(id_loja) },
      orderBy: { data: "desc" },
      take: 50,
    });

    res.json(historico);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro ao buscar histórico de cashback" });
  }
});


router.post("/resgatar", async (req, res) => {
  const { id_loja, valor, conta_bancaria } = req.body;

  if (!id_loja || !valor || valor <= 0) {
    return res.status(400).json({ error: "Dados inválidos para resgate" });
  }

  try {
    // Buscar saldo atual
    const saldo = await prisma.tb_loja_cashback.findFirst({
      where: { id_loja: parseInt(id_loja) },
    });

    if (!saldo || saldo.saldo_disponivel < valor) {
      return res.status(400).json({ error: "Saldo insuficiente para resgate" });
    }

    // Atualizar saldo
    const novoSaldo = await prisma.tb_loja_cashback.update({
      where: { id: saldo.id },
      data: {
        saldo_disponivel: saldo.saldo_disponivel - valor,
        saldo_resgatado: saldo.saldo_resgatado + valor,
        dt_upd: new Date(),
      },
    });

    // Registrar detalhe da transação
    const detalhe = await prisma.tb_loja_cashback_detalhes.create({
      data: {
        id_loja: parseInt(id_loja),
        tipo_movimentacao: "RESGATE",
        valor_movimentacao: valor,
        descricao: `Resgate via ${conta_bancaria || "Sistema"}`,
        status: "PROCESSANDO",
        data: new Date(),
        dt_inc: new Date(),
      },
    });

    res.status(201).json({
      mensagem: "Resgate processado com sucesso",
      saldo: novoSaldo,
      detalhe,
      prazo: "2 dias úteis",
    });
  } catch (error) {
    console.error("Erro ao processar resgate:", error);
    res.status(500).json({ error: "Erro ao processar resgate" });
  }
});


router.post("/credito", async (req, res) => {
  const { id_loja, valor, origem } = req.body;

  if (!id_loja || !valor || valor <= 0) {
    return res.status(400).json({ error: "Dados inválidos para crédito" });
  }

  try {
    let saldo = await prisma.tb_loja_cashback.findFirst({
      where: { id_loja: parseInt(id_loja) },
    });

    // Se não existe, criar novo
    if (!saldo) {
      saldo = await prisma.tb_loja_cashback.create({
        data: {
          id_loja: parseInt(id_loja),
          saldo_disponivel: valor,
          saldo_acumulado: valor,
          saldo_resgatado: 0,
          dt_inc: new Date(),
        },
      });
    } else {
      saldo = await prisma.tb_loja_cashback.update({
        where: { id: saldo.id },
        data: {
          saldo_disponivel: saldo.saldo_disponivel + valor,
          saldo_acumulado: saldo.saldo_acumulado + valor,
          dt_upd: new Date(),
        },
      });
    }

    // Registrar detalhe
    const detalhe = await prisma.tb_loja_cashback_detalhes.create({
      data: {
        id_loja: parseInt(id_loja),
        tipo_movimentacao: "CREDITO",
        valor_movimentacao: valor,
        descricao: origem || "Crédito de cashback",
        status: "CONFIRMADO",
        data: new Date(),
        dt_inc: new Date(),
      },
    });

    res.status(201).json({
      mensagem: "Crédito adicionado com sucesso",
      saldo,
      detalhe,
    });
  } catch (error) {
    console.error("Erro ao adicionar crédito:", error);
    res.status(500).json({ error: "Erro ao adicionar crédito de cashback" });
  }
});

export default router;
