import { Router } from "express";
import { ordenReparacionController } from "../controllers/ordenReparacion.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import {
  createOrdenReparacionSchema,
  updateOrdenReparacionSchema,
  faseAutorizacionSchema,
  faseCierreSchema,
  faseDiagnosticoSchema,
  faseReparacionSchema,
} from "../validators/ordenReparacion.validation";

const router = Router();

router.get("/", verificarToken, ordenReparacionController.getAll);
router.get("/:id", verificarToken, ordenReparacionController.getById);
router.post("/", verificarToken, validate(createOrdenReparacionSchema), ordenReparacionController.create);
router.put("/:id", verificarToken, validate(updateOrdenReparacionSchema), ordenReparacionController.update);
// Fases del flujo de taller (validan transición de estados)
router.patch("/:id/diagnostico", verificarToken, validate(faseDiagnosticoSchema), ordenReparacionController.faseDiagnostico);
router.patch("/:id/autorizacion", verificarToken, validate(faseAutorizacionSchema), ordenReparacionController.faseAutorizacion);
router.patch("/:id/reparacion", verificarToken, validate(faseReparacionSchema), ordenReparacionController.faseReparacion);
router.patch("/:id/cierre", verificarToken, validate(faseCierreSchema), ordenReparacionController.faseCierre);
router.delete("/:id", verificarToken, ordenReparacionController.delete);

export default router;
