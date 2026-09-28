import { repuestoRepository } from "../repositores/repuesto.repository";
import { NotFoundError } from "../utils/errors";
import type {
  CreateRepuestoInput,
  UpdateRepuestoInput,
} from "../validators/repuesto.validation";

export type CreateRepuestoDTO = CreateRepuestoInput;
export type UpdateRepuestoDTO = UpdateRepuestoInput;

export const repuestoService = {
  getAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [repuestos, total] = await Promise.all([
      repuestoRepository.findAll(skip, limit),
      repuestoRepository.count(),
    ]);

    return {
      data: repuestos,
      meta: { total, page, limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  getById: async (id: number) => {
    const repuesto = await repuestoRepository.findById(id);
    if (!repuesto) {
      throw new NotFoundError("Repuesto no encontrado");
    }
    return repuesto;
  },

  create: async (data: CreateRepuestoDTO) => {
    return repuestoRepository.create(data);
  },

  update: async (id: number, data: UpdateRepuestoDTO) => {
    const repuesto = await repuestoRepository.findById(id);
    if (!repuesto) {
      throw new NotFoundError("Repuesto no encontrado");
    }

    return repuestoRepository.update(id, data);
  },

  delete: async (id: number) => {
    const repuesto = await repuestoRepository.findById(id);
    if (!repuesto) {
      throw new NotFoundError("Repuesto no encontrado");
    }
    // Si tiene usos cargados, Prisma tira error de foreign key (P2003),
    // capturado por el errorHandler centralizado como 409.
    return repuestoRepository.delete(id);
  },
};
