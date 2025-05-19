
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { clientFormSchema, type ClientFormData } from "./client-form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FilePlus2, Trash2, UserSquare2, Building } from "lucide-react";
import { useEffect } from "react";

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData> | null;
  onCancel?: () => void;
}

const defaultValues: ClientFormData = {
  clientType: "individual",
  cpf: "",
  nomeCompleto: "",
  apelido: "",
  dataNascimento: "",
  naturalidade: "",
  rg: "",
  orgaoEmissor: "",
  genero: "Não informar",
  estadoCivil: "Solteiro(a)",
  nomeMae: "",
  nomePai: "",
  contato: "",
  email: "",
  endereco: { street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "", referencePoint: "" },
  cnpj: "",
  razaoSocial: "",
  nomeFantasia: "",
  inscricaoEstadual: "",
  inscricaoMunicipal: "",
  responsavelNome: "",
  responsavelApelido: "",
  responsavelCpf: "",
  responsavelFone: "",
  responsavelEmail: "",
  enderecoPJ: { street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "", referencePoint: "" },
  hasRepresentative: false,
  representative: {
    cpf: "", nomeCompleto: "", apelido: "", dataNascimento: "", naturalidade: "", rg: "", orgaoEmissor: "", genero: "Não informar", estadoCivil: "Solteiro(a)", nomeMae: "", nomePai: "", contato: "", email: "",
    endereco: { street: "", number: "", complement: "", neighborhood: "", city: "", state: "", zipCode: "", referencePoint: "" },
    grauParentesco: "",
    attachments: []
  },
  attachments: [],
};


