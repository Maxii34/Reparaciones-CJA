import { z } from "zod";

export const medioPagoEnum = z.enum([
  "EFECTIVO",
  "TRANSFERENCIA",
  "TARJETA_DEBITO",
  "TARJETA_CREDITO",
  "MERCADO_PAGO",
  "OTRO",
]);

export const createPagoSchema = z.object({
  ordenId: z.number().int("ordenId debe ser entero").positive("ordenId debe ser positivo"),
  monto: z
    .number("El monto debe ser un número")
    .positive("El monto debe ser mayor a 0")
    .max(99999999.99, "Monto máximo excedido")
    .finite(),
  medioPago: medioPagoEnum,
  fecha: z.coerce.date().optional(),
  observaciones: z.string().max(1000, "Máximo 1000 caracteres").trim().optional().nullable(),
  registradoPorId: z.number().int().positive().optional().nullable(),
});

export const updatePagoSchema = z.object({
  monto: z.number().positive("El monto debe ser mayor a 0").max(99999999.99).finite().optional(),
  medioPago: medioPagoEnum.optional(),
  fecha: z.coerce.date().optional(),
  observaciones: z.string().max(1000).trim().optional().nullable(),
});

export const pagoIdParamSchema = z.object({
  id: z.coerce.number().int("El id debe ser entero").positive("El id debe ser positivo"),
});

export const listPagosQuerySchema = z.object({
  ordenId: z.coerce.number().int().positive().optional(),
  medioPago: medioPagoEnum.optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});

export type CreatePagoInput = z.infer<typeof createPagoSchema>;
export type UpdatePagoInput = z.infer<typeof updatePagoSchema>;
