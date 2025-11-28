import express from "express";
import { PrismaClient } from "../generated/prisma/index.js";
import { verifyToken as authMiddleware } from "../middlewares/authMiddleware.js";
import { validateFornecedorOwnership } from "../middlewares/validateFornecedor.js";
import { criarCondicaoSchema, atualizarCondicaoSchema, validarDados } from "../schemas/condicaoSchema.js";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * GET /condicoesComercias
 * Listar todas as condições comerciais do fornecedor autenticado
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { id_usuario, id_conta } = req.user;

    if (!id_usuario || !id_conta) {
      return res.status(400).json({ error: "Dados de usuário incompletos" });
    }

    const condicoes = await prisma.tb_fornecedor_condicao.findMany({
      where: {
        tb_fornecedor: {
          id_usuario: BigInt(id_usuario),
        },
      },
      include: {
        tb_fornecedor: {
          select: {
            id: true,
            razao_social: true,
            nome_fantasia: true,
          },
        },
      },
      orderBy: { estado: "asc" },
    });

    // Converter BigInt para string
    const result = condicoes.map((c) => ({
      ...c,
      id: c.id.toString(),
      id_fornecedor: c.id_fornecedor.toString(),
      id_conta: c.id_conta.toString(),
      id_usuario: c.id_usuario.toString(),
      percentual_cashback: c.percentual_cashback ? parseFloat(c.percentual_cashback) : null,
      prazo_pagamento_dias: c.prazo_pagamento_dias,
      ajuste_unitario: c.ajuste_unitario ? parseFloat(c.ajuste_unitario) : null,
      pedido_minimo: c.pedido_minimo ? parseFloat(c.pedido_minimo) : null,
      pedido_minimo_frete_cif: c.pedido_minimo_frete_cif ? parseFloat(c.pedido_minimo_frete_cif) : null,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar condições comerciais" });
  }
});

/**
 * GET /condicoesComercias/estado/:uf
 * Listar condições por estado (filtrado para fornecedor autenticado)
 */
