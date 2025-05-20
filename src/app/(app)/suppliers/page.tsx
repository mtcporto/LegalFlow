
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Truck, PlusCircle, Edit3, Trash2, Eye, Info, Phone, Mail, FileText as NotesIcon, DollarSign } from "lucide-react";
import { SupplierForm, type SupplierFormData } from "@/components/suppliers/supplier-form";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FormattedDate } from "@/components/ui/formatted-date";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type Supplier = SupplierFormData & {
  id: string;
  dataCadastro: string;
};

type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  supplierId: string;
};

const initialMockSuppliers: Supplier[] = [
  { id: "s1", name: "Papelaria Central", category: "Material de Escritório", cnpj: "11.222.333/0001-44", contactName: "Sr. Silva", contactEmail: "silva@papelaria.com", contactPhone: "1122334455", dataCadastro: "2023-01-10", address: { street: "Rua das Flores", number: "123", city: "São Paulo", state: "SP", zipCode: "01000-000"} },
  { id: "s2", name: "Tech Solutions IT", category: "Serviços de TI", cnpj: "44.555.666/0001-77", contactName: "Dona Ana", contactEmail: "ana@techsolutions.com", dataCadastro: "2023-02-15", notes: "Manutenção mensal de servidores." },
  { id: "s3", name: "Limpeza Brilhante Ltda", category: "Serviços de Limpeza", dataCadastro: "2023-05-20" },
];

