import { ordenReparacionRepository } from "../repositores/ordenreparacion.repository";
import { fotoOrdenRepository } from "../repositores/fotoOrden.repository";
import { subirImagenCloudinary, eliminarImagenCloudinary } from "../utils/subirImagenCloudinary";
import { equipoRepository } from "../repositores/equipo.repository";
import { usuarioRepository } from "../repositores/usuario.repository";
import { historialEstadoOrdenRepository } from "../repositores/historialEstadoOrden.repository";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";
import type {
  CreateOrdenReparacionInput,
  UpdateOrdenReparacionInput,
  FaseAutorizacionInput,
  FaseCierreInput,
  FaseDiagnosticoInput,
  FaseReparacionInput,
} from "../validators/ordenReparacion.validation";

// Máquina de estados del taller: a qué estado se puede llegar desde cada uno
const TRANSICIONES: Record<string, string[]> = {
  EN_DIAGNOSTICO: ["RECIBIDO", "EN_DIAGNOSTICO"],
  EN_REPARACION: ["EN_DIAGNOSTICO", "ESPERANDO_REPUESTO"],
  ESPERANDO_REPUESTO: ["EN_DIAGNOSTICO", "ESPERANDO_REPUESTO"],
  LISTO: ["EN_REPARACION"],
  ENTREGADO: ["LISTO", "ENTREGADO"],
};

function exigirTransicion(actual: string, destino: string) {
  if (!TRANSICIONES[destino]?.includes(actual)) {
    throw new ConflictError(`No se puede pasar de ${actual} a ${destino}`);
  }
}

// Re-exportamos los tipos de Zod como DTOs para mantener
// una sola fuente de verdad (igual que equipo/cliente usan interfaces locales).
export type CreateOrdenReparacionDTO = CreateOrdenReparacionInput;
export type UpdateOrdenReparacionDTO = UpdateOrdenReparacionInput;

const generarNumeroOrden = async (): Promise<string> => {
  // Correlativo simple tipo OR-0001 basado en el conteo actual.
  // Si hay colisión por borrados previos, Prisma tira P2002 y lo
  // captura el errorHandler centralizado como 409.
  const total = await ordenReparacionRepository.count();
  const siguiente = total + 1;
  return `OR-${String(siguiente).padStart(4, "0")}`;
};

