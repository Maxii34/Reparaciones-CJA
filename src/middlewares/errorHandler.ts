import type { Request, Response, NextFunction } from "express";
import { MulterError } from "multer";
import { AppError } from "../utils/errors";

// Handler global: convierte AppError / Prisma / Multer en JSON con su status.
// Debe registrarse en app.ts DESPUÉS de todas las rutas.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (res.headersSent) {
    throw err;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ ok: false, mensaje: err.message });
    return;
  }

  if (err instanceof MulterError) {
    res.status(400).json({ ok: false, mensaje: err.message });
    return;
  }

  const prismaCode = (err as { code?: string })?.code;
  if (prismaCode === "P2002") {
    res.status(409).json({ ok: false, mensaje: "Ya existe un registro con esos datos únicos" });
    return;
  }
  if (prismaCode === "P2003") {
    res.status(409).json({ ok: false, mensaje: "No se puede eliminar: tiene registros relacionados" });
    return;
  }
  if (prismaCode === "P2025") {
    res.status(404).json({ ok: false, mensaje: "Registro no encontrado" });
    return;
  }

  // eslint-disable-next-line no-console
  console.error(err);
  res.status(500).json({ ok: false, mensaje: "Error interno del servidor" });
};