const initialMockExpenses: Record<string, Expense[]> = {
  "s1": [
    { id: "e1_1", description: "Resma de papel A4 (500 folhas)", amount: 25.90, date: "2024-07-10", supplierId: "s1" },
    { id: "e1_2", description: "Caixa de canetas BIC (Azul)", amount: 15.50, date: "2024-07-15", supplierId: "s1" },
  ],
  "s2": [
    { id: "e2_1", description: "Consultoria e manutenção servidor principal", amount: 1250.00, date: "2024-06-20", supplierId: "s2" },
    { id: "e2_2", description: "Licença Software Antivirus (Anual)", amount: 350.00, date: "2024-07-01", supplierId: "s2" },
  ],
  "s3": [],
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialMockSuppliers);
  const [expensesData, setExpensesData] = useState<Record<string, Expense[]>>(initialMockExpenses);
  const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false);
  const [isExpensesModalOpen, setIsExpensesModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleOpenAddModal = () => {
    setSelectedSupplier(null);
    setIsAddOrEditModalOpen(true);
  };

  const handleOpenEditModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsAddOrEditModalOpen(true);
  };

  const handleOpenExpensesModal = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setIsExpensesModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddOrEditModalOpen(false);
    setIsExpensesModalOpen(false);
    setSelectedSupplier(null);
  };

  const handleSubmitSupplier = async (data: SupplierFormData) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API call

    if (selectedSupplier && selectedSupplier.id) { // Editing existing supplier
      setSuppliers(prevSuppliers => 
        prevSuppliers.map(s => s.id === selectedSupplier.id ? { ...selectedSupplier, ...data } : s)
      );
      toast({ title: "Fornecedor Atualizado!", description: `O fornecedor "${data.name}" foi atualizado.` });
    } else { // Adding new supplier
      const newSupplier: Supplier = {
        id: `s${Date.now()}`,
        ...data,
        dataCadastro: new Date().toISOString().split('T')[0],
      };
      setSuppliers(prevSuppliers => [newSupplier, ...prevSuppliers]);
      if (!expensesData[newSupplier.id]) {
        setExpensesData(prev => ({...prev, [newSupplier.id]: []}));
      }
      toast({ title: "Fornecedor Adicionado!", description: `O fornecedor "${data.name}" foi cadastrado.` });
    }
    setIsSubmitting(false);
    handleCloseModals();
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 700));
    const supplierName = suppliers.find(s => s.id === supplierId)?.name || "O fornecedor";
    setSuppliers(prevSuppliers => prevSuppliers.filter(s => s.id !== supplierId));
    // Optionally remove expenses too, or handle as per business logic
    // const newExpensesData = { ...expensesData };
    // delete newExpensesData[supplierId];
    // setExpensesData(newExpensesData);
    toast({ title: "Fornecedor Excluído!", description: `${supplierName} foi excluído com sucesso.`, variant: "destructive" });
    setIsSubmitting(false);
  };
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Fornecedores</h1>
        <Button onClick={handleOpenAddModal}>
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Fornecedor
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
          <CardDescription>Visualize e gerencie os fornecedores cadastrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)]">
            {suppliers.length > 0 ? (
              <ul className="space-y-4">
                {suppliers.map(supplier => (
                  <li key={supplier.id} className="p-4 border rounded-lg shadow-sm ">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center">
                                <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                                {supplier.name}
                            </h3>
                            <p className="text-sm text-muted-foreground ml-7">Categoria: {supplier.category}</p>
                            {supplier.contactName && <p className="text-xs text-muted-foreground ml-7">Contato: {supplier.contactName} {supplier.contactPhone && `(${supplier.contactPhone})`}</p>}
                             <p className="text-xs text-muted-foreground ml-7 mt-1">Cadastrado em: <FormattedDate dateString={supplier.dataCadastro} options={{day: '2-digit', month: 'short', year: 'numeric'}} /></p>
                        </div>
                        <div className="flex space-x-1 mt-1">
                            <Button variant="outline" size="sm" onClick={() => handleOpenExpensesModal(supplier)} title="Ver Despesas">
                                <DollarSign className="h-4 w-4 mr-1 md:mr-2" /> <span className="hidden md:inline">Despesas</span>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(supplier)} title="Editar">
                                <Edit3 className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" title="Excluir">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja excluir o fornecedor "{supplier.name}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteSupplier(supplier.id)} 
                                    disabled={isSubmitting}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    {isSubmitting ? "Excluindo..." : "Excluir"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum fornecedor cadastrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">Comece adicionando um novo fornecedor.</p>
                <Button className="mt-4" onClick={handleOpenAddModal}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Primeiro Fornecedor
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add/Edit Supplier Dialog */}
      <Dialog open={isAddOrEditModalOpen} onOpenChange={(isOpen) => { if(!isOpen) handleCloseModals(); else setIsAddOrEditModalOpen(true);}}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
                <Truck className="h-6 w-6 mr-2 text-primary" /> 
                {selectedSupplier?.id ? "Editar Fornecedor" : "Adicionar Novo Fornecedor"}
            </DialogTitle>
            <DialogDescription>
                {selectedSupplier?.id ? `Modifique os dados do fornecedor "${selectedSupplier.name}".` : "Preencha os dados para cadastrar um novo fornecedor."}
            </DialogDescription>
          </DialogHeader>
          <SupplierForm
            onSubmit={handleSubmitSupplier}
            initialData={selectedSupplier}
            onCancel={handleCloseModals}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Supplier Expenses Dialog */}
      {selectedSupplier && (
        <Dialog open={isExpensesModalOpen} onOpenChange={(isOpen) => { if(!isOpen) handleCloseModals(); else setIsExpensesModalOpen(true);}}>
          <DialogContent className="sm:max-w-lg md:max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <DollarSign className="h-6 w-6 mr-2 text-primary" /> Despesas de {selectedSupplier.name}
              </DialogTitle>
              <DialogDescription>Lista de despesas registradas para este fornecedor.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1 pr-3">
                <div className="space-y-3 py-4">
                   {(expensesData[selectedSupplier.id] && expensesData[selectedSupplier.id].length > 0) ? (
                     <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Data</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Valor (R$)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expensesData[selectedSupplier.id].map(expense => (
                            <TableRow key={expense.id}>
                              <TableCell><FormattedDate dateString={expense.date} options={{day: '2-digit', month: '2-digit', year: 'numeric'}}/></TableCell>
                              <TableCell>{expense.description}</TableCell>
                              <TableCell className="text-right">{expense.amount.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                   ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma despesa registrada para este fornecedor.</p>
                   )}
                </div>
            </ScrollArea>
            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={handleCloseModals}>Fechar</Button>
              {/* TODO: Add button to add new expense for this supplier? */}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
