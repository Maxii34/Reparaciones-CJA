import { Router } from "express";
import { clienteController } from "../controllers/cliente.controller";
import { validate } from "../middlewares/validate";
import { verificarToken } from "../middlewares/auth.middleware";
import {
  createClienteSchema,
  updateClienteSchema,
} from "../validators/cliente.validation";

const router = Router();

router.get("/", verificarToken, clienteController.getAll);
router.get("/:id", verificarToken, clienteController.getById);
router.post("/", verificarToken, validate(createClienteSchema), clienteController.create);
router.put("/:id", verificarToken, validate(updateClienteSchema), clienteController.update);
router.delete("/:id", verificarToken, clienteController.delete);

export default router;
