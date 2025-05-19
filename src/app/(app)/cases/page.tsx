
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Briefcase, Edit3, Trash2, Users, Landmark, UserCheck, Handshake, CircleDollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FormattedDate } from "@/components/ui/formatted-date";


// Mock data for cases
const mockCases = [
  { id: "c1", numeroAno: "001/2024", clienteNome: "João Silva", clienteId: "1", status: "Em Andamento", dataAbertura: "2024-01-20", tipo: "Cível" },
  { id: "c2", numeroAno: "002/2024", clienteNome: "Maria Oliveira", clienteId: "2", status: "Concluído", dataAbertura: "2024-02-10", tipo: "Trabalhista" },
  { id: "c3", numeroAno: "001/2023", clienteNome: "Empresa XYZ Ltda", clienteId: "3", status: "Arquivado", dataAbertura: "2023-03-15", tipo: "Empresarial" },
];

const mockProcessos = {
  "c1": [
    { id: "p1_1", clienteNome: "João Silva", parceiroNome: "Advocacia Associada", valor: "R$ 5.000,00", advogados: ["Dr. Carlos", "Dra. Ana"], financeiros: ["Pagamento inicial", "Custas processuais"] },
  ],
  "c2": [
     { id: "p2_1", clienteNome: "Maria Oliveira", parceiroNome: "", valor: "R$ 12.000,00", advogados: ["Dr. Pedro"], financeiros: ["Acordo Judicial"] },
  ],
  "c3": []
};


type Case = typeof mockCases[0];
type Processo = typeof mockProcessos.c1[0];

// TODO: Create a proper CaseForm component similar to ClientForm
const CaseForm = ({ onSubmit, initialData, onCancel }: { onSubmit: (data: any) => void, initialData?: any, onCancel?: () => void }) => {
  const [numeroAno, setNumeroAno] = useState(initialData?.numeroAno || "");
  const [clienteId, setClienteId] = useState(initialData?.clienteId || "");
  const [tipo, setTipo] = useState(initialData?.tipo || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ numeroAno, clienteId, tipo, clienteNome: `Cliente ${clienteId}` }); // Replace with actual client name lookup
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div><Label htmlFor="numeroAno">Número/Ano da Pasta</Label><Input id="numeroAno" value={numeroAno} onChange={(e) => setNumeroAno(e.target.value)} placeholder="Ex: 001/2024" required /></div>
      <div><Label htmlFor="clienteId">ID do Cliente</Label><Input id="clienteId" value={clienteId} onChange={(e) => setClienteId(e.target.value)} placeholder="ID do cliente vinculado" required /></div>
      <div><Label htmlFor="tipo">Tipo de Processo</Label><Input id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} placeholder="Ex: Cível, Trabalhista" required /></div>
       <div className="flex justify-end space-x-2 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit">{initialData ? "Salvar Alterações" : "Adicionar Pasta"}</Button>
      </div>
    </form>
  );
};


const ProcessoDetails = ({ processos }: { processos: Processo[] }) => (
  <div className="pl-4 pr-4 pb-4 pt-2 space-y-3">
    {processos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum processo vinculado a esta pasta.</p>}
    {processos.map(proc => (
      <Card key={proc.id} className="bg-card/50">
        <CardHeader className="p-3">
          <CardTitle className="text-base">Processo ID: {proc.id}</CardTitle>
        </CardHeader>
        <CardContent className="p-3 text-sm space-y-1">
          <p><Users className="inline h-4 w-4 mr-1 text-muted-foreground"/> <strong>Cliente:</strong> {proc.clienteNome}</p>
          {proc.parceiroNome && <p><Handshake className="inline h-4 w-4 mr-1 text-muted-foreground"/><strong>Parceiro:</strong> {proc.parceiroNome}</p>}
          <p><CircleDollarSign className="inline h-4 w-4 mr-1 text-muted-foreground"/><strong>Valor:</strong> {proc.valor}</p>
          <p><UserCheck className="inline h-4 w-4 mr-1 text-muted-foreground"/><strong>Advogados:</strong> {proc.advogados.join(", ")}</p>
          <p><Landmark className="inline h-4 w-4 mr-1 text-muted-foreground"/><strong>Financeiro:</strong> {proc.financeiros.join(", ")}</p>
          {/* TODO: Add Anexos for Processos here */}
        </CardContent>
      </Card>
    ))}
    <Button variant="outline" size="sm" className="mt-2"><PlusCircle className="h-4 w-4 mr-2" /> Adicionar Processo</Button>
  </div>
);


