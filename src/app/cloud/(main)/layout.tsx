'use client';

import { CloudAuthProvider } from '@/contexts/CloudAuthContext';

export default function MainCloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CloudAuthProvider>
      <div className="cloud-layout">
        {children}
      </div>
    </CloudAuthProvider>
  );
}
