'use client';

import { DashboardAuthProvider } from '@/contexts/DashboardAuthContext';
import './dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardAuthProvider>{children}</DashboardAuthProvider>;
}
