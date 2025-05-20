
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ListChecks, PlusCircle, Edit3, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProcessType {
  id: string;
  name: string;
  category: string;
}

const initialProcessTypes: ProcessType[] = [
  { id: "pt1", name: "Cível - Ação de Cobrança", category: "Cível" },
  { id: "pt2", name: "Trabalhista - Reclamação Trabalhista", category: "Trabalhista" },
  { id: "pt3", name: "Previdenciário - Aposentadoria por Idade", category: "Previdenciário" },
];

export default function ProcessTypesSettingsPage() {
  const [processTypes, setProcessTypes] = useState<ProcessType[]>(initialProcessTypes);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProcessType, setEditingProcessType] = useState<ProcessType | null>(null);
  const [currentName, setCurrentName] = useState("");
  const [currentCategory, setCurrentCategory] = useState("");
  const [typeToDelete, setTypeToDelete] = useState<ProcessType | null>(null);

  const { toast } = useToast();

  const handleOpenDialog = (processType?: ProcessType) => {
    if (processType) {
      setEditingProcessType(processType);
      setCurrentName(processType.name);
      setCurrentCategory(processType.category);
    } else {
      setEditingProcessType(null);
      setCurrentName("");
      setCurrentCategory("");
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProcessType(null);
    setCurrentName("");
    setCurrentCategory("");
  };

  const handleSubmitProcessType = () => {
    if (!currentName || !currentCategory) {
      toast({
        title: "Erro de Validação",
        description: "Nome e categoria são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (editingProcessType) {
      setProcessTypes(processTypes.map(pt => 
        pt.id === editingProcessType.id ? { ...pt, name: currentName, category: currentCategory } : pt
      ));
      toast({ title: "Tipo de Processo Atualizado!", description: `"${currentName}" foi atualizado.` });
    } else {
      const newProcessType: ProcessType = {
        id: `pt${Date.now()}`, // Simple unique ID
        name: currentName,
        category: currentCategory,
      };
      setProcessTypes([...processTypes, newProcessType]);
      toast({ title: "Tipo de Processo Adicionado!", description: `"${currentName}" foi adicionado.` });
    }
    handleCloseDialog();
  };

  const handleDeleteProcessType = (processTypeId: string) => {
    const type = processTypes.find(pt => pt.id === processTypeId);
    if (type) {
      setProcessTypes(processTypes.filter(pt => pt.id !== processTypeId));
      toast({ title: "Tipo de Processo Excluído!", description: `"${type.name}" foi excluído.`, variant: "destructive" });
    }
    setTypeToDelete(null); // Close alert dialog
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cadastro de Tipos de Processos</h1>
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) handleCloseDialog(); else setIsDialogOpen(true); }}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingProcessType ? "Editar Tipo de Processo" : "Adicionar Novo Tipo de Processo"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="processTypeName">Nome do Tipo de Processo</Label>
                <Input 
                  id="processTypeName" 
                  value={currentName} 
                  onChange={(e) => setCurrentName(e.target.value)} 
                  placeholder="Ex: Cível - Ação de Indenização"
                />
              </div>
              <div>
                <Label htmlFor="processTypeCategory">Categoria</Label>
                <Input 
                  id="processTypeCategory" 
                  value={currentCategory} 
                  onChange={(e) => setCurrentCategory(e.target.value)} 
                  placeholder="Ex: Cível, Trabalhista"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="button" onClick={handleSubmitProcessType}>
                {editingProcessType ? "Salvar Alterações" : "Adicionar Tipo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Tipos de Processos</CardTitle>
          <CardDescription>Gerencie os tipos de processos utilizados no sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)]">
            {processTypes.length > 0 ? (
              <ul className="space-y-3">
                {processTypes.map(type => (
                  <li key={type.id} className="p-3 border rounded-md flex justify-between items-center hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="font-medium">{type.name}</p>
                      <p className="text-sm text-muted-foreground">Categoria: {type.category}</p>
                    </div>
                    <div className="space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(type)} title="Editar Tipo">
                          <Edit3 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" title="Excluir Tipo" onClick={() => setTypeToDelete(type)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        {typeToDelete && typeToDelete.id === type.id && (
                           <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o tipo de processo "{typeToDelete.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setTypeToDelete(null)}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProcessType(typeToDelete.id)} className="bg-destructive hover:bg-destructive/90">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        )}
                      </AlertDialog>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ListChecks className="mx-auto h-12 w-12" />
                <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum tipo de processo cadastrado</h3>
                <p className="mt-1 text-sm">Adicione os tipos de processos clicando em "Adicionar Tipo".</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
