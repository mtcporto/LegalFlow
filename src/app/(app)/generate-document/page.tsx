
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePlus2, Loader2, Wand2, Copy } from "lucide-react";
import { generateDocument, type GenerateDocumentInput } from "@/ai/flows/generate-document";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const documentTypes = [
  "Capa", "Procuração", "Contrato de prestação de serviço", "Autodeclaração Trab. Rural", 
  "Termo de Representação", "Declaração de Recebimento de Aposentadoria", 
  "Declaração Residência", "Termo de autorização BPC", "Formulário LOAS"
] as const;

const generateDocumentSchema = z.object({
  documentType: z.enum(documentTypes, { required_error: "Tipo de documento é obrigatório." }),
  clientData: z.string().min(1, "Dados do cliente são obrigatórios.").refine(val => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, "Dados do cliente devem ser um JSON válido."),
  caseData: z.string().min(1, "Dados do caso são obrigatórios.").refine(val => {
    try { JSON.parse(val); return true; } catch { return false; }
  }, "Dados do caso devem ser um JSON válido."),
});

type GenerateDocumentFormData = z.infer<typeof generateDocumentSchema>;

const exampleClientData = JSON.stringify({
  nomeCompleto: "João da Silva",
  cpf: "123.456.789-00",
  endereco: "Rua das Palmeiras, 123, Bairro Feliz, Cidade Alegre - UF",
  estadoCivil: "Casado",
  profissao: "Engenheiro"
}, null, 2);

const exampleCaseData = JSON.stringify({
  numeroProcesso: "001/2024",
  tipoAcao: "Revisão de Aposentadoria",
  vara: "1ª Vara Previdenciária",
  dataInicio: "2024-01-15"
}, null, 2);


export default function GenerateDocumentPage() {
  const [generatedDocument, setGeneratedDocument] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateDocumentFormData>({
    resolver: zodResolver(generateDocumentSchema),
    defaultValues: {
      clientData: exampleClientData,
      caseData: exampleCaseData,
    },
  });

  const onSubmit = async (data: GenerateDocumentFormData) => {
    setIsLoading(true);
    setGeneratedDocument(null);
    try {
      const input: GenerateDocumentInput = {
        documentType: data.documentType,
        clientData: data.clientData, // Already a string
        caseData: data.caseData,   // Already a string
      };
      const result = await generateDocument(input);
      setGeneratedDocument(result.documentText);
      toast({ title: "Documento Gerado!", description: "Seu documento foi gerado com sucesso." });
    } catch (error) {
      console.error("Error generating document:", error);
      let errorMessage = "Falha ao gerar o documento.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ title: "Erro", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedDocument) {
      navigator.clipboard.writeText(generatedDocument)
        .then(() => toast({ title: "Copiado!", description: "Documento copiado para a área de transferência." }))
        .catch(() => toast({ title: "Erro ao copiar", variant: "destructive" }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Gerador Inteligente de Documentos</h1>
        <FilePlus2 className="h-8 w-8 text-primary" />
      </div>

      <Card className="shadow-lg">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Configurar Documento</CardTitle>
            <CardDescription>Selecione o tipo de documento e forneça os dados necessários em formato JSON.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="documentType">Tipo de Documento</Label>
              <Controller
                name="documentType"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="documentType">
                      <SelectValue placeholder="Selecione o tipo de documento" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.documentType && <p className="text-sm text-destructive mt-1">{form.formState.errors.documentType.message}</p>}
            </div>

            <div>
              <Label htmlFor="clientData">Dados do Cliente (JSON)</Label>
              <Textarea
                id="clientData"
                {...form.register("clientData")}
                rows={8}
                placeholder="Insira os dados do cliente em formato JSON..."
                className="font-mono text-sm"
              />
              {form.formState.errors.clientData && <p className="text-sm text-destructive mt-1">{form.formState.errors.clientData.message}</p>}
            </div>

            <div>
              <Label htmlFor="caseData">Dados do Caso/Processo (JSON)</Label>
              <Textarea
                id="caseData"
                {...form.register("caseData")}
                rows={8}
                placeholder="Insira os dados do caso em formato JSON..."
                className="font-mono text-sm"
              />
              {form.formState.errors.caseData && <p className="text-sm text-destructive mt-1">{form.formState.errors.caseData.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Gerar Documento
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {generatedDocument && (
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Documento Gerado</CardTitle>
                <CardDescription>Revise o documento abaixo. Você pode copiá-lo ou editá-lo.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                <Copy className="mr-2 h-4 w-4" /> Copiar
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4 bg-muted/20">
              <pre className="whitespace-pre-wrap text-sm">{generatedDocument}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
