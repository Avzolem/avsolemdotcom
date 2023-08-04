import "../styles/globals.css";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import AuthContextProvider from "@/components/AuthProvider";

const activeChainId = ChainId.SolanaDevnet;

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <div data-theme="">
            <ThirdwebProvider desiredChainId={activeChainId}>
                <AuthContextProvider>
                    <Component {...pageProps} />
                </AuthContextProvider>
            </ThirdwebProvider>
        </div>
    );
}

export default MyApp;
