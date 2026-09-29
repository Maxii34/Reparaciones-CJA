import { Request, Response } from "express";
import { ordenReparacionService } from "../service/ordenReparacion.service";
import { listOrdenesQuerySchema } from "../validators/ordenReparacion.validation";

export const ordenReparacionController = {
  getAll: async (req: Request, res: Response) => {
    // El query se valida con Zod (en Express 5 req.query es solo lectura,
    // por eso no se usa el middleware validate que pisa req.body).
    const parsed = listOrdenesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({
        ok: false,
        mensaje: parsed.error.issues[0]?.message ?? "Filtros inválidos",
      });
      return;
    }
    const { page, limit, ...filtros } = parsed.data;

    const resultado = await ordenReparacionService.getAll(page, limit, filtros);
    res.status(200).json({
      ok: true,
      mensaje: "Órdenes de reparación obtenidas correctamente",
      data: resultado.data,
      meta: resultado.meta,
    });
  },

  getById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const orden = await ordenReparacionService.getById(id);
    res.status(200).json({ ok: true, mensaje: "Orden de reparación obtenida correctamente", data: orden });
  },

  create: async (req: Request, res: Response) => {
    const orden = await ordenReparacionService.create(req.body);
    res.status(201).json({ ok: true, mensaje: "Orden de reparación creada correctamente", data: orden });
  },

  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const orden = await ordenReparacionService.update(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Orden de reparación actualizada correctamente", data: orden });
  },

  faseDiagnostico: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const orden = await ordenReparacionService.faseDiagnostico(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Diagnóstico guardado. La orden pasó a En diagnóstico", data: orden });
  },

  faseAutorizacion: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const orden = await ordenReparacionService.faseAutorizacion(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Autorización registrada correctamente", data: orden });
  },

  faseReparacion: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const orden = await ordenReparacionService.faseReparacion(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Reparación guardada. La orden quedó Lista", data: orden });
  },

  faseCierre: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const orden = await ordenReparacionService.faseCierre(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Orden entregada correctamente", data: orden });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await ordenReparacionService.delete(id);
    res.status(200).json({ ok: true, mensaje: "Orden de reparación eliminada correctamente", data: null });
  },

  subirFotos: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const archivos = (req.files as Express.Multer.File[]) ?? [];
    const fotos = await ordenReparacionService.agregarFotos(id, archivos);
    res.status(201).json({ ok: true, mensaje: "Fotos subidas correctamente", data: fotos });
  },

  eliminarFoto: async (req: Request, res: Response) => {
    const fotoId = Number(req.params.fotoId);
    await ordenReparacionService.eliminarFoto(fotoId);
    res.status(200).json({ ok: true, mensaje: "Foto eliminada correctamente", data: null });
  },
};
