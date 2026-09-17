import { z } from "zod";

const decimalDinero = z
  .number("Debe ser un número")
  .nonnegative("No puede ser negativo")
  .max(99999999.99, "Monto máximo excedido")
  .finite();

export const createRepuestoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres").trim(),
  descripcion: z.string().max(1000, "Máximo 1000 caracteres").trim().optional().nullable(),
  stock: z.number().int("El stock debe ser entero").min(0, "El stock no puede ser negativo").optional().default(0),
  costo: decimalDinero,
  precioVenta: decimalDinero.optional().nullable(),
});

export const updateRepuestoSchema = z.object({
  nombre: z.string().min(1).max(100).trim().optional(),
  descripcion: z.string().max(1000).trim().optional().nullable(),
  stock: z.number().int().min(0).optional(),
  costo: decimalDinero.optional(),
  precioVenta: decimalDinero.optional().nullable(),
});

export const repuestoIdParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

export const listRepuestosQuerySchema = z.object({
  search: z.string().trim().optional(),
  conStock: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreateRepuestoInput = z.infer<typeof createRepuestoSchema>;
export type UpdateRepuestoInput = z.infer<typeof updateRepuestoSchema>;
