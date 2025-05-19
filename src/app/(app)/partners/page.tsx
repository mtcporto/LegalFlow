
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Handshake, PlusCircle } from "lucide-react";

export default function PartnersPage() {
  // Placeholder state and functions
  const partners = [
    { id: "p1", name: "Consultoria Legal ABC", commissionRate: "10%", type: "Indicação" },
    { id: "p2", name: "Peritos Associados", commissionRate: "Variável", type: "Serviços Técnicos" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Parceiros</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Parceiro
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
          <CardDescription>Visualize e gerencie os parceiros e suas comissões.</CardDescription>
        </CardHeader>
        <CardContent>
          {partners.length > 0 ? (
            <ul className="space-y-4">
              {partners.map(partner => (
                <li key={partner.id} className="p-4 border rounded-lg shadow-sm flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center"><Handshake className="h-5 w-5 mr-2 text-muted-foreground" />{partner.name}</h3>
                    <p className="text-sm text-muted-foreground">Tipo: {partner.type} | Comissão: {partner.commissionRate}</p>
                  </div>
                  <Button variant="outline" size="sm">Detalhes</Button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <Handshake className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum parceiro cadastrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Comece adicionando um novo parceiro.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
