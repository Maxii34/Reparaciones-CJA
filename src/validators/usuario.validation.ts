import { z } from "zod";

export const rolUsuarioEnum = z.enum(["ADMIN", "TECNICO"]);

export const createUsuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres").trim(),
  email: z
    .string()
    .email("Email inválido")
    .max(255, "Máximo 255 caracteres")
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "Máximo 100 caracteres"),
  rol: rolUsuarioEnum.optional().default("TECNICO"),
  activo: z.boolean().optional().default(true),
});

export const updateUsuarioSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100).trim().optional(),
  email: z.string().email("Email inválido").max(255).toLowerCase().trim().optional(),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100)
    .optional(),
  rol: rolUsuarioEnum.optional(),
  activo: z.boolean().optional(),
});

export const loginUsuarioSchema = z.object({
  email: z.string().email("Email inválido").toLowerCase().trim(),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const usuarioIdParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

export type CreateUsuarioInput = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioInput = z.infer<typeof updateUsuarioSchema>;
export type LoginUsuarioInput = z.infer<typeof loginUsuarioSchema>;
