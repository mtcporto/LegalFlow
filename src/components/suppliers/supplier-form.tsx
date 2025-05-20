
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { supplierFormSchema, type SupplierFormData } from "./supplier-form-schema";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SupplierFormProps {
  onSubmit: (data: SupplierFormData) => void;
  initialData?: Partial<SupplierFormData> | null;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const defaultValues: SupplierFormData = {
  name: "",
  category: "",
  cnpj: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  address: {
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  },
  notes: "",
};

export function SupplierForm({ onSubmit, initialData, onCancel, isSubmitting }: SupplierFormProps) {
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: initialData ? { 
      ...defaultValues, 
      ...initialData,
      address: initialData.address ? { ...defaultValues.address, ...initialData.address } : defaultValues.address
    } : defaultValues,
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({ 
        ...defaultValues, 
        ...initialData,
        address: initialData.address ? { ...defaultValues.address, ...initialData.address } : defaultValues.address
       });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData, form.reset, form]);

  const handleFormSubmit = (data: SupplierFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 p-1">
        <ScrollArea className="max-h-[calc(80vh-220px)] pr-3">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Fornecedor *</FormLabel>
                  <FormControl><Input placeholder="Ex: Papelaria Central" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <FormControl><Input placeholder="Ex: Material de Escritório, Serviços de TI" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl><Input placeholder="00.000.000/0000-00" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Informações de Contato</h3>
            
            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Contato</FormLabel>
                  <FormControl><Input placeholder="Nome da pessoa de contato" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email do Contato</FormLabel>
                    <FormControl><Input type="email" placeholder="contato@fornecedor.com" {...field} /></FormControl>
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
                    <FormControl><Input placeholder="(00) 90000-0000" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <Separator className="my-6" />
            <h3 className="text-lg font-medium">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="address.street" render={({ field }) => (<FormItem><FormLabel>Rua</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="address.number" render={({ field }) => (<FormItem><FormLabel>Número</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="address.complement" render={({ field }) => (<FormItem><FormLabel>Complemento</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="address.neighborhood" render={({ field }) => (<FormItem><FormLabel>Bairro</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="address.city" render={({ field }) => (<FormItem><FormLabel>Cidade</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="address.state" render={({ field }) => (<FormItem><FormLabel>UF</FormLabel><FormControl><Input placeholder="XX" maxLength={2} {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="address.zipCode" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel>CEP</FormLabel><FormControl><Input placeholder="00000-000" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>

            <Separator className="my-6" />
             <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalhes adicionais sobre o fornecedor..." {...field} rows={4}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="flex justify-end space-x-2 pt-4 border-t">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : (initialData?.name ? "Salvar Alterações" : "Adicionar Fornecedor")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
