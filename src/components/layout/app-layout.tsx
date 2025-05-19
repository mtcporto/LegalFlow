import type { ReactNode } from 'react';
import { AppNavigation } from '@/components/navigation';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AppLayout({ children, title }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppNavigation />
      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
          <SidebarTrigger className="md:hidden" />
          {title && <h1 className="text-xl font-semibold text-foreground">{title}</h1>}
        </header>
        <ScrollArea className="flex-1">
          <main className="p-6">
            {children}
          </main>
        </ScrollArea>
      </SidebarInset>
    </div>
  );
}
