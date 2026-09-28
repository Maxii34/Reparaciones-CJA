import { equipoRepository } from "../repositores/equipo.repository";
import { clienteRepository } from "../repositores/cliente.repository";
import { NotFoundError } from "../utils/errors";

export interface CreateEquipoDTO {
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie?: string;
  observaciones?: string;
  clienteId: number;
}

export interface UpdateEquipoDTO {
  tipo?: string;
  marca?: string;
  modelo?: string;
  numeroSerie?: string;
  observaciones?: string;
  clienteId?: number;
}

export const equipoService = {
  getAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [equipos, total] = await Promise.all([
      equipoRepository.findAll(skip, limit),
      equipoRepository.count(),
    ]);

    return {
      data: equipos,
      meta: { total, page, limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  getById: async (id: number) => {
    const equipo = await equipoRepository.findById(id);
    if (!equipo) {
      throw new NotFoundError("Equipo no encontrado");
    }
    return equipo;
  },

  // Historial de equipos de un cliente puntual (para mostrar en su ficha)
  getByClienteId: async (clienteId: number) => {
    const cliente = await clienteRepository.findById(clienteId);
    if (!cliente) {
      throw new NotFoundError("Cliente no encontrado");
    }
    return equipoRepository.findByClienteId(clienteId);
  },

  create: async (data: CreateEquipoDTO) => {
    const cliente = await clienteRepository.findById(data.clienteId);
    if (!cliente) {
      throw new NotFoundError("Cliente no encontrado");
    }
    return equipoRepository.create(data);
  },

  update: async (id: number, data: UpdateEquipoDTO) => {
    const equipo = await equipoRepository.findById(id);
    if (!equipo) {
      throw new NotFoundError("Equipo no encontrado");
    }

    if (data.clienteId) {
      const cliente = await clienteRepository.findById(data.clienteId);
      if (!cliente) {
        throw new NotFoundError("Cliente no encontrado");
      }
    }

    return equipoRepository.update(id, data);
  },

  delete: async (id: number) => {
    const equipo = await equipoRepository.findById(id);
    if (!equipo) {
      throw new NotFoundError("Equipo no encontrado");
    }
    // Si tiene órdenes cargadas, Prisma tira error de foreign key (P2003),
    // capturado por el errorHandler (ver nota abajo).
    return equipoRepository.delete(id);
  },
};