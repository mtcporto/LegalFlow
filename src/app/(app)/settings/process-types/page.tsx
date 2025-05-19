
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProcessTypesSettingsPage() {
  // Placeholder state and functions
  const processTypes = [
    { id: "pt1", name: "Cível - Ação de Cobrança", category: "Cível" },
    { id: "pt2", name: "Trabalhista - Reclamação Trabalhista", category: "Trabalhista" },
    { id: "pt3", name: "Previdenciário - Aposentadoria por Idade", category: "Previdenciário" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cadastro de Tipos de Processos</h1>
        {/* TODO: Add Dialog for new process type */}
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Tipo
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Tipos de Processos</CardTitle>
          <CardDescription>Gerencie os tipos de processos utilizados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          {processTypes.length > 0 ? (
            <ul className="space-y-3">
              {processTypes.map(type => (
                <li key={type.id} className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">{type.name}</p>
                    <p className="text-sm text-muted-foreground">Categoria: {type.category}</p>
                  </div>
                   <div className="space-x-2">
                    <Button variant="outline" size="sm">Editar</Button>
                    <Button variant="destructive" size="sm">Excluir</Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
             <div className="text-center py-12">
              <ListChecks className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum tipo de processo cadastrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Adicione os tipos de processos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
