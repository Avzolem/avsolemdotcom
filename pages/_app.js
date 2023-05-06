import "../styles/globals.css";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import AuthContextProvider from "@/components/AuthProvider";

const activeChainId = ChainId.SolanaDevnet;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <>
            <ThirdwebProvider desiredChainId={activeChainId}>
                <AuthContextProvider>
                    <Component {...pageProps} />
                </AuthContextProvider>
            </ThirdwebProvider>
        </>
    );
}

export default MyApp;
