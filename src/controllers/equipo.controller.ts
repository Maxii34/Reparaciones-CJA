import { Request, Response } from "express";
import { equipoService } from "../service/equipo.service";

export const equipoController = {
  getAll: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const resultado = await equipoService.getAll(page, limit);
    res.status(200).json({
      ok: true,
      mensaje: "Equipos obtenidos correctamente",
      data: resultado.data,
      meta: resultado.meta,
    });
  },

  getById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const equipo = await equipoService.getById(id);
    res.status(200).json({ ok: true, mensaje: "Equipo obtenido correctamente", data: equipo });
  },

  getByClienteId: async (req: Request, res: Response) => {
    const clienteId = Number(req.params.clienteId);
    const equipos = await equipoService.getByClienteId(clienteId);
    res.status(200).json({ ok: true, mensaje: "Equipos del cliente obtenidos correctamente", data: equipos });
  },

  create: async (req: Request, res: Response) => {
    const equipo = await equipoService.create(req.body);
    res.status(201).json({ ok: true, mensaje: "Equipo creado correctamente", data: equipo });
  },

  update: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const equipo = await equipoService.update(id, req.body);
    res.status(200).json({ ok: true, mensaje: "Equipo actualizado correctamente", data: equipo });
  },

  delete: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await equipoService.delete(id);
    res.status(200).json({ ok: true, mensaje: "Equipo eliminado correctamente", data: null });
  },
};