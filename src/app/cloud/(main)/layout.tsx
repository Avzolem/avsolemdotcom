'use client';

import { CloudAuthProvider } from '@/contexts/CloudAuthContext';
import { ToastProvider } from '@/contexts/ToastContext';

export default function MainCloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CloudAuthProvider>
      <ToastProvider>
        <div className="cloud-layout">
          {children}
        </div>
      </ToastProvider>
    </CloudAuthProvider>
  );
}
