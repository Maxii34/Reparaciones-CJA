import { Request, Response } from "express";
import { historialEstadoOrdenService } from "../service/historialEstadoOrden.service";

export const historialEstadoOrdenController = {
  getAll: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const resultado = await historialEstadoOrdenService.getAll(page, limit);
    res.status(200).json({
      ok: true,
      mensaje: "Historial obtenido correctamente",
      data: resultado.data,
      meta: resultado.meta,
    });
  },

  getById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const registro = await historialEstadoOrdenService.getById(id);
    res.status(200).json({ ok: true, mensaje: "Historial obtenido correctamente", data: registro });
  },

  getByOrdenId: async (req: Request, res: Response) => {
    const ordenId = Number(req.params.ordenId);
    const historial = await historialEstadoOrdenService.getByOrdenId(ordenId);
    res.status(200).json({ ok: true, mensaje: "Historial de la orden obtenido correctamente", data: historial });
  },

  create: async (req: Request, res: Response) => {
    const registro = await historialEstadoOrdenService.create(req.body);
    res.status(201).json({ ok: true, mensaje: "Historial creado correctamente", data: registro });
  },

  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const registro = await historialEstadoOrdenService.update(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Historial actualizado correctamente", data: registro });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await historialEstadoOrdenService.delete(id);
    res.status(200).json({ ok: true, mensaje: "Historial eliminado correctamente", data: null });
  },
};
