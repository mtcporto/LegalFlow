
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, User, Edit3, Trash2 } from "lucide-react";
import { ClientForm } from "@/components/clients/client-form";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormattedDate } from "@/components/ui/formatted-date";

// Mock data for clients
const mockClients = [
  { id: "1", nomeCompleto: "João Silva", cpf: "123.456.789-00", tipo: "PF", status: "Ativo", dataCadastro: "2023-01-15" },
  { id: "2", nomeCompleto: "Maria Oliveira", cpf: "987.654.321-00", tipo: "PF", status: "Ativo", dataCadastro: "2023-02-20" },
  { id: "3", nomeCompleto: "Empresa XYZ Ltda", cpf: "12.345.678/0001-99", tipo: "PJ", status: "Inativo", dataCadastro: "2022-11-10" },
  { id: "4", nomeCompleto: "Carlos Pereira", cpf: "111.222.333-44", tipo: "PF", status: "Ativo", dataCadastro: "2023-05-05" },
];

type Client = typeof mockClients[0];

export default function ClientsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);

  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeleteClient = (clientId: string) => {
    // Placeholder for delete logic
    setClients(clients.filter(c => c.id !== clientId));
    console.log("Delete client:", clientId);
  };
  
  const handleFormSubmit = (data: any) => {
    if (editingClient) {
      // Update client
      setClients(clients.map(c => c.id === editingClient.id ? { ...c, ...data, tipo: data.clientType === 'individual' ? 'PF' : 'PJ' } : c));
      console.log("Update client:", data);
    } else {
      // Add new client
      const newClient = { ...data, id: String(clients.length + 5), tipo: data.clientType === 'individual' ? 'PF' : 'PJ', status: "Ativo", dataCadastro: new Date().toISOString().split('T')[0] };
      setClients([...clients, newClient]);
      console.log("Add new client:", data);
    }
    setIsFormOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Clientes</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddClient}>
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingClient ? "Editar Cliente" : "Adicionar Novo Cliente"}</DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[calc(90vh-150px)] p-1"> {/* Added padding to avoid scrollbar overlap */}
              <ClientForm 
                onSubmit={handleFormSubmit} 
                initialData={editingClient} 
                onCancel={() => { setIsFormOpen(false); setEditingClient(null); }}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Visualize e gerencie todos os clientes cadastrados.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome / Razão Social</TableHead>
                  <TableHead>CPF / CNPJ</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.length > 0 ? clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.nomeCompleto}</TableCell>
                    <TableCell>{client.cpf}</TableCell>
                    <TableCell>
                      <Badge variant={client.tipo === "PF" ? "secondary" : "outline"}>
                        {client.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <Badge variant={client.status === "Ativo" ? "default" : "destructive"} className={client.status === "Ativo" ? "bg-green-600 hover:bg-green-700" : ""}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <FormattedDate dateString={client.dataCadastro} options={{ day: '2-digit', month: '2-digit', year: 'numeric' }} />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)} title="Editar">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)} title="Excluir">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      Nenhum cliente cadastrado.
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
