import { z } from "zod";

export const createEquipoSchema = z.object({
  tipo: z.string().min(1, "El tipo es requerido").max(50, "Máximo 50 caracteres").trim(),
  marca: z.string().min(1, "La marca es requerida").max(50, "Máximo 50 caracteres").trim(),
  modelo: z.string().min(1, "El modelo es requerido").max(50, "Máximo 50 caracteres").trim(),
  numeroSerie: z.string().max(100, "Máximo 100 caracteres").trim().optional().nullable(),
  observaciones: z.string().max(1000, "Máximo 1000 caracteres").trim().optional().nullable(),
  clienteId: z.number().int("clienteId debe ser entero").positive("clienteId debe ser positivo"),
});

export const updateEquipoSchema = z.object({
  tipo: z.string().min(1).max(50).trim().optional(),
  marca: z.string().min(1).max(50).trim().optional(),
  modelo: z.string().min(1).max(50).trim().optional(),
  numeroSerie: z.string().max(100).trim().optional().nullable(),
  observaciones: z.string().max(1000).trim().optional().nullable(),
  clienteId: z.number().int().positive().optional(),
});

export const equipoIdParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

export const listEquiposQuerySchema = z.object({
  clienteId: z.coerce.number().int().positive().optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateEquipoInput = z.infer<typeof createEquipoSchema>;
export type UpdateEquipoInput = z.infer<typeof updateEquipoSchema>;
