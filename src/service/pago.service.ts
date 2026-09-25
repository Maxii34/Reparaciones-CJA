import { pagoRepository } from "../repositores/pago.repository";
import { ordenReparacionRepository } from "../repositores/ordenreparacion.repository";
import { usuarioRepository } from "../repositores/usuario.repository";
import { NotFoundError } from "../utils/errors";
import type {
  CreatePagoInput,
  UpdatePagoInput,
} from "../validators/pago.validation";

export type CreatePagoDTO = CreatePagoInput;
export type UpdatePagoDTO = UpdatePagoInput;

export const pagoService = {
  getAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [pagos, total] = await Promise.all([
      pagoRepository.findAll(skip, limit),
      pagoRepository.count(),
    ]);

    return {
      data: pagos,
      meta: { total, page, limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  getById: async (id: number) => {
    const pago = await pagoRepository.findById(id);
    if (!pago) {
      throw new NotFoundError("Pago no encontrado");
    }
    return pago;
  },

  // Pagos de una orden puntual (para mostrar cobros en su ficha)
  getByOrdenId: async (ordenId: number) => {
    const orden = await ordenReparacionRepository.findById(ordenId);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    return pagoRepository.findByOrdenId(ordenId);
  },

  create: async (data: CreatePagoDTO) => {
    const orden = await ordenReparacionRepository.findById(data.ordenId);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }

    if (data.registradoPorId) {
      const usuario = await usuarioRepository.findById(data.registradoPorId);
      if (!usuario) {
        throw new NotFoundError("Usuario no encontrado");
      }
    }

    return pagoRepository.create(data);
  },

  update: async (id: number, data: UpdatePagoDTO) => {
    const pago = await pagoRepository.findById(id);
    if (!pago) {
      throw new NotFoundError("Pago no encontrado");
    }

    return pagoRepository.update(id, data);
  },

  delete: async (id: number) => {
    const pago = await pagoRepository.findById(id);
    if (!pago) {
      throw new NotFoundError("Pago no encontrado");
    }
    return pagoRepository.delete(id);
  },
};
