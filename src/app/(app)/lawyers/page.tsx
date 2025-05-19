
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Gavel, Edit3, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const mockLawyers = [
  { id: "l1", nome: "Dr. Carlos Alberto Nóbrega", oab: "SP123456", especialidade: "Direito Civil", contato: "(11) 99999-1111" },
  { id: "l2", nome: "Dra. Ana Paula Padrão", oab: "RJ654321", especialidade: "Direito Trabalhista", contato: "(21) 98888-2222" },
  { id: "l3", nome: "Dr. Pedro Bial", oab: "MG112233", especialidade: "Direito Empresarial", contato: "(31) 97777-3333" },
];

type Lawyer = typeof mockLawyers[0];

// TODO: Create a proper LawyerForm component
const LawyerForm = ({ onSubmit, initialData, onCancel }: { onSubmit: (data: any) => void, initialData?: any, onCancel?: () => void }) => {
  const [nome, setNome] = useState(initialData?.nome || "");
  const [oab, setOab] = useState(initialData?.oab || "");
  const [especialidade, setEspecialidade] = useState(initialData?.especialidade || "");
  const [contato, setContato] = useState(initialData?.contato || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nome, oab, especialidade, contato });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <div><Label htmlFor="nome">Nome Completo</Label><Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required /></div>
      <div><Label htmlFor="oab">Número da OAB</Label><Input id="oab" value={oab} onChange={(e) => setOab(e.target.value)} required /></div>
      <div><Label htmlFor="especialidade">Especialidade Principal</Label><Input id="especialidade" value={especialidade} onChange={(e) => setEspecialidade(e.target.value)} /></div>
      <div><Label htmlFor="contato">Contato (Telefone/Email)</Label><Input id="contato" value={contato} onChange={(e) => setContato(e.target.value)} /></div>
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit">{initialData ? "Salvar Alterações" : "Adicionar Advogado"}</Button>
      </div>
    </form>
  );
};

export default function LawyersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLawyer, setEditingLawyer] = useState<Lawyer | null>(null);
  const [lawyers, setLawyers] = useState<Lawyer[]>(mockLawyers);

  const handleAddLawyer = () => {
    setEditingLawyer(null);
    setIsFormOpen(true);
  };

  const handleEditLawyer = (lawyer: Lawyer) => {
    setEditingLawyer(lawyer);
    setIsFormOpen(true);
  };

  const handleDeleteLawyer = (lawyerId: string) => {
    setLawyers(lawyers.filter(l => l.id !== lawyerId));
    console.log("Delete lawyer:", lawyerId);
  };
  
  const handleFormSubmit = (data: any) => {
    if (editingLawyer) {
      setLawyers(lawyers.map(l => l.id === editingLawyer.id ? { ...l, ...data } : l));
      console.log("Update lawyer:", data);
    } else {
      const newLawyer = { ...data, id: `l${lawyers.length + 4}` };
      setLawyers([...lawyers, newLawyer]);
      console.log("Add new lawyer:", newLawyer);
    }
    setIsFormOpen(false);
    setEditingLawyer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Advogados</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddLawyer}>
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Advogado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingLawyer ? "Editar Advogado" : "Adicionar Novo Advogado"}</DialogTitle>
            </DialogHeader>
            <LawyerForm onSubmit={handleFormSubmit} initialData={editingLawyer} onCancel={() => setIsFormOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Advogados</CardTitle>
          <CardDescription>Visualize e gerencie os advogados cadastrados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>OAB</TableHead>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lawyers.length > 0 ? lawyers.map((lawyer) => (
                  <TableRow key={lawyer.id}>
                    <TableCell className="font-medium flex items-center">
                      <Gavel className="h-4 w-4 mr-2 text-muted-foreground" />
                      {lawyer.nome}
                    </TableCell>
                    <TableCell>{lawyer.oab}</TableCell>
                    <TableCell>{lawyer.especialidade}</TableCell>
                    <TableCell>{lawyer.contato}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditLawyer(lawyer)} title="Editar">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteLawyer(lawyer.id)} title="Excluir">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                   <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      Nenhum advogado cadastrado.
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
