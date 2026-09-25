import { Router } from "express";
import { ordenReparacionController } from "../controllers/ordenReparacion.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import {
  createOrdenReparacionSchema,
  updateOrdenReparacionSchema,
} from "../validators/ordenReparacion.validation";

const router = Router();

router.get("/", verificarToken, ordenReparacionController.getAll);
router.get("/:id", verificarToken, ordenReparacionController.getById);
router.post("/", verificarToken, validate(createOrdenReparacionSchema), ordenReparacionController.create);
router.put("/:id", verificarToken, validate(updateOrdenReparacionSchema), ordenReparacionController.update);
router.delete("/:id", verificarToken, ordenReparacionController.delete);

export default router;
