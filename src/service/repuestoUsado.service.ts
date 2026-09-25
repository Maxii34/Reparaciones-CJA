import { repuestoUsadoRepository } from "../repositores/repuestoUsado.repository";
import { ordenReparacionRepository } from "../repositores/ordenreparacion.repository";
import { repuestoRepository } from "../repositores/repuesto.repository";
import { NotFoundError } from "../utils/errors";
import type {
  CreateRepuestoUsadoInput,
  UpdateRepuestoUsadoInput,
} from "../validators/repuestoUsado.validation";

export type CreateRepuestoUsadoDTO = CreateRepuestoUsadoInput;
export type UpdateRepuestoUsadoDTO = UpdateRepuestoUsadoInput;

export const repuestoUsadoService = {
  getAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [detalles, total] = await Promise.all([
      repuestoUsadoRepository.findAll(skip, limit),
      repuestoUsadoRepository.count(),
    ]);

    return {
      data: detalles,
      meta: { total, page, limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  getById: async (id: number) => {
    const detalle = await repuestoUsadoRepository.findById(id);
    if (!detalle) {
      throw new NotFoundError("Repuesto usado no encontrado");
    }
    return detalle;
  },

  // Detalle de una orden puntual (para mostrar desglose en su ficha)
  getByOrdenId: async (ordenId: number) => {
    const orden = await ordenReparacionRepository.findById(ordenId);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    return repuestoUsadoRepository.findByOrdenId(ordenId);
  },

  create: async (data: CreateRepuestoUsadoDTO) => {
    const orden = await ordenReparacionRepository.findById(data.ordenId);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }

    const repuesto = await repuestoRepository.findById(data.repuestoId);
    if (!repuesto) {
      throw new NotFoundError("Repuesto no encontrado");
    }

    return repuestoUsadoRepository.create(data);
  },

  update: async (id: number, data: UpdateRepuestoUsadoDTO) => {
    const detalle = await repuestoUsadoRepository.findById(id);
    if (!detalle) {
      throw new NotFoundError("Repuesto usado no encontrado");
    }

    return repuestoUsadoRepository.update(id, data);
  },

  delete: async (id: number) => {
    const detalle = await repuestoUsadoRepository.findById(id);
    if (!detalle) {
      throw new NotFoundError("Repuesto usado no encontrado");
    }
    return repuestoUsadoRepository.delete(id);
  },
};
