'use client'

import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import AuthContextProvider from "@/components/AuthProvider";
import { ReactNode } from "react";

const activeChainId = ChainId.SolanaDevnet;

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThirdwebProvider desiredChainId={activeChainId}>
            <AuthContextProvider>
                {children}
            </AuthContextProvider>
        </ThirdwebProvider>
    );
}