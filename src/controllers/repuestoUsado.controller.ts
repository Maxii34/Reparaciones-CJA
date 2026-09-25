import { Request, Response } from "express";
import { repuestoUsadoService } from "../service/repuestoUsado.service";

export const repuestoUsadoController = {
  getAll: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const resultado = await repuestoUsadoService.getAll(page, limit);
    res.status(200).json({
      ok: true,
      mensaje: "Repuestos usados obtenidos correctamente",
      data: resultado.data,
      meta: resultado.meta,
    });
  },

  getById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const detalle = await repuestoUsadoService.getById(id);
    res.status(200).json({ ok: true, mensaje: "Repuesto usado obtenido correctamente", data: detalle });
  },

  getByOrdenId: async (req: Request, res: Response) => {
    const ordenId = Number(req.params.ordenId);
    const detalles = await repuestoUsadoService.getByOrdenId(ordenId);
    res.status(200).json({ ok: true, mensaje: "Repuestos de la orden obtenidos correctamente", data: detalles });
  },

  create: async (req: Request, res: Response) => {
    const detalle = await repuestoUsadoService.create(req.body);
    res.status(201).json({ ok: true, mensaje: "Repuesto usado creado correctamente", data: detalle });
  },

  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const detalle = await repuestoUsadoService.update(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Repuesto usado actualizado correctamente", data: detalle });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await repuestoUsadoService.delete(id);
    res.status(200).json({ ok: true, mensaje: "Repuesto usado eliminado correctamente", data: null });
  },
};
