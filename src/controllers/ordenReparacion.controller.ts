import { Request, Response } from "express";
import { ordenReparacionService } from "../service/ordenReparacion.service";

export const ordenReparacionController = {
  getAll: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const resultado = await ordenReparacionService.getAll(page, limit);
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
};
