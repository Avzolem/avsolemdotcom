'use client'

import { ThirdwebProvider } from "@thirdweb-dev/react";
import AuthContextProvider from "@/components/AuthProvider";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThirdwebProvider>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </ThirdwebProvider>
    );
}