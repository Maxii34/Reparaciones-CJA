import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { ordenReparacionController } from "../controllers/ordenReparacion.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import upload, { MAX_FOTOS_POR_ORDEN } from "../middlewares/upload";
import {
  createOrdenReparacionSchema,
  updateOrdenReparacionSchema,
  faseAutorizacionSchema,
  faseCierreSchema,
  faseDiagnosticoSchema,
  faseReparacionSchema,
} from "../validators/ordenReparacion.validation";

const router = Router();

// Multer pasa sus errores a next(err); sin handler global los convertimos
// aquí a 400 JSON (límite 2MB, tipo inválido, más de MAX archivos, etc.)
const manejarSubidaFotos = (req: Request, res: Response, next: NextFunction) => {
  upload.array("fotos", MAX_FOTOS_POR_ORDEN)(req, res, (err: unknown) => {
    if (err) {
      const mensaje = err instanceof Error ? err.message : "Error al subir imágenes";
      res.status(400).json({ ok: false, mensaje });
      return;
    }
    next();
  });
};

router.get("/", verificarToken, ordenReparacionController.getAll);
router.get("/:id", verificarToken, ordenReparacionController.getById);
router.post("/", verificarToken, validate(createOrdenReparacionSchema), ordenReparacionController.create);
router.put("/:id", verificarToken, validate(updateOrdenReparacionSchema), ordenReparacionController.update);
// Fases del flujo de taller (validan transición de estados)
router.patch("/:id/diagnostico", verificarToken, validate(faseDiagnosticoSchema), ordenReparacionController.faseDiagnostico);
router.patch("/:id/autorizacion", verificarToken, validate(faseAutorizacionSchema), ordenReparacionController.faseAutorizacion);
router.patch("/:id/reparacion", verificarToken, validate(faseReparacionSchema), ordenReparacionController.faseReparacion);
router.patch("/:id/cierre", verificarToken, validate(faseCierreSchema), ordenReparacionController.faseCierre);
// Fotos de evidencia: 1 a MAX_FOTOS_POR_ORDEN por request (campo form-data "fotos")
router.post("/:id/fotos", verificarToken, manejarSubidaFotos, ordenReparacionController.subirFotos);
router.delete("/fotos/:fotoId", verificarToken, ordenReparacionController.eliminarFoto);
router.delete("/:id", verificarToken, ordenReparacionController.delete);

export default router;
