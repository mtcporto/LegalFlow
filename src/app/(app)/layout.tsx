import type { ReactNode } from 'react';
import { AppLayout } from '@/components/layout/app-layout';

export default function ApplicationGroupLayout({ children }: { children: ReactNode }) {
  // The title can be dynamically set per page using metadata or passed to AppLayout
  return <AppLayout>{children}</AppLayout>;
}
