import { z } from "zod";
import { estadoOrdenEnum } from "./ordenReparacion.validation";

export const createHistorialEstadoOrdenSchema = z.object({
  ordenId: z.number().int("ordenId debe ser entero").positive("ordenId debe ser positivo"),
  estado: estadoOrdenEnum,
  fecha: z.coerce.date().optional(),
  comentario: z.string().max(1000, "Máximo 1000 caracteres").trim().optional().nullable(),
  usuarioId: z.number().int().positive().optional().nullable(),
});

export const updateHistorialEstadoOrdenSchema = z.object({
  comentario: z.string().max(1000).trim().optional().nullable(),
  estado: estadoOrdenEnum.optional(),
});

export const historialEstadoOrdenIdParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

export const listHistorialQuerySchema = z.object({
  ordenId: z.coerce.number().int().positive().optional(),
  estado: estadoOrdenEnum.optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateHistorialEstadoOrdenInput = z.infer<typeof createHistorialEstadoOrdenSchema>;
export type UpdateHistorialEstadoOrdenInput = z.infer<typeof updateHistorialEstadoOrdenSchema>;
