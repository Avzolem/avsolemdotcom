import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

// function MyApp({ Component, pageProps: { session, ...pageProps } }) {
//   return (
//     <SessionProvider session={session}>
//       <Component {...pageProps} />
//     </SessionProvider>
//   );
// }

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    const [walletAddress, setWalletAddress] = useState(null);

    const checkIfWalletIsConnected = async () => {
        const { solana } = window;

        if (solana) {
            if (solana.isPhantom) {
                console.log("Phantom wallet was found");
                const response = await solana.connect({ onlyIfTrusted: true });
                setWalletAddress(response.publicKey.toString());
            }
        } else {
            console.log("Phatom wallet wasn't found");
        }
    };

    useEffect(() => {
        const onLoad = async () => {
            await checkIfWalletIsConnected();
        };

        window.addEventListener("load", onLoad);
        return () => window.removeEventListener("load", onLoad);
    }, []);

    const connectWallet = async () => {
        const { solana } = window;
        if (solana) {
            const response = await solana.connect();
            console.log(
                "Conected with public key",
                response.publicKey.toString
            );
            setWalletAddress(response.publicKey.toString());
        }
    };

    return (
        <div>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
            {!walletAddress && (
                <div className={styles.container}>
                    <button
                        onClick={connectWallet}
                        className={styles.walletButton}
                    >
                        Conectarse
                    </button>
                </div>
            )}
            <div></div>
        </div>
    );
}

export default MyApp;
