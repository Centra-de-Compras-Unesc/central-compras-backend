import express from "express";
import {
  getLojas,
  getLojaById,
  createLoja,
  updateLoja,
  deleteLoja,
} from "../controllers/lojaController.js";

const router = express.Router();

router.get("/", getLojas);
router.get("/:id", getLojaById);
router.post("/", createLoja);
router.put("/:id", updateLoja);
router.delete("/:id", deleteLoja);

export default router;
