// src/ai/flows/generate-document.ts
'use server';

/**
 * @fileOverview A document generation AI agent.
 *
 * - generateDocument - A function that handles the document generation process.
 * - GenerateDocumentInput - The input type for the generateDocument function.
 * - GenerateDocumentOutput - The return type for the generateDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocumentInputSchema = z.object({
  clientData: z.string().describe('Client data as a JSON string.'),
  caseData: z.string().describe('Case data as a JSON string.'),
  documentType: z.enum([
    'Capa',
    'Procuração',
    'Contrato de prestação de serviço',
    'Autodeclaração Trab. Rural',
    'Termo de Representação',
    'Declaração de Recebimento de Aposentadoria',
    'Declaração Residência',
    'Termo de autorização BPC',
    'Formulário LOAS',
  ]).describe('Type of document to generate.'),
});
export type GenerateDocumentInput = z.infer<typeof GenerateDocumentInputSchema>;

const GenerateDocumentOutputSchema = z.object({
  documentText: z.string().describe('The generated document text.'),
});
export type GenerateDocumentOutput = z.infer<typeof GenerateDocumentOutputSchema>;

export async function generateDocument(input: GenerateDocumentInput): Promise<GenerateDocumentOutput> {
  return generateDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocumentPrompt',
  input: {schema: GenerateDocumentInputSchema},
  output: {schema: GenerateDocumentOutputSchema},
  prompt: `You are a legal document generation expert.

You will generate a legal document of type "{{documentType}}" using the provided client and case data.

Client Data: {{{clientData}}}
Case Data: {{{caseData}}}

Ensure the generated document is well-formatted and legally sound.
`,
});

const generateDocumentFlow = ai.defineFlow(
  {
    name: 'generateDocumentFlow',
    inputSchema: GenerateDocumentInputSchema,
    outputSchema: GenerateDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
