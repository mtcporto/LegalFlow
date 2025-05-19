
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HolidaysSettingsPage() {
  // Placeholder state and functions
  const holidays = [
    { id: "h1", date: "2024-01-01", description: "Confraternização Universal" },
    { id: "h2", date: "2024-04-21", description: "Tiradentes" },
    { id: "h3", date: "2024-05-01", description: "Dia do Trabalho" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cadastro de Feriados</h1>
        {/* TODO: Add Dialog for new holiday */}
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Feriado
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Feriados</CardTitle>
          <CardDescription>Gerencie os feriados nacionais e locais.</CardDescription>
        </CardHeader>
        <CardContent>
          {holidays.length > 0 ? (
             <ul className="space-y-3">
              {holidays.map(holiday => (
                <li key={holiday.id} className="p-3 border rounded-md flex justify-between items-center">
                  <div>
                    <p className="font-medium">{new Date(holiday.date + "T00:00:00").toLocaleDateString()} - {holiday.description}</p>
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
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum feriado cadastrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Adicione os feriados relevantes.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
