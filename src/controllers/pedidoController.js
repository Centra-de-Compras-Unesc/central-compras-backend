import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

/**
 * Função utilitária para converter BigInt e Decimal em tipos JSON seguros
 */
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

/**
 * Busca as condições comerciais do fornecedor para o estado da loja
 * @param {number|string} id_fornecedor - ID do fornecedor
 * @param {number|string} id_loja_ou_usuario - ID da loja OU do usuário (se for usuário, busca a loja associada)
 */
async function buscarCondicoesComerciais(id_fornecedor, id_loja_ou_usuario) {
  try {
    let loja = null;

    // Primeiro tenta buscar como loja
    loja = await prisma.tb_loja.findUnique({
      where: { id: BigInt(id_loja_ou_usuario) },
      include: {
        tb_loja_endereco: {
          take: 1,
          orderBy: { id: "desc" },
        },
      },
    });

    // Se não encontrou como loja, tenta buscar loja pelo id_usuario
    if (!loja) {
      loja = await prisma.tb_loja.findFirst({
        where: { id_usuario: BigInt(id_loja_ou_usuario) },
        include: {
          tb_loja_endereco: {
            take: 1,
            orderBy: { id: "desc" },
          },
        },
      });
    }

    if (!loja) return null;

    // Pegar o estado do endereço da loja ou do usuário associado
    let estadoLoja = loja.tb_loja_endereco?.[0]?.estado;

    // Se não tiver endereço, buscar do usuário
    if (!estadoLoja && loja.id_usuario) {
      const usuario = await prisma.tb_sistema_usuario.findUnique({
        where: { id: loja.id_usuario },
      });
      estadoLoja = usuario?.estado;
    }

    if (!estadoLoja) return null;

    // Buscar condições do fornecedor para este estado
    const condicao = await prisma.tb_fornecedor_condicao.findFirst({
      where: {
        id_fornecedor: BigInt(id_fornecedor),
        estado: estadoLoja.toUpperCase(),
      },
    });

    if (!condicao) return null;

    return {
      estado: condicao.estado,
      percentual_cashback: condicao.percentual_cashback
        ? parseFloat(condicao.percentual_cashback)
        : 0,
      prazo_pagamento_dias: condicao.prazo_pagamento_dias || null,
      ajuste_unitario: condicao.ajuste_unitario
        ? parseFloat(condicao.ajuste_unitario)
        : 0,
    };
  } catch (error) {
    return null;
  }
}

export const getPedidos = async (req, res) => {
  try {
    const pedidos = await prisma.tb_pedido.findMany({
      orderBy: { id: "asc" },
      include: {
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
        tb_loja: { select: { id: true, nome_fantasia: true } },
        tb_sistema_usuario: { select: { id: true, nome: true, email: true } },
      },
    });

    res.json(serializeBigInt(pedidos));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao listar pedidos",
      details: error.message,
    });
  }
};

export const getPedidoById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedido = await prisma.tb_pedido.findUnique({
      where: { id },
      include: {
        tb_fornecedor: { select: { id: true, nome_fantasia: true } },
        tb_loja: { select: { id: true, nome_fantasia: true } },
        tb_sistema_usuario: { select: { id: true, nome: true, email: true } },
        tb_pedido_item: true,
      },
    });

    if (!pedido)
      return res.status(404).json({ message: "Pedido não encontrado" });

    res.json(serializeBigInt(pedido));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar pedido",
      details: error.message,
    });
  }
};