export function ClientForm({ onSubmit, initialData, onCancel }: ClientFormProps) {
  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  });

  const { fields: attachments, append: appendAttachment, remove: removeAttachment } = useFieldArray({
    control: form.control,
    name: "attachments",
  });

  const { fields: repAttachments, append: appendRepAttachment, remove: removeRepAttachment } = useFieldArray({
    control: form.control,
    name: "representative.attachments",
  });

  const clientType = form.watch("clientType");
  const hasRepresentative = form.watch("hasRepresentative");

  useEffect(() => {
    if (initialData) {
      form.reset({ ...defaultValues, ...initialData });
    }
  }, [initialData, form.reset, form]);

  const handleFormSubmit = (data: ClientFormData) => {
    onSubmit(data);
    form.reset(defaultValues);
  };
  
  const renderAddressFields = (fieldNamePrefix: "endereco" | "enderecoPJ" | "representative.endereco") => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <div><Label htmlFor={`${fieldNamePrefix}.street`}>Rua</Label><Input id={`${fieldNamePrefix}.street`} {...form.register(`${fieldNamePrefix}.street`)} /><p className="text-sm text-destructive">{form.formState.errors[fieldNamePrefix]?.street?.message}</p></div>
      <div><Label htmlFor={`${fieldNamePrefix}.number`}>Número</Label><Input id={`${fieldNamePrefix}.number`} {...form.register(`${fieldNamePrefix}.number`)} /></div>
      <div><Label htmlFor={`${fieldNamePrefix}.complement`}>Complemento</Label><Input id={`${fieldNamePrefix}.complement`} {...form.register(`${fieldNamePrefix}.complement`)} /></div>
      <div><Label htmlFor={`${fieldNamePrefix}.neighborhood`}>Bairro</Label><Input id={`${fieldNamePrefix}.neighborhood`} {...form.register(`${fieldNamePrefix}.neighborhood`)} /><p className="text-sm text-destructive">{form.formState.errors[fieldNamePrefix]?.neighborhood?.message}</p></div>
      <div><Label htmlFor={`${fieldNamePrefix}.city`}>Cidade</Label><Input id={`${fieldNamePrefix}.city`} {...form.register(`${fieldNamePrefix}.city`)} /><p className="text-sm text-destructive">{form.formState.errors[fieldNamePrefix]?.city?.message}</p></div>
      <div><Label htmlFor={`${fieldNamePrefix}.state`}>UF</Label><Input id={`${fieldNamePrefix}.state`} {...form.register(`${fieldNamePrefix}.state`)} /><p className="text-sm text-destructive">{form.formState.errors[fieldNamePrefix]?.state?.message}</p></div>
      <div><Label htmlFor={`${fieldNamePrefix}.zipCode`}>CEP</Label><Input id={`${fieldNamePrefix}.zipCode`} {...form.register(`${fieldNamePrefix}.zipCode`)} placeholder="00000-000"/><p className="text-sm text-destructive">{form.formState.errors[fieldNamePrefix]?.zipCode?.message}</p></div>
      <div className="md:col-span-2"><Label htmlFor={`${fieldNamePrefix}.referencePoint`}>Ponto de Referência</Label><Textarea id={`${fieldNamePrefix}.referencePoint`} {...form.register(`${fieldNamePrefix}.referencePoint`)} /></div>
    </div>
  );

  const renderAttachmentFields = (fieldArray: any, appendFn: any, removeFn: any, namePrefix: "attachments" | "representative.attachments") => (
    <Card className="mt-6">
      <CardHeader><CardTitle>Anexos</CardTitle><CardDescription>Adicione documentos relevantes.</CardDescription></CardHeader>
      <CardContent>
        {fieldArray.map((field: any, index: number) => (
          <div key={field.id} className="flex items-end gap-2 mb-2">
            <div className="flex-grow"><Label>Nome do Arquivo</Label><Input {...form.register(`${namePrefix}.${index}.name` as const)} /></div>
            <div className="flex-grow"><Label>Tipo do Documento</Label><Input {...form.register(`${namePrefix}.${index}.type` as const)} /></div>
            <Button type="button" variant="destructive" size="icon" onClick={() => removeFn(index)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => appendFn({ name: "", type: "" })} className="mt-2">
          <FilePlus2 className="mr-2 h-4 w-4" /> Adicionar Anexo
        </Button>
      </CardContent>
    </Card>
  );

  const renderRepresentativeFields = () => (
    <Card className="mt-6">
      <CardHeader><CardTitle>Representante / Curador</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><Label htmlFor="representative.nomeCompleto">Nome Completo</Label><Input id="representative.nomeCompleto" {...form.register("representative.nomeCompleto")} /><p className="text-sm text-destructive">{form.formState.errors.representative?.nomeCompleto?.message}</p></div>
          <div><Label htmlFor="representative.cpf">CPF</Label><Input id="representative.cpf" {...form.register("representative.cpf")} placeholder="000.000.000-00"/><p className="text-sm text-destructive">{form.formState.errors.representative?.cpf?.message}</p></div>
          <div><Label htmlFor="representative.apelido">Apelido</Label><Input id="representative.apelido" {...form.register("representative.apelido")} /></div>
          <div><Label htmlFor="representative.dataNascimento">Data de Nascimento</Label><Input type="date" id="representative.dataNascimento" {...form.register("representative.dataNascimento")} /><p className="text-sm text-destructive">{form.formState.errors.representative?.dataNascimento?.message}</p></div>
          <div><Label htmlFor="representative.naturalidade">Naturalidade</Label><Input id="representative.naturalidade" {...form.register("representative.naturalidade")} /></div>
          <div><Label htmlFor="representative.rg">RG</Label><Input id="representative.rg" {...form.register("representative.rg")} /></div>
          <div><Label htmlFor="representative.orgaoEmissor">Órgão Emissor</Label><Input id="representative.orgaoEmissor" {...form.register("representative.orgaoEmissor")} /></div>
           <div>
              <Label htmlFor="representative.genero">Gênero</Label>
              <Controller name="representative.genero" control={form.control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione o gênero" /></SelectTrigger>
                  <SelectContent>
                    {["Masculino", "Feminino", "Outro", "Não informar"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
            </div>
            <div>
              <Label htmlFor="representative.estadoCivil">Estado Civil</Label>
              <Controller name="representative.estadoCivil" control={form.control} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione o estado civil" /></SelectTrigger>
                  <SelectContent>
                    {["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável", "Outro"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              )} />
            </div>
          <div><Label htmlFor="representative.nomeMae">Nome da Mãe</Label><Input id="representative.nomeMae" {...form.register("representative.nomeMae")} /></div>
          <div><Label htmlFor="representative.nomePai">Nome do Pai</Label><Input id="representative.nomePai" {...form.register("representative.nomePai")} /></div>
          <div><Label htmlFor="representative.contato">Contato (Telefone)</Label><Input id="representative.contato" {...form.register("representative.contato")} /></div>
          <div><Label htmlFor="representative.email">Email</Label><Input type="email" id="representative.email" {...form.register("representative.email")} /><p className="text-sm text-destructive">{form.formState.errors.representative?.email?.message}</p></div>
          <div><Label htmlFor="representative.grauParentesco">Grau de Parentesco</Label><Input id="representative.grauParentesco" {...form.register("representative.grauParentesco")} /><p className="text-sm text-destructive">{form.formState.errors.representative?.grauParentesco?.message}</p></div>
        </div>
        <Separator />
        <h4 className="text-md font-medium">Endereço do Representante</h4>
        {renderAddressFields("representative.endereco")}
        {renderAttachmentFields(repAttachments, appendRepAttachment, removeRepAttachment, "representative.attachments")}
      </CardContent>
    </Card>
  );

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 p-1">
      <Controller name="clientType" control={form.control} render={({ field }) => (
        <Tabs defaultValue={field.value} onValueChange={(value) => field.onChange(value as "individual" | "legalEntity")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="individual"><UserSquare2 className="mr-2 h-4 w-4 inline-block"/>Pessoa Física</TabsTrigger>
            <TabsTrigger value="legalEntity"><Building className="mr-2 h-4 w-4 inline-block"/>Pessoa Jurídica</TabsTrigger>
          </TabsList>
          <TabsContent value="individual" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Dados Pessoais</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="nomeCompleto">Nome Completo</Label><Input id="nomeCompleto" {...form.register("nomeCompleto")} /><p className="text-sm text-destructive">{form.formState.errors.nomeCompleto?.message}</p></div>
                  <div><Label htmlFor="cpf">CPF</Label><Input id="cpf" {...form.register("cpf")} placeholder="000.000.000-00" /><p className="text-sm text-destructive">{form.formState.errors.cpf?.message}</p></div>
                  <div><Label htmlFor="apelido">Apelido</Label><Input id="apelido" {...form.register("apelido")} /></div>
                  <div><Label htmlFor="dataNascimento">Data de Nascimento</Label><Input type="date" id="dataNascimento" {...form.register("dataNascimento")} /><p className="text-sm text-destructive">{form.formState.errors.dataNascimento?.message}</p></div>
                  <div><Label htmlFor="naturalidade">Naturalidade</Label><Input id="naturalidade" {...form.register("naturalidade")} /></div>
                  <div><Label htmlFor="rg">RG</Label><Input id="rg" {...form.register("rg")} /></div>
                  <div><Label htmlFor="orgaoEmissor">Órgão Emissor</Label><Input id="orgaoEmissor" {...form.register("orgaoEmissor")} /></div>
                  <div>
                    <Label htmlFor="genero">Gênero</Label>
                    <Controller name="genero" control={form.control} render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Selecione o gênero" /></SelectTrigger>
                        <SelectContent>{["Masculino", "Feminino", "Outro", "Não informar"].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                      </Select>
                    )} />
                  </div>
                  <div>
                    <Label htmlFor="estadoCivil">Estado Civil</Label>
                     <Controller name="estadoCivil" control={form.control} render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger><SelectValue placeholder="Selecione o estado civil" /></SelectTrigger>
                        <SelectContent>{["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)", "União Estável", "Outro"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    )} />
                  </div>
                  <div><Label htmlFor="nomeMae">Nome da Mãe</Label><Input id="nomeMae" {...form.register("nomeMae")} /></div>
                  <div><Label htmlFor="nomePai">Nome do Pai</Label><Input id="nomePai" {...form.register("nomePai")} /></div>
                  <div><Label htmlFor="contato">Contato (Telefone)</Label><Input id="contato" {...form.register("contato")} /></div>
                  <div><Label htmlFor="email">Email</Label><Input type="email" id="email" {...form.register("email")} /><p className="text-sm text-destructive">{form.formState.errors.email?.message}</p></div>
                </div>
                <Separator />
                <h4 className="text-md font-medium">Endereço</h4>
                {renderAddressFields("endereco")}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="legalEntity" className="mt-6">
            <Card>
              <CardHeader><CardTitle>Dados da Empresa</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="razaoSocial">Razão Social</Label><Input id="razaoSocial" {...form.register("razaoSocial")} /><p className="text-sm text-destructive">{form.formState.errors.razaoSocial?.message}</p></div>
                  <div><Label htmlFor="cnpj">CNPJ</Label><Input id="cnpj" {...form.register("cnpj")} placeholder="00.000.000/0000-00" /><p className="text-sm text-destructive">{form.formState.errors.cnpj?.message}</p></div>
                  <div><Label htmlFor="nomeFantasia">Nome Fantasia</Label><Input id="nomeFantasia" {...form.register("nomeFantasia")} /></div>
                  <div><Label htmlFor="inscricaoEstadual">Inscrição Estadual</Label><Input id="inscricaoEstadual" {...form.register("inscricaoEstadual")} /></div>
                  <div><Label htmlFor="inscricaoMunicipal">Inscrição Municipal</Label><Input id="inscricaoMunicipal" {...form.register("inscricaoMunicipal")} /></div>
                </div>
                <Separator />
                <h4 className="text-md font-medium">Responsável Legal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label htmlFor="responsavelNome">Nome do Responsável</Label><Input id="responsavelNome" {...form.register("responsavelNome")} /><p className="text-sm text-destructive">{form.formState.errors.responsavelNome?.message}</p></div>
                  <div><Label htmlFor="responsavelCpf">CPF do Responsável</Label><Input id="responsavelCpf" {...form.register("responsavelCpf")} placeholder="000.000.000-00"/><p className="text-sm text-destructive">{form.formState.errors.responsavelCpf?.message}</p></div>
                  <div><Label htmlFor="responsavelApelido">Apelido do Responsável</Label><Input id="responsavelApelido" {...form.register("responsavelApelido")} /></div>
                  <div><Label htmlFor="responsavelFone">Telefone do Responsável</Label><Input id="responsavelFone" {...form.register("responsavelFone")} /></div>
                  <div className="md:col-span-2"><Label htmlFor="responsavelEmail">Email do Responsável</Label><Input type="email" id="responsavelEmail" {...form.register("responsavelEmail")} /><p className="text-sm text-destructive">{form.formState.errors.responsavelEmail?.message}</p></div>
                </div>
                <Separator />
                <h4 className="text-md font-medium">Endereço da Empresa</h4>
                {renderAddressFields("enderecoPJ")}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )} />
      
      <div className="flex items-center space-x-2 mt-6">
        <Controller name="hasRepresentative" control={form.control} render={({ field }) => (
            <Checkbox id="hasRepresentative" checked={field.value} onCheckedChange={field.onChange} />
        )} />
        <Label htmlFor="hasRepresentative" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Possui Representante / Curador?
        </Label>
      </div>
      {hasRepresentative && renderRepresentativeFields()}

      {renderAttachmentFields(attachments, appendAttachment, removeAttachment, "attachments")}

      <div className="flex justify-end space-x-4 pt-6">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : (initialData ? "Salvar Alterações" : "Adicionar Cliente")}
        </Button>
      </div>
    </form>
  );
}
