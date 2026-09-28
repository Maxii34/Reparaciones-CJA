import { z } from "zod";

export const createClienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres").trim(),
  apellido: z.string().max(100, "Máximo 100 caracteres").trim().optional().nullable(),
  dni: z.string().min(1, "DNI inválido").max(20, "Máximo 20 caracteres").trim().optional().nullable(),
  telefono: z.string().max(30, "Máximo 30 caracteres").trim().optional().nullable(),
  whatsapp: z.string().max(30, "Máximo 30 caracteres").trim().optional().nullable(),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Máximo 255 caracteres")
    .toLowerCase()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  direccion: z.string().max(255, "Máximo 255 caracteres").trim().optional().nullable(),
});

export const updateClienteSchema = z.object({
  nombre: z.string().min(1).max(100).trim().optional(),
  apellido: z.string().max(100).trim().optional().nullable(),
  dni: z.string().min(1).max(20).trim().optional().nullable(),
  telefono: z.string().max(30).trim().optional().nullable(),
  whatsapp: z.string().max(30).trim().optional().nullable(),
  email: z
    .string()
    .email("Email inválido")
    .max(255)
    .toLowerCase()
    .trim()
    .optional()
    .nullable()
    .or(z.literal("")),
  direccion: z.string().max(255).trim().optional().nullable(),
});

export const clienteIdParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

export const listClientesQuerySchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateClienteInput = z.infer<typeof createClienteSchema>;
export type UpdateClienteInput = z.infer<typeof updateClienteSchema>;
