
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { partnerFormSchema, type PartnerFormData } from "./partner-form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PartnerFormProps {
  onSubmit: (data: PartnerFormData) => void;
  initialData?: Partial<PartnerFormData> | null;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const defaultValues: PartnerFormData = {
  name: "",
  commissionRate: "",
  type: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  notes: "",
};

export function PartnerForm({ onSubmit, initialData, onCancel, isSubmitting }: PartnerFormProps) {
  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues,
  });

  // Effect to reset form when initialData changes (e.g., for editing)
  React.useEffect(() => {
    if (initialData) {
      form.reset({ ...defaultValues, ...initialData });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData, form.reset, form]);


  const handleFormSubmit = (data: PartnerFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
        <ScrollArea className="max-h-[calc(80vh-200px)] pr-3"> {/* Adjust max-h as needed */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Parceiro *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Consultoria XYZ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Parceria *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Indicação, Serviços Técnicos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa de Comissão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 10% ou Variável" {...field} />
                  </FormControl>
                  <FormDescription>Pode ser uma porcentagem ou descrição.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Contato</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da pessoa de contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email do Contato</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contato@parceiro.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone do Contato</FormLabel>
                  <FormControl>
                    <Input placeholder="(00) 90000-0000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes adicionais sobre o parceiro..." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (initialData?.name ? "Salvar Alterações" : "Adicionar Parceiro")}
          </Button>
        </div>
      </form>
    </Form>
  );
}

