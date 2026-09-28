import { z } from "zod";

const decimalDinero = z
  .number("Debe ser un número")
  .nonnegative("No puede ser negativo")
  .max(99999999.99, "Monto máximo excedido")
  .finite();

export const createRepuestoUsadoSchema = z.object({
  ordenId: z.number().int("ordenId debe ser entero").positive("ordenId debe ser positivo"),
  repuestoId: z.number().int("repuestoId debe ser entero").positive("repuestoId debe ser positivo"),
  cantidad: z
    .number()
    .int("La cantidad debe ser entera")
    .min(1, "La cantidad mínima es 1")
    .optional()
    .default(1),
  costoUnitario: decimalDinero,
  precioUnitario: decimalDinero,
});

export const updateRepuestoUsadoSchema = z.object({
  cantidad: z.number().int().min(1).optional(),
  costoUnitario: decimalDinero.optional(),
  precioUnitario: decimalDinero.optional(),
});

export const repuestoUsadoIdParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

export const listRepuestosUsadosQuerySchema = z.object({
  ordenId: z.coerce.number().int().positive().optional(),
  repuestoId: z.coerce.number().int().positive().optional(),
});

export type CreateRepuestoUsadoInput = z.infer<typeof createRepuestoUsadoSchema>;
export type UpdateRepuestoUsadoInput = z.infer<typeof updateRepuestoUsadoSchema>;
