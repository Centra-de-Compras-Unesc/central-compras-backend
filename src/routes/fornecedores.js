import express from "express";
import {
  getFornecedores,
  getFornecedorById,
  createFornecedor,
  updateFornecedor,
  deleteFornecedor,
} from "../controllers/fornecedorController.js";

const router = express.Router();

router.get("/", getFornecedores);
router.get("/:id", getFornecedorById);
router.post("/", createFornecedor);
router.put("/:id", updateFornecedor);
router.delete("/:id", deleteFornecedor);

export default router;
