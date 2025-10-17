import express from "express";
import {
  getCampanhaProdutos,
  getCampanhaProdutoById,
  createCampanhaProduto,
  updateCampanhaProduto,
  deleteCampanhaProduto,
} from "../controllers/campanhaProdutoController.js";

const router = express.Router();

router.get("/", getCampanhaProdutos);
router.get("/:id", getCampanhaProdutoById);
router.post("/", createCampanhaProduto);
router.put("/:id", updateCampanhaProduto);
router.delete("/:id", deleteCampanhaProduto);

export default router;
