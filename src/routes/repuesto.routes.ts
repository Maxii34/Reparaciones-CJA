import { Router } from "express";
import { repuestoController } from "../controllers/repuesto.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import {
  createRepuestoSchema,
  updateRepuestoSchema,
} from "../validators/repuesto.validation";

const router = Router();

router.get("/", verificarToken, repuestoController.getAll);
router.get("/:id", verificarToken, repuestoController.getById);
router.post("/", verificarToken, validate(createRepuestoSchema), repuestoController.create);
router.put("/:id", verificarToken, validate(updateRepuestoSchema), repuestoController.update);
router.delete("/:id", verificarToken, repuestoController.delete);

export default router;
