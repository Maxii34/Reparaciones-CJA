import { Request, Response } from "express";
import { pagoService } from "../service/pago.service";

export const pagoController = {
  getAll: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const resultado = await pagoService.getAll(page, limit);
    res.status(200).json({
      ok: true,
      mensaje: "Pagos obtenidos correctamente",
      data: resultado.data,
      meta: resultado.meta,
    });
  },

  getById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const pago = await pagoService.getById(id);
    res.status(200).json({ ok: true, mensaje: "Pago obtenido correctamente", data: pago });
  },

  getByOrdenId: async (req: Request, res: Response) => {
    const ordenId = Number(req.params.ordenId);
    const pagos = await pagoService.getByOrdenId(ordenId);
    res.status(200).json({ ok: true, mensaje: "Pagos de la orden obtenidos correctamente", data: pagos });
  },

  create: async (req: Request, res: Response) => {
    const pago = await pagoService.create(req.body);
    res.status(201).json({ ok: true, mensaje: "Pago creado correctamente", data: pago });
  },

  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const pago = await pagoService.update(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Pago actualizado correctamente", data: pago });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await pagoService.delete(id);
    res.status(200).json({ ok: true, mensaje: "Pago eliminado correctamente", data: null });
  },
};