export const ordenReparacionService = {
  getAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;

    const [ordenes, total] = await Promise.all([
      ordenReparacionRepository.findAll(skip, limit),
      ordenReparacionRepository.count(),
    ]);

    return {
      data: ordenes,
      meta: { total, page, limit, totalPaginas: Math.ceil(total / limit) },
    };
  },

  getById: async (id: number) => {
    const orden = await ordenReparacionRepository.findById(id);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    return orden;
  },

  create: async (data: CreateOrdenReparacionDTO) => {
    const equipo = await equipoRepository.findById(data.equipoId);
    if (!equipo) {
      throw new NotFoundError("Equipo no encontrado");
    }

    if (data.creadoPorId) {
      const creadoPor = await usuarioRepository.findById(data.creadoPorId);
      if (!creadoPor) {
        throw new NotFoundError("Usuario creador no encontrado");
      }
    }

    if (data.tecnicoId) {
      const tecnico = await usuarioRepository.findById(data.tecnicoId);
      if (!tecnico) {
        throw new NotFoundError("Técnico no encontrado");
      }
    }

    // Garantía: debe referenciar una orden de origen válida y vigente
    if (data.esGarantia) {
      if (!data.ordenOrigenId) {
        throw new BadRequestError("El ingreso por garantía debe referenciar la orden de origen");
      }
      const origen = await ordenReparacionRepository.findById(data.ordenOrigenId);
      if (!origen || origen.equipoId !== data.equipoId) {
        throw new BadRequestError("La orden de origen no corresponde a este equipo");
      }
      if (origen.estado !== "ENTREGADO") {
        throw new BadRequestError(`La orden ${origen.numero} aún no fue entregada`);
      }
      if (!origen.fechaEntrega) {
        throw new BadRequestError(`La orden ${origen.numero} no tiene fecha de entrega registrada`);
      }
      const limite = new Date(origen.fechaEntrega);
      limite.setDate(limite.getDate() + (origen.garantiaDias ?? 90));
      if (limite.getTime() < Date.now()) {
        throw new BadRequestError(`La garantía de la orden ${origen.numero} ya venció`);
      }
    } else if (data.ordenOrigenId) {
      throw new BadRequestError("La orden de origen solo aplica a ingresos por garantía");
    }

    // Enforcement: un equipo no puede tener dos órdenes abiertas a la vez
    const abierta = await ordenReparacionRepository.findAbiertaPorEquipo(data.equipoId);
    if (abierta) {
      throw new ConflictError(
        `El equipo ya tiene la orden ${abierta.numero} abierta`
      );
    }

    const numero = data.numero ?? (await generarNumeroOrden());

    // El repository tipa como Prisma.OrdenReparacionCreateInput (versión con
    // relaciones), por eso mapeamos los FK a connect en lugar de pasarlos directos.
    const { equipoId, creadoPorId, tecnicoId, ...resto } = data;

    const creada = await ordenReparacionRepository.create({
      ...resto,
      numero,
      equipo: { connect: { id: equipoId } },
      ...(creadoPorId ? { creadoPor: { connect: { id: creadoPorId } } } : {}),
      ...(tecnicoId ? { tecnico: { connect: { id: tecnicoId } } } : {}),
    });

    // Primera entrada de trazabilidad: la recepción inicial
    await historialEstadoOrdenRepository.create({
      ordenId: creada.id,
      estado: creada.estado,
      usuarioId: tecnicoId ?? creadoPorId ?? undefined,
    });

    return creada;
  },

  update: async (id: number, data: UpdateOrdenReparacionDTO) => {
    const orden = await ordenReparacionRepository.findById(id);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }

    const { equipoId, creadoPorId, tecnicoId, ...resto } = data;

    if (equipoId !== undefined) {
      const equipo = await equipoRepository.findById(equipoId);
      if (!equipo) {
        throw new NotFoundError("Equipo no encontrado");
      }
    }

    if (creadoPorId !== undefined && creadoPorId !== null) {
      const creadoPor = await usuarioRepository.findById(creadoPorId);
      if (!creadoPor) {
        throw new NotFoundError("Usuario creador no encontrado");
      }
    }

    if (tecnicoId !== undefined && tecnicoId !== null) {
      const tecnico = await usuarioRepository.findById(tecnicoId);
      if (!tecnico) {
        throw new NotFoundError("Técnico no encontrado");
      }
    }

    const actualizada = await ordenReparacionRepository.update(id, {
      ...resto,
      ...(equipoId !== undefined ? { equipo: { connect: { id: equipoId } } } : {}),
      ...(creadoPorId !== undefined
        ? creadoPorId === null
          ? { creadoPor: { disconnect: true } }
          : { creadoPor: { connect: { id: creadoPorId } } }
        : {}),
      ...(tecnicoId !== undefined
        ? tecnicoId === null
          ? { tecnico: { disconnect: true } }
          : { tecnico: { connect: { id: tecnicoId } } }
        : {}),
    });

    // Trazabilidad automática: si cambió el estado, se registra en el historial
    if (data.estado !== undefined && data.estado !== orden.estado) {
      await historialEstadoOrdenRepository.create({
        ordenId: id,
        estado: data.estado,
        usuarioId: tecnicoId ?? undefined,
      });
    }

    return actualizada;
  },

  // Fase 1: diagnóstico -> EN_DIAGNOSTICO
  faseDiagnostico: async (id: number, data: FaseDiagnosticoInput) => {
    const orden = await ordenReparacionRepository.findById(id);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    exigirTransicion(orden.estado, "EN_DIAGNOSTICO");
    const tecnico = await usuarioRepository.findById(data.tecnicoId);
    if (!tecnico) {
      throw new NotFoundError("Técnico no encontrado");
    }
    const actualizada = await ordenReparacionRepository.update(id, {
      diagnostico: data.diagnostico,
      pruebasRealizadas: data.pruebasRealizadas ?? undefined,
      tecnico: { connect: { id: data.tecnicoId } },
      estado: "EN_DIAGNOSTICO",
    });
    await historialEstadoOrdenRepository.create({
      ordenId: id,
      estado: "EN_DIAGNOSTICO",
      usuarioId: data.tecnicoId,
    });
    return actualizada;
  },

  // Fase 2: autorización del cliente -> EN_REPARACION o ESPERANDO_REPUESTO
  faseAutorizacion: async (id: number, data: FaseAutorizacionInput) => {
    const orden = await ordenReparacionRepository.findById(id);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    const destino = data.decision === "AUTORIZADO" ? "EN_REPARACION" : "ESPERANDO_REPUESTO";
    exigirTransicion(orden.estado, destino);
    const actualizada = await ordenReparacionRepository.update(id, {
      estado: destino,
      ...(data.decision === "AUTORIZADO"
        ? { autorizadoCliente: true, fechaAutorizacion: new Date() }
        : {}),
    });
    await historialEstadoOrdenRepository.create({
      ordenId: id,
      estado: destino,
      usuarioId: orden.tecnicoId ?? undefined,
    });
    return actualizada;
  },

  // Fase 3: reparación -> LISTO
  faseReparacion: async (id: number, data: FaseReparacionInput) => {
    const orden = await ordenReparacionRepository.findById(id);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    exigirTransicion(orden.estado, "LISTO");
    const actualizada = await ordenReparacionRepository.update(id, {
      reparacionRealizada: data.reparacionRealizada,
      ...(data.manoDeObra !== undefined ? { manoDeObra: data.manoDeObra } : {}),
      ...(data.recomendaciones !== undefined ? { recomendaciones: data.recomendaciones } : {}),
      estado: "LISTO",
    });
    await historialEstadoOrdenRepository.create({
      ordenId: id,
      estado: "LISTO",
      usuarioId: orden.tecnicoId ?? undefined,
    });
    return actualizada;
  },

  // Fase 4: cierre y entrega -> ENTREGADO
  faseCierre: async (id: number, data: FaseCierreInput) => {
    const orden = await ordenReparacionRepository.findById(id);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    exigirTransicion(orden.estado, "ENTREGADO");
    const actualizada = await ordenReparacionRepository.update(id, {
      precioFinal: data.precioFinal,
      conformidadEntregaCliente: data.conformidadEntregaCliente ?? true,
      fechaEntrega: data.fechaEntrega ?? new Date(),
      estado: "ENTREGADO",
    });
    await historialEstadoOrdenRepository.create({
      ordenId: id,
      estado: "ENTREGADO",
      usuarioId: orden.tecnicoId ?? undefined,
    });
    return actualizada;
  },

  delete: async (id: number) => {
    const orden = await ordenReparacionRepository.findById(id);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    // Si la orden tiene pagos / repuestos / historial, Prisma tira error de
    // FK (P2003 por Restrict o borrado en cascada según el schema),
    // capturado por el errorHandler centralizado.
    return ordenReparacionRepository.delete(id);
  },

  // Fotos de evidencia (1 a N por request, Cloudinary firmado)
  agregarFotos: async (id: number, archivos: Express.Multer.File[]) => {
    const orden = await ordenReparacionRepository.findById(id);
    if (!orden) {
      throw new NotFoundError("Orden de reparación no encontrada");
    }
    if (!archivos || archivos.length === 0) {
      throw new BadRequestError("Debes enviar al menos una imagen en el campo 'fotos'");
    }

    const subidas = await Promise.all(archivos.map((a) => subirImagenCloudinary(a.buffer)));
    const fotos = await Promise.all(
      subidas.map((r) => fotoOrdenRepository.create(id, r.secure_url, r.public_id)),
    );
    return fotos;
  },

  eliminarFoto: async (fotoId: number) => {
    const foto = await fotoOrdenRepository.findById(fotoId);
    if (!foto) {
      throw new NotFoundError("Foto no encontrada");
    }
    await fotoOrdenRepository.delete(fotoId);
    // Borrado best-effort en Cloudinary: si falla, la fila ya se eliminó
    try {
      await eliminarImagenCloudinary(foto.publicId);
    } catch {
      // no bloquea la respuesta
    }
    return foto;
  },
};
