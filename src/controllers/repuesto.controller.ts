import { Request, Response } from "express";
import { repuestoService } from "../service/repuesto.service";

export const repuestoController = {
  getAll: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const resultado = await repuestoService.getAll(page, limit);
    res.status(200).json({
      ok: true,
      mensaje: "Repuestos obtenidos correctamente",
      data: resultado.data,
      meta: resultado.meta,
    });
  },

  getById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repuesto = await repuestoService.getById(id);
    res.status(200).json({ ok: true, mensaje: "Repuesto obtenido correctamente", data: repuesto });
  },

  create: async (req: Request, res: Response) => {
    const repuesto = await repuestoService.create(req.body);
    res.status(201).json({ ok: true, mensaje: "Repuesto creado correctamente", data: repuesto });
  },

  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const repuesto = await repuestoService.update(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Repuesto actualizado correctamente", data: repuesto });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await repuestoService.delete(id);
    res.status(200).json({ ok: true, mensaje: "Repuesto eliminado correctamente", data: null });
  },
};
