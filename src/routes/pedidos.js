import express from "express";
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
} from "../controllers/pedidoController.js";

const router = express.Router();

// Lista todos os pedidos
router.get("/", getPedidos);

// Busca um pedido específico pelo ID
router.get("/:id", getPedidoById);

// Cria um novo pedido
router.post("/", createPedido);

// Atualiza um pedido (PUT - atualização completa)
router.put("/:id", updatePedido);

// 🔥 Novo: atualiza parcialmente um pedido (PATCH - ex: apenas status)
// Isso permite o cancelamento via PATCH /pedidos/:id com body { status: "Cancelado" }
router.patch("/:id", updatePedido);

// Remove um pedido
router.delete("/:id", deletePedido);

export default router;