export const createPedido = async (req, res) => {
  try {
    const {
      id_usuario,
      id_conta,
      id_fornecedor,
      id_loja,
      status,
      status_norm,
      codigo_rastreamento,
      vl_total_pedido,
      numero_nota_fiscal,
      chave_nota_fiscal,
      canal,
      is_televenda,
      itens, // Array de itens do pedido
    } = req.body;

    // Validação mínima
    if (!id_usuario || !id_conta || !id_fornecedor || !id_loja)
      return res.status(400).json({
        message:
          "Campos obrigatórios ausentes (usuário, conta, fornecedor, loja).",
      });

    // Buscar condições comerciais do fornecedor para o estado da loja
    const condicoes = await buscarCondicoesComerciais(id_fornecedor, id_loja);

    // Criar o pedido
    const novoPedido = await prisma.tb_pedido.create({
      data: {
        id_usuario: Number(id_usuario),
        id_conta: Number(id_conta),
        id_fornecedor: Number(id_fornecedor),
        id_loja: Number(id_loja),
        status: status || "Pendente",
        status_norm: status_norm || "pendente",
        codigo_rastreamento,
        vl_total_pedido: vl_total_pedido ? parseFloat(vl_total_pedido) : null,
        numero_nota_fiscal,
        chave_nota_fiscal,
        canal: canal || "web",
        is_televenda: is_televenda ?? false,
      },
    });

    // Se tiver itens, criar os itens do pedido com as condições aplicadas
    let itensComCondicoes = [];
    if (itens && Array.isArray(itens) && itens.length > 0) {
      for (const item of itens) {
        // Calcular valor unitário com ajuste
        let valorUnitarioFinal = parseFloat(item.valor_unitario) || 0;
        if (condicoes?.ajuste_unitario) {
          valorUnitarioFinal += condicoes.ajuste_unitario;
        }

        // Calcular valor total
        const quantidade = parseFloat(item.quantidade) || 1;
        const valorTotal = valorUnitarioFinal * quantidade;

        // Calcular cashback
        const percentualCashback = condicoes?.percentual_cashback || 0;
        const valorCashback = (valorTotal * percentualCashback) / 100;

        const novoItem = await prisma.tb_pedido_item.create({
          data: {
            id_pedido: novoPedido.id,
            id_conta: Number(id_conta),
            id_fornecedor: Number(id_fornecedor),
            id_loja: Number(id_loja),
            id_usuario: Number(id_usuario),
            id_produto: item.id_produto ? Number(item.id_produto) : null,
            id_campanha: item.id_campanha ? Number(item.id_campanha) : null,
            quantidade: quantidade,
            valor_unitario: valorUnitarioFinal,
            valor_total: valorTotal,
            percentual_cashback_aplicado: percentualCashback,
            valor_cashback_previsto: valorCashback,
            codigo_produto: item.codigo_produto || null,
            codigo_referencia: item.codigo_referencia || null,
            produto: item.produto || null,
          },
        });

        itensComCondicoes.push(novoItem);
      }

      // Atualizar o valor total do pedido
      const valorTotalPedido = itensComCondicoes.reduce(
        (acc, item) => acc + parseFloat(item.valor_total || 0),
        0
      );

      await prisma.tb_pedido.update({
        where: { id: novoPedido.id },
        data: { vl_total_pedido: valorTotalPedido },
      });

      novoPedido.vl_total_pedido = valorTotalPedido;
    }

    res.status(201).json({
      ...serializeBigInt(novoPedido),
      itens: serializeBigInt(itensComCondicoes),
      condicoes_aplicadas: condicoes,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao criar pedido",
      details: error.message,
    });
  }
};

export const updatePedido = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedidoExistente = await prisma.tb_pedido.findUnique({
      where: { id },
    });

    if (!pedidoExistente)
      return res.status(404).json({ message: "Pedido não encontrado" });

    const pedidoAtualizado = await prisma.tb_pedido.update({
      where: { id },
      data: req.body,
    });

    res.json(serializeBigInt(pedidoAtualizado));
  } catch (error) {
    res.status(500).json({
      error: "Erro ao atualizar pedido",
      details: error.message,
    });
  }
};

export const deletePedido = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pedidoExistente = await prisma.tb_pedido.findUnique({
      where: { id },
    });

    if (!pedidoExistente)
      return res.status(404).json({ message: "Pedido não encontrado" });

    await prisma.tb_pedido.delete({ where: { id } });

    res.json({ message: "Pedido removido com sucesso" });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao deletar pedido",
      details: error.message,
    });
  }
};

/**
 * Preview das condições comerciais que serão aplicadas ao pedido
 * GET /pedidos/condicoes-preview/:id_fornecedor/:id_loja
 */
export const getCondicoesPreview = async (req, res) => {
  try {
    const { id_fornecedor, id_loja } = req.params;

    if (!id_fornecedor || !id_loja) {
      return res.status(400).json({
        message: "Parâmetros obrigatórios: id_fornecedor e id_loja",
      });
    }

    const condicoes = await buscarCondicoesComerciais(id_fornecedor, id_loja);

    if (!condicoes) {
      return res.json({
        encontrado: false,
        message:
          "Nenhuma condição comercial específica encontrada para este estado",
        condicoes: {
          estado: null,
          percentual_cashback: 0,
          prazo_pagamento_dias: null,
          ajuste_unitario: 0,
        },
      });
    }

    res.json({
      encontrado: true,
      message: `Condições comerciais encontradas para ${condicoes.estado}`,
      condicoes,
    });
  } catch (error) {
    res.status(500).json({
      error: "Erro ao buscar condições comerciais",
      details: error.message,
    });
  }
};
