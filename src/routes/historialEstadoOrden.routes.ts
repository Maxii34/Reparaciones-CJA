import { Router } from "express";
import { historialEstadoOrdenController } from "../controllers/historialEstadoOrden.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import {
  createHistorialEstadoOrdenSchema,
  updateHistorialEstadoOrdenSchema,
} from "../validators/historialEstadoOrden.validation";

const router = Router();

router.get("/", verificarToken, historialEstadoOrdenController.getAll);
router.get("/:id", verificarToken, historialEstadoOrdenController.getById);
router.get("/orden/:ordenId", verificarToken, historialEstadoOrdenController.getByOrdenId);
router.post("/", verificarToken, validate(createHistorialEstadoOrdenSchema), historialEstadoOrdenController.create);
router.put("/:id", verificarToken, validate(updateHistorialEstadoOrdenSchema), historialEstadoOrdenController.update);
router.delete("/:id", verificarToken, historialEstadoOrdenController.delete);

export default router;
