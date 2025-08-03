'use client'

import AuthContextProvider from "@/components/AuthProvider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthContextProvider>
            {children}
        </AuthContextProvider>
    );
}