export default function CasesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [processosData, setProcessosData] = useState<typeof mockProcessos>(mockProcessos);

  const handleAddCase = () => {
    setEditingCase(null);
    setIsFormOpen(true);
  };

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem);
    setIsFormOpen(true);
  };

  const handleDeleteCase = (caseId: string) => {
    setCases(cases.filter(c => c.id !== caseId));
    const newProcessosData = { ...processosData };
    delete (newProcessosData as any)[caseId];
    setProcessosData(newProcessosData);
    console.log("Delete case:", caseId);
  };
  
  const handleFormSubmit = (data: any) => {
    if (editingCase) {
      setCases(cases.map(c => c.id === editingCase.id ? { ...c, ...data } : c));
      console.log("Update case:", data);
    } else {
      const newCase = { ...data, id: `c${cases.length + 4}`, status: "Novo", dataAbertura: new Date().toISOString().split('T')[0] };
      setCases([...cases, newCase]);
      setProcessosData(prev => ({ ...prev, [newCase.id]: [] }));
      console.log("Add new case:", newCase);
    }
    setIsFormOpen(false);
    setEditingCase(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Pastas (Casos)</h1>
         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddCase}>
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Pasta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCase ? "Editar Pasta" : "Adicionar Nova Pasta"}</DialogTitle>
            </DialogHeader>
            <CaseForm onSubmit={handleFormSubmit} initialData={editingCase} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Pastas</CardTitle>
          <CardDescription>Visualize e gerencie todas as pastas de casos.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)]">
            <Accordion type="single" collapsible className="w-full">
              {cases.length > 0 ? cases.map((caseItem) => (
                <AccordionItem value={caseItem.id} key={caseItem.id} className="border-border hover:bg-muted/20 transition-colors">
                  <AccordionTrigger className="p-3 hover:no-underline">
                    <div className="flex justify-between w-full items-center pr-2">
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-base">{caseItem.numeroAno} - {caseItem.clienteNome}</span>
                        <span className="text-xs text-muted-foreground">{caseItem.tipo}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                         <Badge variant={
                            caseItem.status === "Em Andamento" ? "default" : 
                            caseItem.status === "Concluído" ? "secondary" :
                            caseItem.status === "Arquivado" ? "outline" : "destructive"
                          }
                          className={caseItem.status === "Em Andamento" ? "bg-blue-600 hover:bg-blue-700" : 
                                     caseItem.status === "Concluído" ? "bg-green-600 hover:bg-green-700" : "" }
                         >
                          {caseItem.status}
                        </Badge>
                        <FormattedDate 
                          dateString={caseItem.dataAbertura} 
                          className="text-xs text-muted-foreground" 
                          options={{ day: '2-digit', month: '2-digit', year: 'numeric' }}
                        />
                        <div className="flex space-x-1">
                            <Button asChild variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); handleEditCase(caseItem)}} title="Editar Pasta">
                                <span><Edit3 className="h-4 w-4" /></span>
                            </Button>
                            <Button asChild variant="ghost" size="icon" onClick={(e) => {e.stopPropagation(); handleDeleteCase(caseItem.id)}} title="Excluir Pasta">
                                <span><Trash2 className="h-4 w-4 text-destructive" /></span>
                            </Button>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProcessoDetails processos={(processosData as any)[caseItem.id] || []} />
                    <div className="p-4 border-t border-border">
                        <h4 className="text-sm font-medium mb-2">Anexos da Pasta</h4>
                        {/* TODO: Add Anexos for Case here */}
                        <p className="text-xs text-muted-foreground">Nenhum anexo para esta pasta.</p>
                        <Button variant="outline" size="sm" className="mt-2"><PlusCircle className="h-4 w-4 mr-2" /> Adicionar Anexo à Pasta</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )) : (
                 <div className="text-center h-24 flex items-center justify-center text-muted-foreground">
                    Nenhuma pasta cadastrada.
                 </div>
              )}
            </Accordion>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

