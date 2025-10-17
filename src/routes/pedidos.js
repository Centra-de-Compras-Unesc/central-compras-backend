import express from "express";
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
} from "../controllers/pedidoController.js";

const router = express.Router();

router.get("/", getPedidos);
router.get("/:id", getPedidoById);
router.post("/", createPedido);
router.put("/:id", updatePedido);
router.delete("/:id", deletePedido);

export default router;
