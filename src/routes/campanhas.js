import express from "express";
import {
  getCampanhas,
  getCampanhaById,
  createCampanha,
  updateCampanha,
  deleteCampanha,
} from "../controllers/campanhaController.js";

const router = express.Router();

router.get("/", getCampanhas);
router.get("/:id", getCampanhaById);
router.post("/", createCampanha);
router.put("/:id", updateCampanha);
router.delete("/:id", deleteCampanha);

export default router;
