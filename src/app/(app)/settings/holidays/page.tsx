
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, PlusCircle, Edit3, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormattedDate } from "@/components/ui/formatted-date";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Holiday {
  id: string;
  date: string; // YYYY-MM-DD format
  description: string;
}

const initialHolidays: Holiday[] = [
  { id: "h1", date: "2024-01-01", description: "Confraternização Universal" },
  { id: "h2", date: "2024-04-21", description: "Tiradentes" },
  { id: "h3", date: "2024-05-01", description: "Dia do Trabalho" },
];

export default function HolidaysSettingsPage() {
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");
  const { toast } = useToast();

  const handleOpenDialog = (holiday?: Holiday) => {
    if (holiday) {
      setEditingHoliday(holiday);
      setCurrentDate(holiday.date);
      setCurrentDescription(holiday.description);
    } else {
      setEditingHoliday(null);
      const today = new Date().toISOString().split('T')[0]; // Default to today
      setCurrentDate(today);
      setCurrentDescription("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingHoliday(null);
    setCurrentDate("");
    setCurrentDescription("");
  };

  const handleSubmitHoliday = () => {
    if (!currentDate || !currentDescription) {
      toast({
        title: "Erro de Validação",
        description: "Data e descrição são obrigatórias.",
        variant: "destructive",
      });
      return;
    }

    if (editingHoliday) {
      setHolidays(holidays.map(h => h.id === editingHoliday.id ? { ...h, date: currentDate, description: currentDescription } : h));
      toast({ title: "Feriado Atualizado!", description: `"${currentDescription}" foi atualizado.` });
    } else {
      const newHoliday: Holiday = {
        id: `h${Date.now()}`, // Simple unique ID
        date: currentDate,
        description: currentDescription,
      };
      setHolidays([...holidays, newHoliday]);
      toast({ title: "Feriado Adicionado!", description: `"${currentDescription}" foi adicionado.` });
    }
    handleCloseDialog();
  };

  const handleDeleteHoliday = (holidayId: string) => {
    const holidayToDelete = holidays.find(h => h.id === holidayId);
    setHolidays(holidays.filter(h => h.id !== holidayId));
    if (holidayToDelete) {
        toast({ title: "Feriado Excluído!", description: `"${holidayToDelete.description}" foi excluído.`, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cadastro de Feriados</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) handleCloseDialog(); else setIsDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Feriado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingHoliday ? "Editar Feriado" : "Adicionar Novo Feriado"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="holidayDate">Data</Label>
                <Input 
                  id="holidayDate" 
                  type="date" 
                  value={currentDate} 
                  onChange={(e) => setCurrentDate(e.target.value)} 
                />
              </div>
              <div>
                <Label htmlFor="holidayDescription">Descrição</Label>
                <Input 
                  id="holidayDescription" 
                  value={currentDescription} 
                  onChange={(e) => setCurrentDescription(e.target.value)} 
                  placeholder="Ex: Dia da Independência"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="button" onClick={handleSubmitHoliday}>
                {editingHoliday ? "Salvar Alterações" : "Adicionar Feriado"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <li key={holiday.id} className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="font-medium flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                      <FormattedDate dateString={holiday.date} options={{ day: '2-digit', month: 'long', year: 'numeric' }} />
                      <span className="mx-2 text-muted-foreground">-</span>
                      {holiday.description}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(holiday)} title="Editar Feriado">
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteHoliday(holiday.id)} title="Excluir Feriado">
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum feriado cadastrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">Adicione os feriados relevantes clicando em "Adicionar Feriado".</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
