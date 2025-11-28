import express from "express";
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updatePedido,
  deletePedido,
  getCondicoesPreview,
} from "../controllers/pedidoController.js";

const router = express.Router();

router.get("/", getPedidos);
router.get("/condicoes-preview/:id_fornecedor/:id_loja", getCondicoesPreview);
router.get("/:id", getPedidoById);
router.post("/", createPedido);
router.put("/:id", updatePedido);
router.patch("/:id", updatePedido);
router.delete("/:id", deletePedido);

export default router;
