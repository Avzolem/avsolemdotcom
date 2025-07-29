import React, { createContext, useState, useEffect } from "react";
import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
} from "@solana/web3.js";
import { useRouter } from "next/navigation";
export const AuthContext = createContext();
import toast from "react-hot-toast";
const treasuryPublicKey = process.env.NEXT_PUBLIC_PAYER_PUBLIC;
const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

const AuthContextProvider = (props) => {
    const router = useRouter();
    const [publicKey, setPublicKey] = useState(null);
    const [signature, setSignature] = useState(null);
    const [truncatePublicKey, setTruncatePublicKey] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [isMinted, setIsMinted] = useState(false);

    //check in local storage if we already have a phantom wallet connected
    useEffect(() => {
        let key = window.localStorage.getItem("publicKey");
        let _signature = window.localStorage.getItem("signature");
        let _name = window.localStorage.getItem("name");
        let _email = window.localStorage.getItem("email");
        let _isMinted = window.localStorage.getItem("isMinted");

        setPublicKey(key);
        setTruncatePublicKey(truncateWalletAddress(key));
        setSignature(_signature);
        setName(_name);
        setEmail(_email);
        setIsMinted(_isMinted);
    }, []);

    const signIn = async () => {
        const provider = window?.phantom?.solana;
        const { solana } = window;

        //If phantom wallet is not installed
        if (!provider?.isPhantom || !solana.isPhantom) {
            toast.error("Please install Phantom Wallet...");
            setTimeout(() => {
                window.open("https://phantom.app/", "_blank");
            }, 2000);
            return;
        }

        //if phantom wallet is installed
        //Asssigning the phantom provider
        let phantom;
        if (provider?.isPhantom) phantom = provider;

        const { publicKey } = await phantom.connect();
        setPublicKey(publicKey.toString());
        toast.success("Wallet connected 👻");
        setTruncatePublicKey(truncateWalletAddress(publicKey.toString()));
        window.localStorage.setItem("publicKey", publicKey.toString());
    };

    const signOut = () => {
        if (window) {
            const { solana } = window;
            window.localStorage.removeItem("publicKey");
            window.localStorage.removeItem("signature");
            window.localStorage.removeItem("name");
            window.localStorage.removeItem("email");
            window.localStorage.removeItem("isMinted");
            setPublicKey(null);
            setTruncatePublicKey(null);
            setSignature(null);
            setName(null);
            setEmail(null);
            setIsMinted(false);
            solana.disconnect();
            toast.error("Wallet disconnected 💀");
            setTimeout(() => {
                router.refresh();
            }, 2000);
        }
    };

    const signSignature = async () => {
        try {
            //provider
            const provider = window?.phantom?.solana;

            const msg =
                "Para evitar el fraude, por favor, firme este mensaje con su billetera Solana.";
            const encodeMessage = new TextEncoder().encode(msg);
            const signedMessage = await provider.request({
                method: "signMessage",
                params: {
                    message: encodeMessage,
                    display: "UTF-8",
                },
            });

            window.localStorage.setItem("signature", signedMessage.signature);
        } catch (error) {
            console.error("ERRROR SIGNATURE", error);
            toast.error("Something went wrong signing the message");
        }
    };

    const sendTransaction = async (price) => {
        try {
            //provider
            const provider = window?.phantom?.solana;

            await signSignature();

            //connection
            const connection = new Connection(
                clusterApiUrl(SOLANA_NETWORK),
                "confirmed"
            );

            //keys
            const fromPubkey = new PublicKey(publicKey);
            const toPubkey = new PublicKey(treasuryPublicKey);

            //getbalance
            // const balance = await connection.getBalance(new PublicKey(publicKey));

            // //check if it has enough balance
            // if (balance < LAMPORTS_PER_SOL * price) {
            //   toast.error("You don't have enough balance");
            //   return;
            // }

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports: LAMPORTS_PER_SOL * price, // 1 SOL
                })
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;

            //sign transaction
            const transactionsignature = await provider.signTransaction(
                transaction
            );

            //send transaction
            const txid = await connection.sendRawTransaction(
                transactionsignature.serialize()
            );
            console.info(`Transaction ${txid} sent`);

            //wait for confirmation
            const confirmation = await connection.confirmTransaction(txid, {
                commitment: "singleGossip",
            });

            const { slot } = confirmation.value;

            console.info(`Transaction ${txid} confirmed in block ${slot}`);

            const solanaExplorerLink = `https://explorer.solana.com/tx/${txid}?cluster=devnet`;
            return solanaExplorerLink;
        } catch (error) {
            console.error("ERROR SEND TRANSACTION", error);
            throw new Error("Something went wrong sending the transaction");
        }
    };

    //truncate function for public key
    const truncateWalletAddress = (address) => {
        let firstFour = address?.substring(0, 4);
        let lastFour = address?.substring(address?.length - 4);
        return firstFour + "..." + lastFour;
    };

    const updateEmailAndName = (name, email) => {
        if (window) {
            window.localStorage.setItem("email", email);
            window.localStorage.setItem("name", name);
            setEmail(email);
            setName(name);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                publicKey,
                truncatePublicKey,
                signature,
                signIn,
                signOut,
                sendTransaction,
                signSignature,
                name,
                email,
                updateEmailAndName,
                isMinted,
                setIsMinted,
                LAMPORTS_PER_SOL,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;
