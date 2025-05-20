
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Handshake, PlusCircle, Edit3, Trash2, Eye, Info, Phone, Mail, FileText as NotesIcon } from "lucide-react";
import { PartnerForm, type PartnerFormData } from "@/components/partners/partner-form";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FormattedDate } from "@/components/ui/formatted-date";
import { Badge } from "@/components/ui/badge";

type Partner = {
  id: string;
  name: string;
  commissionRate: string;
  type: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  dataCadastro: string;
};

const initialMockPartners: Partner[] = [
  { id: "p1", name: "Consultoria Legal ABC", commissionRate: "10%", type: "Indicação", contactName: "Ana Silva", contactEmail: "ana@consultoriaabc.com", contactPhone: "(11) 98765-4321", notes: "Parceria antiga, foco em clientes PJ.", dataCadastro: "2023-03-10" },
  { id: "p2", name: "Peritos Associados", commissionRate: "Variável", type: "Serviços Técnicos", contactName: "Dr. Carlos Lima", contactEmail: "carlos.lima@peritos.com", dataCadastro: "2023-08-22", notes: "Especializados em laudos técnicos." },
  { id: "p3", name: "Marketing Jurídico Eficaz", commissionRate: "15% sobre novos contratos", type: "Marketing e Captação", contactName: "Sofia Almeida", contactEmail: "sofia@mktjuridico.com.br", contactPhone: "(21) 91234-5678", dataCadastro: "2024-01-05", notes: "Resultados promissores no último trimestre." },
];

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>(initialMockPartners);
  const [isAddOrEditModalOpen, setIsAddOrEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const handleOpenAddModal = () => {
    setSelectedPartner(null); // Clear selected partner for "add" mode
    setIsAddOrEditModalOpen(true);
  };

  const handleOpenEditModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsAddOrEditModalOpen(true);
  };

  const handleOpenDetailsModal = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsAddOrEditModalOpen(false);
    setIsDetailsModalOpen(false);
    setSelectedPartner(null); // Clear selection when any modal closes
  };

  const handleSubmitPartner = async (data: PartnerFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (selectedPartner && selectedPartner.id) { // Editing existing partner
      setPartners(prevPartners => 
        prevPartners.map(p => p.id === selectedPartner.id ? { ...p, ...data } : p)
      );
      toast({ title: "Parceiro Atualizado!", description: `O parceiro "${data.name}" foi atualizado com sucesso.` });
    } else { // Adding new partner
      const newPartner: Partner = {
        id: `p${Date.now()}`, // Simple unique ID
        ...data,
        dataCadastro: new Date().toISOString().split('T')[0],
      };
      setPartners(prevPartners => [newPartner, ...prevPartners]);
      toast({ title: "Parceiro Adicionado!", description: `O parceiro "${data.name}" foi adicionado com sucesso.` });
    }
    setIsSubmitting(false);
    handleCloseModals();
  };

  const handleDeletePartner = async (partnerId: string) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPartners(prevPartners => prevPartners.filter(p => p.id !== partnerId));
    toast({ title: "Parceiro Excluído!", description: "O parceiro foi excluído com sucesso.", variant: "destructive" });
    setIsSubmitting(false);
  };
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gestão de Parceiros</h1>
        <Button onClick={handleOpenAddModal}>
          <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Parceiro
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Lista de Parceiros</CardTitle>
          <CardDescription>Visualize e gerencie os parceiros e suas comissões.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-350px)]">
            {partners.length > 0 ? (
              <ul className="space-y-4">
                {partners.map(partner => (
                  <li key={partner.id} className="p-4 border rounded-lg shadow-sm ">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold flex items-center">
                                <Handshake className="h-5 w-5 mr-2 text-muted-foreground" />
                                {partner.name}
                            </h3>
                            <p className="text-sm text-muted-foreground ml-7">Tipo: {partner.type} | Comissão: {partner.commissionRate || "N/A"}</p>
                            <p className="text-xs text-muted-foreground ml-7 mt-1">Cadastrado em: <FormattedDate dateString={partner.dataCadastro} options={{day: '2-digit', month: 'short', year: 'numeric'}} /></p>
                        </div>
                        <div className="flex space-x-1 mt-1">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDetailsModal(partner)} title="Detalhes">
                                <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(partner)} title="Editar">
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
                                    Tem certeza que deseja excluir o parceiro "{partner.name}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeletePartner(partner.id)} 
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
                    {partner.contactName && (
                         <div className="ml-7 mt-2 text-sm">
                            <span className="font-medium">Contato:</span> {partner.contactName}
                            {partner.contactEmail && <span className="text-muted-foreground"> ({partner.contactEmail})</span>}
                        </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <Handshake className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">Nenhum parceiro cadastrado</h3>
                <p className="mt-1 text-sm text-muted-foreground">Comece adicionando um novo parceiro.</p>
                <Button className="mt-4" onClick={handleOpenAddModal}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Primeiro Parceiro
                </Button>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add/Edit Partner Dialog */}
      <Dialog open={isAddOrEditModalOpen} onOpenChange={(isOpen) => { if(!isOpen) handleCloseModals(); else setIsAddOrEditModalOpen(true);}}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
                <Handshake className="h-6 w-6 mr-2 text-primary" /> 
                {selectedPartner?.id ? "Editar Parceiro" : "Adicionar Novo Parceiro"}
            </DialogTitle>
            <DialogDescription>
                {selectedPartner?.id ? `Modifique os dados do parceiro "${selectedPartner.name}".` : "Preencha os dados para cadastrar um novo parceiro."}
            </DialogDescription>
          </DialogHeader>
          <PartnerForm
            onSubmit={handleSubmitPartner}
            initialData={selectedPartner}
            onCancel={handleCloseModals}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Partner Details Dialog */}
      {selectedPartner && (
        <Dialog open={isDetailsModalOpen} onOpenChange={(isOpen) => { if(!isOpen) handleCloseModals(); else setIsDetailsModalOpen(true);}}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Info className="h-6 w-6 mr-2 text-primary" /> Detalhes do Parceiro
              </DialogTitle>
              <DialogDescription>Informações completas sobre {selectedPartner.name}.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] p-1 pr-3">
                <div className="space-y-3 py-4">
                    <h3 className="text-xl font-semibold">{selectedPartner.name}</h3>
                    <p><Badge variant="outline" className="mr-2 font-semibold">Tipo:</Badge> {selectedPartner.type}</p>
                    <p><Badge variant="outline" className="mr-2 font-semibold">Comissão:</Badge> {selectedPartner.commissionRate || "Não especificada"}</p>
                    <p><Badge variant="outline" className="mr-2 font-semibold">Cadastrado em:</Badge> <FormattedDate dateString={selectedPartner.dataCadastro} options={{ day: '2-digit', month: 'long', year: 'numeric' }}/></p>
                    
                    {(selectedPartner.contactName || selectedPartner.contactEmail || selectedPartner.contactPhone) && <Separator className="my-4" />}
                    
                    {selectedPartner.contactName && <p className="flex items-center"><UserSquareIcon className="h-4 w-4 mr-2 text-muted-foreground"/><strong>Nome do Contato:</strong> {selectedPartner.contactName}</p>}
                    {selectedPartner.contactEmail && <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-muted-foreground"/><strong>Email:</strong> <a href={`mailto:${selectedPartner.contactEmail}`} className="text-primary hover:underline">{selectedPartner.contactEmail}</a></p>}
                    {selectedPartner.contactPhone && <p className="flex items-center"><Phone className="h-4 w-4 mr-2 text-muted-foreground"/><strong>Telefone:</strong> {selectedPartner.contactPhone}</p>}
                    
                    {selectedPartner.notes && <Separator className="my-4" />}
                    {selectedPartner.notes && (
                        <div>
                            <p className="flex items-center mb-1"><NotesIcon className="h-4 w-4 mr-2 text-muted-foreground" /><strong>Observações:</strong></p>
                            <p className="text-sm text-muted-foreground pl-6 whitespace-pre-wrap bg-muted/30 p-3 rounded-md">{selectedPartner.notes}</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            <DialogFooter className="mt-2">
              <Button variant="outline" onClick={handleCloseModals}>Fechar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Dummy UserSquareIcon for the details dialog - replace if you have a better one or remove if not needed
const UserSquareIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
  </svg>
);

