import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Activity, Users, Briefcase, FilePlus2 } from "lucide-react";
import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-2">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Bem-vindo ao LegalFlow
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-5 sm:text-xl">
          Gerencie seus clientes, casos e documentos com eficiência.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">152</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
            <Button asChild size="sm" className="mt-4 w-full">
              <Link href="/clients">Gerenciar Clientes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Casos em Andamento</CardTitle>
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +5 novos esta semana
            </p>
            <Button asChild size="sm" className="mt-4 w-full">
              <Link href="/cases">Ver Casos</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documentos Gerados</CardTitle>
            <FilePlus2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">340</div>
            <p className="text-xs text-muted-foreground">
              +30% este mês
            </p>
            <Button asChild size="sm" className="mt-4 w-full">
              <Link href="/generate-document">Gerar Novo</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Tarefas</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 urgentes para hoje
            </p>
            <Button variant="outline" size="sm" className="mt-4 w-full">
              Ver Tarefas
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Visão Geral da Plataforma</CardTitle>
          <CardDescription>
            LegalFlow é projetado para otimizar seu fluxo de trabalho jurídico, desde a gestão de clientes até a geração inteligente de documentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h3 className="text-xl font-semibold mb-2">Recursos Principais</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Gestão Completa de Clientes (PF e PJ)</li>
              <li>Organização de Casos e Processos</li>
              <li>Geração de Documentos com IA</li>
              <li>Controle de Advogados e Parceiros</li>
              <li>Relatórios Detalhados</li>
              <li>Sistema de Tarefas e Movimentações</li>
            </ul>
          </div>
          <div className="relative h-64 w-full">
             <Image
                src="https://placehold.co/600x400.png"
                alt="Legal Workflow Illustration"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
                data-ai-hint="legal office"
              />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
