
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, Gift } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const mockBirthdays = [
  { id: "b1", name: "João Silva (Cliente)", date: "15 de Janeiro", type: "Cliente" },
  { id: "b2", name: "Dra. Ana Paula (Advogada)", date: "20 de Fevereiro", type: "Advogado" },
  { id: "b3", name: "Carlos Pereira (Cliente)", date: "05 de Maio", type: "Cliente" },
  { id: "b4", name: "Consultoria Legal ABC (Parceiro)", date: "10 de Junho", type: "Parceiro" },
];

export default function BirthdaysReportPage() {
  // Filter for upcoming birthdays this month / next month would be ideal here
  const currentMonthBirthdays = mockBirthdays; // Simplified for now

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Relatório de Aniversariantes</h1>
        <CalendarDays className="h-8 w-8 text-primary" />
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Aniversariantes do Mês</CardTitle>
          <CardDescription>Lista de clientes, advogados e parceiros aniversariando este mês.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentMonthBirthdays.length > 0 ? currentMonthBirthdays.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell className="font-medium flex items-center">
                       <Gift className="h-4 w-4 mr-2 text-muted-foreground" />
                      {person.name}
                    </TableCell>
                    <TableCell>{person.date}</TableCell>
                    <TableCell>
                      <Badge variant={
                        person.type === "Cliente" ? "default" :
                        person.type === "Advogado" ? "secondary" : "outline"
                      }>{person.type}</Badge>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">
                      Nenhum aniversariante encontrado para este período.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
