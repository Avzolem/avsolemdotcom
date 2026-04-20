'use client';

import { Loader2 } from 'lucide-react';
import { useDashboardAuth } from '@/contexts/DashboardAuthContext';
import { LoginScreen } from '@/components/dashboard/LoginScreen';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useDashboardAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <DashboardShell /> : <LoginScreen />;
}
