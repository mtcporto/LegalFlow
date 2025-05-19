
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, PlusCircle } from "lucide-react";

export default function SuppliersPage() {
  // Placeholder state and functions
  const suppliers = [
    { id: "s1", name: "Papelaria Central", category: "Material de Escritório", lastExpense: "R$ 150,00" },
    { id: "s2", name: "Tech Solutions IT", category: "Serviços de TI", lastExpense: "R$ 1.200,00" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Fornecedores</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Fornecedor
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>Visualize e gerencie os fornecedores e suas despesas.</CardDescription>
        </CardHeader>
        <CardContent>
          {suppliers.length > 0 ? (
            <ul className="space-y-4">
              {suppliers.map(supplier => (
                <li key={supplier.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center"><Truck className="h-5 w-5 mr-2 text-muted-foreground" />{supplier.name}</h3>
                    <p className="text-sm text-muted-foreground">Categoria: {supplier.category} | Última Despesa: {supplier.lastExpense}</p>
                  </div>
                  <Button variant="outline" size="sm">Ver Despesas</Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum fornecedor cadastrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Comece adicionando um novo fornecedor.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
