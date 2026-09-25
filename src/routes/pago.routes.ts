import { Router } from "express";
import { pagoController } from "../controllers/pago.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import {
  createPagoSchema,
  updatePagoSchema,
} from "../validators/pago.validation";

const router = Router();

router.get("/", verificarToken, pagoController.getAll);
router.get("/:id", verificarToken, pagoController.getById);
router.get("/orden/:ordenId", verificarToken, pagoController.getByOrdenId);
router.post("/", verificarToken, validate(createPagoSchema), pagoController.create);
router.put("/:id", verificarToken, validate(updatePagoSchema), pagoController.update);
router.delete("/:id", verificarToken, pagoController.delete);

export default router;
