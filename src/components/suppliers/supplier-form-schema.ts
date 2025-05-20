
"use client";

import { z } from "zod";

// Helper for CNPJ validation
const validateCnpj = (cnpj: string): boolean => {
  if (!cnpj) return true; // Optional field
  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj === '') return false;
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false; // Filter out "0000..." type of CNPJs

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
  if (resultado !== parseInt(digitos.charAt(1), 10)) return false;

  return true;
};

const addressSchemaOptional = z.object({
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional().refine(val => !val || val.length === 2, { message: "UF deve ter 2 caracteres" }),
  zipCode: z.string().optional().refine(val => !val || /^\d{5}-\d{3}$/.test(val), { message: "CEP inválido (formato: 00000-000)" }),
});

export const supplierFormSchema = z.object({
  name: z.string().min(3, "Nome do fornecedor é obrigatório (mín. 3 caracteres)."),
  category: z.string().min(1, "Categoria é obrigatória."),
  cnpj: z.string().optional().refine(val => !val || validateCnpj(val), {
    message: "CNPJ inválido.",
  }),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email de contato inválido.").optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  address: addressSchemaOptional.optional(),
  notes: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierFormSchema>;
