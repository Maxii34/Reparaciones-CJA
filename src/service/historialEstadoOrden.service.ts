import { historialEstadoOrdenRepository } from "../repositores/historialEstadoOrden.repository";
import { ordenReparacionRepository } from "../repositores/ordenreparacion.repository";
import { usuarioRepository } from "../repositores/usuario.repository";
import { NotFoundError } from "../utils/errors";
import type {
  CreateHistorialEstadoOrdenInput,
  UpdateHistorialEstadoOrdenInput,
} from "../validators/historialEstadoOrden.validation";

export type CreateHistorialEstadoOrdenDTO = CreateHistorialEstadoOrdenInput;
export type UpdateHistorialEstadoOrdenDTO = UpdateHistorialEstadoOrdenInput;

export const historialEstadoOrdenService = {
  getAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [historial, total] = await Promise.all([
      historialEstadoOrdenRepository.findAll(skip, limit),
      historialEstadoOrdenRepository.count(),
    ]);

    return {
      data: historial,
      meta: { total, page, limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  getById: async (id: number) => {
    const registro = await historialEstadoOrdenRepository.findById(id);
    if (!registro) {
      throw new NotFoundError("Historial no encontrado");
    }
    return registro;
  },

  // Historial de una orden puntual (para mostrar trazabilidad en su ficha)
  getByOrdenId: async (ordenId: number) => {
    const orden = await ordenReparacionRepository.findById(ordenId);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    return historialEstadoOrdenRepository.findByOrdenId(ordenId);
  },

  create: async (data: CreateHistorialEstadoOrdenDTO) => {
    const orden = await ordenReparacionRepository.findById(data.ordenId);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }

    if (data.usuarioId) {
      const usuario = await usuarioRepository.findById(data.usuarioId);
      if (!usuario) {
        throw new NotFoundError("Usuario no encontrado");
      }
    }

    return historialEstadoOrdenRepository.create(data);
  },

  update: async (id: number, data: UpdateHistorialEstadoOrdenDTO) => {
    const registro = await historialEstadoOrdenRepository.findById(id);
    if (!registro) {
      throw new NotFoundError("Historial no encontrado");
    }

    return historialEstadoOrdenRepository.update(id, data);
  },

  delete: async (id: number) => {
    const registro = await historialEstadoOrdenRepository.findById(id);
    if (!registro) {
      throw new NotFoundError("Historial no encontrado");
    }
    return historialEstadoOrdenRepository.delete(id);
  },
};