router.get("/estado/:uf", authMiddleware, async (req, res) => {
  try {
    const { uf } = req.params;
    const { id_usuario } = req.user;

    if (!id_usuario) {
      return res.status(400).json({ error: "Dados de usuário incompletos" });
    }

    const condicoes = await prisma.tb_fornecedor_condicao.findMany({
      where: {
        estado: uf.toUpperCase(),
        tb_fornecedor: {
          id_usuario: BigInt(id_usuario),
        },
      },
      include: {
        tb_fornecedor: {
          select: {
            id: true,
            razao_social: true,
            nome_fantasia: true,
          },
        },
      },
    });

    const result = condicoes.map((c) => ({
      ...c,
      id: c.id.toString(),
      id_fornecedor: c.id_fornecedor.toString(),
      id_conta: c.id_conta.toString(),
      id_usuario: c.id_usuario.toString(),
      percentual_cashback: c.percentual_cashback ? parseFloat(c.percentual_cashback) : null,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar condições por estado" });
  }
});

/**
 * GET /condicoesComercias/:id
 * Obter uma condição específica (com validação de propriedade)
 */
router.get("/:id", authMiddleware, validateFornecedorOwnership, async (req, res) => {
  try {
    const { id } = req.params;

    const condicao = await prisma.tb_fornecedor_condicao.findUnique({
      where: { id: BigInt(id) },
      include: {
        tb_fornecedor: {
          select: {
            id: true,
            razao_social: true,
            nome_fantasia: true,
          },
        },
      },
    });

    if (!condicao) {
      return res.status(404).json({ error: "Condição comercial não encontrada" });
    }

    const result = {
      ...condicao,
      id: condicao.id.toString(),
      id_fornecedor: condicao.id_fornecedor.toString(),
      id_conta: condicao.id_conta.toString(),
      id_usuario: condicao.id_usuario.toString(),
      percentual_cashback: condicao.percentual_cashback ? parseFloat(condicao.percentual_cashback) : null,
      ajuste_unitario: condicao.ajuste_unitario ? parseFloat(condicao.ajuste_unitario) : null,
      pedido_minimo: condicao.pedido_minimo ? parseFloat(condicao.pedido_minimo) : null,
      pedido_minimo_frete_cif: condicao.pedido_minimo_frete_cif ? parseFloat(condicao.pedido_minimo_frete_cif) : null,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter condição comercial" });
  }
});

/**
 * POST /condicoesComercias
 * Criar uma nova condição comercial
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { id_usuario, id_conta, id_fornecedor } = req.user;
    const body = req.body;

    if (!id_usuario || !id_conta || !id_fornecedor) {
      return res.status(400).json({ error: "Dados de usuário incompletos" });
    }

    // Validar dados usando schema
    const validacao = validarDados(body, criarCondicaoSchema);
    if (!validacao.isValid) {
      return res.status(400).json({ error: validacao.error });
    }

    const condicao = await prisma.tb_fornecedor_condicao.create({
      data: {
        estado: body.estado.toUpperCase(),
        id_fornecedor: BigInt(id_fornecedor),
        id_conta: BigInt(id_conta),
        id_usuario: BigInt(id_usuario),
        percentual_cashback: body.percentual_cashback || null,
        prazo_pagamento_dias: body.prazo_pagamento_dias || null,
        ajuste_unitario: body.ajuste_unitario || null,
        pedido_minimo: body.pedido_minimo || null,
        pedido_minimo_frete_cif: body.pedido_minimo_frete_cif || null,
        prazo_entrega: body.prazo_entrega || null,
        observacoes: body.observacoes || null,
        condicao_especial: body.condicao_especial || null,
        politica_devolucao: body.politica_devolucao || null,
        prazo_pagamento: body.prazo_pagamento || null,
        link_catalogo: body.link_catalogo || null,
      },
      include: {
        tb_fornecedor: {
          select: {
            id: true,
            razao_social: true,
            nome_fantasia: true,
          },
        },
      },
    });

    const result = {
      ...condicao,
      id: condicao.id.toString(),
      id_fornecedor: condicao.id_fornecedor.toString(),
      id_conta: condicao.id_conta.toString(),
      id_usuario: condicao.id_usuario.toString(),
      percentual_cashback: condicao.percentual_cashback ? parseFloat(condicao.percentual_cashback) : null,
      ajuste_unitario: condicao.ajuste_unitario ? parseFloat(condicao.ajuste_unitario) : null,
      pedido_minimo: condicao.pedido_minimo ? parseFloat(condicao.pedido_minimo) : null,
      pedido_minimo_frete_cif: condicao.pedido_minimo_frete_cif ? parseFloat(condicao.pedido_minimo_frete_cif) : null,
    };

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar condição comercial" });
  }
});

/**
 * PUT /condicoesComercias/:id
 * Atualizar uma condição comercial (com validação de propriedade)
 */
router.put("/:id", authMiddleware, validateFornecedorOwnership, async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    // Validar dados usando schema (permitindo campos opcionais)
    const validacao = validarDados(body, atualizarCondicaoSchema);
    if (!validacao.isValid) {
      return res.status(400).json({ error: validacao.error });
    }

    const dados = {};
    
    // Apenas incluir campos que foram enviados
    if (body.estado) dados.estado = body.estado.toUpperCase();
    if (body.percentual_cashback !== undefined && body.percentual_cashback !== null) dados.percentual_cashback = body.percentual_cashback;
    if (body.prazo_pagamento_dias !== undefined && body.prazo_pagamento_dias !== null) dados.prazo_pagamento_dias = body.prazo_pagamento_dias;
    if (body.ajuste_unitario !== undefined && body.ajuste_unitario !== null) dados.ajuste_unitario = body.ajuste_unitario;
    if (body.pedido_minimo !== undefined && body.pedido_minimo !== null) dados.pedido_minimo = body.pedido_minimo;
    if (body.pedido_minimo_frete_cif !== undefined && body.pedido_minimo_frete_cif !== null) dados.pedido_minimo_frete_cif = body.pedido_minimo_frete_cif;
    if (body.prazo_entrega !== undefined && body.prazo_entrega !== null) dados.prazo_entrega = body.prazo_entrega;
    if (body.observacoes !== undefined && body.observacoes !== null) dados.observacoes = body.observacoes;
    if (body.condicao_especial !== undefined && body.condicao_especial !== null) dados.condicao_especial = body.condicao_especial;
    if (body.politica_devolucao !== undefined && body.politica_devolucao !== null) dados.politica_devolucao = body.politica_devolucao;
    if (body.prazo_pagamento !== undefined && body.prazo_pagamento !== null) dados.prazo_pagamento = body.prazo_pagamento;
    if (body.link_catalogo !== undefined && body.link_catalogo !== null) dados.link_catalogo = body.link_catalogo;

    const condicao = await prisma.tb_fornecedor_condicao.update({
      where: { id: BigInt(id) },
      data: dados,
      include: {
        tb_fornecedor: {
          select: {
            id: true,
            razao_social: true,
            nome_fantasia: true,
          },
        },
      },
    });

    const result = {
      ...condicao,
      id: condicao.id.toString(),
      id_fornecedor: condicao.id_fornecedor.toString(),
      id_conta: condicao.id_conta.toString(),
      id_usuario: condicao.id_usuario.toString(),
      percentual_cashback: condicao.percentual_cashback ? parseFloat(condicao.percentual_cashback) : null,
      ajuste_unitario: condicao.ajuste_unitario ? parseFloat(condicao.ajuste_unitario) : null,
      pedido_minimo: condicao.pedido_minimo ? parseFloat(condicao.pedido_minimo) : null,
      pedido_minimo_frete_cif: condicao.pedido_minimo_frete_cif ? parseFloat(condicao.pedido_minimo_frete_cif) : null,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar condição comercial" });
  }
});

/**
 * DELETE /condicoesComercias/:id
 * Deletar uma condição comercial (com validação de propriedade)
 */
router.delete("/:id", authMiddleware, validateFornecedorOwnership, async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.tb_fornecedor_condicao.delete({
      where: { id: BigInt(id) },
    });

    res.json({ message: "Condição comercial deletada com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Condição comercial não encontrada" });
    }
    res.status(500).json({ error: "Erro ao deletar condição comercial" });
  }
});

export default router;
