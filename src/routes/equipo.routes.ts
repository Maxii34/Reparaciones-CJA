import { Router } from "express";
import { equipoController } from "../controllers/equipo.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import { createEquipoSchema, updateEquipoSchema } from "../validators/equipo.validation";

const router = Router();

router.get("/", verificarToken, equipoController.getAll);
router.get("/:id", verificarToken, equipoController.getById);
router.get("/cliente/:clienteId", verificarToken, equipoController.getByClienteId);
router.post("/", verificarToken, validate(createEquipoSchema), equipoController.create);
router.put("/:id", verificarToken, validate(updateEquipoSchema), equipoController.update);
router.delete("/:id", verificarToken, equipoController.delete);

export default router;