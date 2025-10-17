import express from "express";
import {
  getPedidoItens,
  getPedidoItemById,
  createPedidoItem,
  updatePedidoItem,
  deletePedidoItem,
} from "../controllers/pedidoItemController.js";

const router = express.Router();

router.get("/", getPedidoItens);
router.get("/:id", getPedidoItemById);
router.post("/", createPedidoItem);
router.put("/:id", updatePedidoItem);
router.delete("/:id", deletePedidoItem);

export default router;
