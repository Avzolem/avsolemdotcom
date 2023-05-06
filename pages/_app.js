import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import AuthContextProvider from "@/components/AuthProvider";

const activeChainId = ChainId.SolanaDevnet;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <>
            <SessionProvider session={session}>
                <ThirdwebProvider desiredChainId={activeChainId}>
                    <AuthContextProvider>
                        <Component {...pageProps} />
                    </AuthContextProvider>
                </ThirdwebProvider>
            </SessionProvider>
        </>
    );
}

export default MyApp;
