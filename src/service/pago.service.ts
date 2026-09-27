import { pagoRepository } from "../repositores/pago.repository";
import { ordenReparacionRepository } from "../repositores/ordenreparacion.repository";
import { usuarioRepository } from "../repositores/usuario.repository";
import { BadRequestError, NotFoundError } from "../utils/errors";
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

    // La orden debe tener precio final para poder cobrar
    if (orden.precioFinal === null || orden.precioFinal === undefined) {
      throw new BadRequestError("La orden aún no tiene precio final cargado");
    }
    const precio = Number(orden.precioFinal);
    const cobrado = (orden.pagos ?? []).reduce((acc, p) => acc + Number(p.monto), 0);
    const saldo = Math.round((precio - cobrado) * 100) / 100;
    if (Math.round((data.monto - saldo) * 100) / 100 > 0) {
      throw new BadRequestError(
        `El monto supera el saldo pendiente ($${saldo.toFixed(2)})`
      );
    }

    const pago = await pagoRepository.create(data);

    // Estado de pago automático según lo cobrado vs el precio final
    const nuevoCobrado = Math.round((cobrado + data.monto) * 100) / 100;
    await ordenReparacionRepository.update(data.ordenId, {
      estadoPago: nuevoCobrado >= precio ? "PAGADO" : "PARCIAL",
    });

    return pago;
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
