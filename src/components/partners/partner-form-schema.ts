
"use client";

import { z } from "zod";

export const partnerFormSchema = z.object({
  name: z.string().min(3, "Nome do parceiro é obrigatório e deve ter pelo menos 3 caracteres."),
  commissionRate: z.string().optional(),
  type: z.string().min(1, "Tipo de parceria é obrigatório."),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email de contato inválido.").optional().or(z.literal('')), // Allow empty string
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
});

export type PartnerFormData = z.infer<typeof partnerFormSchema>;
