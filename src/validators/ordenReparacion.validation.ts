import { z } from "zod";

export const estadoOrdenEnum = z.enum([
  "RECIBIDO",
  "EN_DIAGNOSTICO",
  "ESPERANDO_REPUESTO",
  "EN_REPARACION",
  "LISTO",
  "ENTREGADO",
  "CANCELADO",
]);

export const estadoPagoEnum = z.enum(["PENDIENTE", "PARCIAL", "PAGADO"]);

export const condicionFisicaEnum = z.enum([
  "BUEN_ESTADO",
  "GOLPES_ABOLLADURAS",
  "RAYONES_SUPERFICIALES",
  "PIEZAS_ROTAS_FALTANTES",
]);

const decimalDinero = z
  .number("Debe ser un número")
  .nonnegative("No puede ser negativo")
  .max(99999999.99, "Monto máximo excedido")
  .finite();

export const createOrdenReparacionSchema = z.object({
  // Si el backend lo autogenera (OR-0001), puede omitirse
  numero: z
    .string()
    .min(1)
    .max(20, "Máximo 20 caracteres")
    .trim()
    .optional(),
  equipoId: z.number().int("equipoId debe ser entero").positive("equipoId debe ser positivo"),
  fechaIngreso: z.coerce.date().optional(),
  fallaReportada: z
    .string()
    .min(1, "La falla reportada es requerida")
    .max(2000, "Máximo 2000 caracteres")
    .trim(),
  accesorios: z.string().max(1000, "Máximo 1000 caracteres").trim().optional().nullable(),

  condicionFisica: z
    .array(condicionFisicaEnum, "Condición física inválida")
    .min(1, "Debe indicar al menos una condición física"),
  detalleCondicionFisica: z.string().max(1000).trim().optional().nullable(),

  diagnostico: z.string().max(2000).trim().optional().nullable(),
  pruebasRealizadas: z.string().max(2000).trim().optional().nullable(),
  recomendaciones: z.string().max(2000).trim().optional().nullable(),

  costoEstimado: decimalDinero.optional().nullable(),
  autorizadoCliente: z.boolean().optional().default(false),
  fechaAutorizacion: z.coerce.date().optional().nullable(),

  reparacionRealizada: z.string().max(2000).trim().optional().nullable(),
  manoDeObra: decimalDinero.optional().default(0),

  precioFinal: decimalDinero.optional().nullable(),
  estadoPago: estadoPagoEnum.optional().default("PENDIENTE"),

  fechaEntrega: z.coerce.date().optional().nullable(),
  garantiaDias: z.number().int().min(0).max(3650).optional().default(90),
  conformidadEntregaCliente: z.boolean().optional().default(false),

  firmaClienteRecepcion: z.boolean().optional().default(false),
  firmaTecnicoRecepcion: z.boolean().optional().default(false),

  estado: estadoOrdenEnum.optional().default("RECIBIDO"),

  creadoPorId: z.number().int().positive().optional().nullable(),
  tecnicoId: z.number().int().positive().optional().nullable(),
});

export const updateOrdenReparacionSchema = z.object({
  numero: z.string().min(1).max(20).trim().optional(),
  equipoId: z.number().int().positive().optional(),
  fechaIngreso: z.coerce.date().optional(),
  fallaReportada: z.string().min(1).max(2000).trim().optional(),
  accesorios: z.string().max(1000).trim().optional().nullable(),

  condicionFisica: z.array(condicionFisicaEnum).min(1).optional(),
  detalleCondicionFisica: z.string().max(1000).trim().optional().nullable(),

  diagnostico: z.string().max(2000).trim().optional().nullable(),
  pruebasRealizadas: z.string().max(2000).trim().optional().nullable(),
  recomendaciones: z.string().max(2000).trim().optional().nullable(),

  costoEstimado: decimalDinero.optional().nullable(),
  autorizadoCliente: z.boolean().optional(),
  fechaAutorizacion: z.coerce.date().optional().nullable(),

  reparacionRealizada: z.string().max(2000).trim().optional().nullable(),
  manoDeObra: decimalDinero.optional(),

  precioFinal: decimalDinero.optional().nullable(),
  estadoPago: estadoPagoEnum.optional(),

  fechaEntrega: z.coerce.date().optional().nullable(),
  garantiaDias: z.number().int().min(0).max(3650).optional(),
  conformidadEntregaCliente: z.boolean().optional(),

  firmaClienteRecepcion: z.boolean().optional(),
  firmaTecnicoRecepcion: z.boolean().optional(),

  estado: estadoOrdenEnum.optional(),

  creadoPorId: z.number().int().positive().optional().nullable(),
  tecnicoId: z.number().int().positive().optional().nullable(),
});

export const changeEstadoOrdenSchema = z.object({
  estado: estadoOrdenEnum,
  comentario: z.string().max(1000).trim().optional().nullable(),
});

export const ordenReparacionIdParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

export const listOrdenesQuerySchema = z.object({
  estado: estadoOrdenEnum.optional(),
  estadoPago: estadoPagoEnum.optional(),
  equipoId: z.coerce.number().int().positive().optional(),
  tecnicoId: z.coerce.number().int().positive().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateOrdenReparacionInput = z.infer<typeof createOrdenReparacionSchema>;
export type UpdateOrdenReparacionInput = z.infer<typeof updateOrdenReparacionSchema>;
export type ChangeEstadoOrdenInput = z.infer<typeof changeEstadoOrdenSchema>;
