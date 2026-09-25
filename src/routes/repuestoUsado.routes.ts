import { Router } from "express";
import { repuestoUsadoController } from "../controllers/repuestoUsado.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import {
  createRepuestoUsadoSchema,
  updateRepuestoUsadoSchema,
} from "../validators/repuestoUsado.validation";

const router = Router();

router.get("/", verificarToken, repuestoUsadoController.getAll);
router.get("/:id", verificarToken, repuestoUsadoController.getById);
router.get("/orden/:ordenId", verificarToken, repuestoUsadoController.getByOrdenId);
router.post("/", verificarToken, validate(createRepuestoUsadoSchema), repuestoUsadoController.create);
router.put("/:id", verificarToken, validate(updateRepuestoUsadoSchema), repuestoUsadoController.update);
router.delete("/:id", verificarToken, repuestoUsadoController.delete);

export default router;
