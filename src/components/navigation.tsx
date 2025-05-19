
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Gavel,
  Handshake,
  Truck,
  FileText,
  BarChart3,
  Settings,
  CalendarDays,
  ListChecks,
  FilePlus2,
  Building,
  Landmark,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  matchSegments?: number;
}

const mainNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clientes", icon: Users },
  { href: "/cases", label: "Pastas (Casos)", icon: Briefcase },
  { href: "/lawyers", label: "Advogados", icon: Gavel },
  { href: "/partners", label: "Parceiros", icon: Handshake },
  { href: "/suppliers", label: "Fornecedores", icon: Truck },
  { href: "/generate-document", label: "Gerar Documento", icon: FilePlus2 },
];

const reportNavItems: NavItem[] = [
 { href: "/reports/birthdays", label: "Aniversariantes", icon: CalendarDays },
];

const settingsNavItems: NavItem[] = [
  { href: "/settings/holidays", label: "Feriados", icon: CalendarDays },
  { href: "/settings/process-types", label: "Tipos de Processos", icon: ListChecks },
];

export function AppNavigation() {
  const pathname = usePathname();

  const isActive = (href: string, matchSegments = 2) => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const hrefSegments = href.split("/").filter(Boolean);
    if (hrefSegments.length === 0 && pathSegments.length === 0) return true; // For root dashboard
    if (hrefSegments.length > pathSegments.length) return false;
    
    let effectiveMatchSegments = matchSegments;
    if (hrefSegments.length < matchSegments) {
      effectiveMatchSegments = hrefSegments.length;
    }

    for (let i = 0; i < effectiveMatchSegments; i++) {
      if (pathSegments[i] !== hrefSegments[i]) {
        return false;
      }
    }
    return true;
  };
  
  const NavLinks = ({ items }: { items: NavItem[] }) => (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={isActive(item.href, item.matchSegments)}
              tooltip={{ children: item.label, className: "dark:bg-sidebar-accent dark:text-sidebar-accent-foreground" }}
              className="justify-start"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </>
  );

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors">
          <Landmark className="h-7 w-7 text-sidebar-primary" />
          <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
            LegalFlow
          </h1>
        </Link>
      </SidebarHeader>
      <Separator className="mb-2" />
      <SidebarContent className="p-2">
        <SidebarMenu>
          <NavLinks items={mainNavItems} />
          <SidebarGroup className="mt-4 p-0">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Relatórios</SidebarGroupLabel>
            <NavLinks items={reportNavItems} />
          </SidebarGroup>
          <SidebarGroup className="mt-4 p-0">
            <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Configurações</SidebarGroupLabel>
            <NavLinks items={settingsNavItems} />
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[collapsible=icon]:hidden">
        <p className="text-xs text-sidebar-foreground/70">
          © {new Date().getFullYear()} LegalFlow
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
