import { z } from "zod";

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "UF deve ter 2 caracteres").max(2, "UF deve ter 2 caracteres"),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  referencePoint: z.string().optional(),
});

const attachmentSchema = z.object({
  name: z.string(),
  type: z.string(),
  // In a real app, this would be a File object or URL
  // For simplicity, we'll just store the name and type
});

const representativeSchema = z.object({
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido"),
  nomeCompleto: z.string().min(3, "Nome completo é obrigatório"),
  apelido: z.string().optional(),
  dataNascimento: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Data de nascimento inválida" }),
  naturalidade: z.string().optional(),
  rg: z.string().optional(),
  orgaoEmissor: z.string().optional(),
  genero: z.enum(["Masculino", "Feminino", "Outro", "Não informar"]).optional(),
  estadoCivil: z.enum(["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável", "Outro"]).optional(),
  nomeMae: z.string().optional(),
  nomePai: z.string().optional(),
  contato: z.string().optional(), // Phone number
  email: z.string().email("Email inválido").optional(),
  endereco: addressSchema.optional(),
  grauParentesco: z.string().min(1, "Grau de parentesco é obrigatório"),
  attachments: z.array(attachmentSchema).optional(),
});


export const clientFormSchema = z.object({
  clientType: z.enum(["individual", "legalEntity"]),
  // Individual fields
  cpf: z.string().optional(),
  nomeCompleto: z.string().optional(),
  apelido: z.string().optional(),
  dataNascimento: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: "Data de nascimento inválida" }),
  naturalidade: z.string().optional(),
  rg: z.string().optional(),
  orgaoEmissor: z.string().optional(),
  genero: z.enum(["Masculino", "Feminino", "Outro", "Não informar"]).optional(),
  estadoCivil: z.enum(["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável", "Outro"]).optional(),
  nomeMae: z.string().optional(),
  nomePai: z.string().optional(),
  contato: z.string().optional(), // Phone number
  email: z.string().email({ message: "Email inválido" }).optional(),
  endereco: addressSchema.optional(),

  // Legal Entity fields
  cnpj: z.string().optional(),
  razaoSocial: z.string().optional(),
  nomeFantasia: z.string().optional(),
  inscricaoEstadual: z.string().optional(),
  inscricaoMunicipal: z.string().optional(),
  
  responsavelNome: z.string().optional(),
  responsavelApelido: z.string().optional(),
  responsavelCpf: z.string().optional(),
  responsavelFone: z.string().optional(),
  responsavelEmail: z.string().email({ message: "Email do responsável inválido" }).optional(),
  enderecoPJ: addressSchema.optional(),

  hasRepresentative: z.boolean().optional(),
  representative: representativeSchema.optional(),

  attachments: z.array(attachmentSchema).optional(),
}).superRefine((data, ctx) => {
  if (data.clientType === "individual") {
    if (!data.cpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data.cpf)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CPF inválido.", path: ["cpf"] });
    }
    if (!data.nomeCompleto || data.nomeCompleto.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nome completo é obrigatório.", path: ["nomeCompleto"] });
    }
  } else if (data.clientType === "legalEntity") {
    if (!data.cnpj || !/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(data.cnpj)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CNPJ inválido.", path: ["cnpj"] });
    }
    if (!data.razaoSocial || data.razaoSocial.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Razão Social é obrigatória.", path: ["razaoSocial"] });
    }
    if (!data.responsavelNome || data.responsavelNome.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nome do Responsável é obrigatório.", path: ["responsavelNome"] });
    }
     if (!data.responsavelCpf || !/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(data.responsavelCpf)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CPF do Responsável inválido.", path: ["responsavelCpf"] });
    }
  }

  if (data.hasRepresentative && !data.representative) {
     ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Dados do representante são obrigatórios.", path: ["representative"] });
  }
  if(data.hasRepresentative && data.representative) {
    if(!data.representative.cpf) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CPF do representante é obrigatório.", path: ["representative", "cpf"] });
    }
    if(!data.representative.nomeCompleto) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Nome completo do representante é obrigatório.", path: ["representative", "nomeCompleto"] });
    }
    if(!data.representative.grauParentesco) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Grau de parentesco do representante é obrigatório.", path: ["representative", "grauParentesco"] });
    }
  }
});

export type ClientFormData = z.infer<typeof clientFormSchema>;
