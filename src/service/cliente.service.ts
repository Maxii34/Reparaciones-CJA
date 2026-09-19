import { clienteRepository } from "../repositores/cliente.repository";
import { NotFoundError, ConflictError } from "../utils/errors";

export interface CrearClienteDTO {
  nombre: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
  whatsapp?: string;
  email?: string;
  direccion?: string;
}

export interface ActualizarClienteDTO {
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
  whatsapp?: string;
  email?: string;
  direccion?: string;
}

export const clienteService = {
  getAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [clientes, total] = await Promise.all([
      clienteRepository.findAll(skip, limit),
      clienteRepository.count(),
    ]);
    return {
      data: clientes,
      meta: {
        total,
        page,
        limit,
        totalPaginas: Math.ceil(total / limit),
      },
    };
  },

  getById: async (id: number) => {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundError("Cliente no encontrado");
    }
    return cliente;
  },

  create: async (data: CrearClienteDTO) => {
    if (data.dni) {
      const existente = await clienteRepository.findByDni(data.dni);
      if (existente) {
        throw new ConflictError("Ya existe un cliente con ese dni");
      }
    }

    if (data.email) {
      const existente = await clienteRepository.findByEmail(data.email);
      if (existente) {
        throw new ConflictError("Ya existe un cliente con ese email");
      }
    }

    return clienteRepository.create(data);
  },

  update: async (id: number, data: ActualizarClienteDTO) => {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundError("Cliente no encontrado");
    }

    if (data.dni && data.dni !== cliente.dni) {
      const existente = await clienteRepository.findByDni(data.dni);
      if (existente && existente.id !== id) {
        throw new ConflictError("Ya existe un cliente con ese dni");
      }
    }

    if (data.email && data.email !== cliente.email) {
      const existente = await clienteRepository.findByEmail(data.email);
      if (existente && existente.id !== id) {
        throw new ConflictError("Ya existe un cliente con ese email");
      }
    }

    return clienteRepository.update(id, data);
  },

  delete: async (id: number) => {
    const cliente = await clienteRepository.findById(id);
    if (!cliente) {
      throw new NotFoundError("Cliente no encontrado");
    }

    return clienteRepository.delete(id);
  },
};
