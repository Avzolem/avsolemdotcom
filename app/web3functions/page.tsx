'use client'

import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Connection,
    SystemProgram,
    Transaction,
    PublicKey,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    SendTransactionError,
} from "@solana/web3.js";
import { useStorageUpload } from "@thirdweb-dev/react";

import axios from "axios";

const SOLANA_NETWORK = "devnet";

const Home = () => {
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [receiver, setReceiver] = useState<string | null>(null);
    const [amount, setAmount] = useState<number | null>(null);
    const [explorerLink, setExplorerLink] = useState<string | null>(null);

    const [uploadUrl, setUploadUrl] = useState<string | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [statusText, setStatusText] = useState("");

    useEffect(() => {
        let key = window.localStorage.getItem("publicKey");
        setPublicKey(key);
        if (key) getBalances(key);
        if (explorerLink) setExplorerLink(null);
    }, []);

    const handleReceiverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReceiver(event.target.value);
    };

    const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(Number(event.target.value));
    };

    const handleSubmit = async () => {
        console.log("Este es el receptor", receiver);
        console.log("Este es el monto", amount);
        sendTransaction();
    };

    const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(event.target.value);
        console.log("Si se esta seteando la URL", url);
    };

    const signIn = async () => {
        const provider = (window as any)?.phantom?.solana;
        const { solana } = window as any;

        if (!provider?.isPhantom || !solana.isPhantom) {
            toast.error("Phantom no esta instalado");
            setTimeout(() => {
                window.open("https://phantom.app/", "_blank");
            }, 2000);
            return;
        }
        let phantom;
        if (provider?.isPhantom) phantom = provider;

        const { publicKey } = await phantom.connect();
        console.log("publicKey", publicKey.toString());
        setPublicKey(publicKey.toString());
        window.localStorage.setItem("publicKey", publicKey.toString());

        toast.success("Tu Wallet esta conectada 👻");

        getBalances(publicKey);
    };

    const signOut = async () => {
        if (window) {
            const { solana } = window as any;
            window.localStorage.removeItem("publicKey");
            setPublicKey(null);
            solana.disconnect();
            router.refresh();
        }
    };

    const getBalances = async (publicKey: string) => {
        try {
            const connection = new Connection(
                clusterApiUrl(SOLANA_NETWORK),
                "confirmed"
            );

            const balance = await connection.getBalance(
                new PublicKey(publicKey)
            );

            const balancenew = balance / LAMPORTS_PER_SOL;
            setBalance(balancenew);
        } catch (error) {
            console.error("ERROR GET BALANCE", error);
            toast.error("Something went wrong getting the balance");
        }
    };

    const sendTransaction = async () => {
        try {
            if (!publicKey || !receiver || !amount) return;
            
            getBalances(publicKey);
            console.log("Este es el balance", balance);

            if (balance < amount) {
                toast.error("No tienes suficiente balance");
                return;
            }

            const provider = (window as any)?.phantom?.solana;
            const connection = new Connection(
                clusterApiUrl(SOLANA_NETWORK),
                "confirmed"
            );

            const fromPubkey = new PublicKey(publicKey);
            const toPubkey = new PublicKey(receiver);

            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey,
                    toPubkey,
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );
            console.log("Esta es la transaccion", transaction);

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = fromPubkey;

            const transactionsignature = await provider.signTransaction(
                transaction
            );

            const txid = await connection.sendRawTransaction(
                transactionsignature.serialize()
            );
            console.info(`Transaccion con numero de id ${txid} enviada`);

            const confirmation = await connection.confirmTransaction(txid, "confirmed");

            console.info(
                `Transaccion con numero de id ${txid} confirmado`
            );

            const solanaExplorerLink = `https://explorer.solana.com/tx/${txid}?cluster=${SOLANA_NETWORK}`;
            setExplorerLink(solanaExplorerLink);

            toast.success("Transaccion enviada con exito :D ");

            getBalances(publicKey);
            setAmount(null);
            setReceiver(null);

            return solanaExplorerLink;
        } catch (error) {
            console.error("ERROR SEND TRANSACTION", error);
            toast.error("Error al enviar la transaccion");
        }
    };

    const { mutateAsync: upload } = useStorageUpload();

    const uploadToIpfs = async (file: File) => {
        setStatusText("Subiendo a IPFS...");
        const uploadUrl = await upload({
            data: [file],
            options: {
                uploadWithGatewayUrl: true,
                uploadWithoutDirectory: true,
            },
        });
        return uploadUrl[0];
    };

    const urlToBLob = async () => {
        if (!url) return;
        
        setStatusText("Transformando url...");
        let file: File | null = null;
        
        await fetch(url)
            .then((res) => res.blob())
            .then((myBlob) => {
                file = new File([myBlob], "image.png", {
                    type: myBlob.type,
                });
            });

        const uploadUrl = await uploadToIpfs(file!);
        console.log("uploadUrl", uploadUrl);

        setStatusText(`La url de tu archivo es: ${uploadUrl} `);
        setUploadUrl(uploadUrl);

        return uploadUrl;
    };

    const generateNFT = async () => {
        try {
            setStatusText("Creando tu NFT...❤");
            const mintedData = {
                name: "Mi primer NFT con Superteam MX",
                imageUrl: uploadUrl,
                publicKey,
            };
            console.log("Este es el objeto mintedData:", mintedData);
            setStatusText(
                "Minteando tu NFT en la blockchain Solana 🚀 Porfavor espera..."
            );
            const { data } = await axios.post("/api/mintnft", mintedData);
            const { signature: newSignature } = data;
            const solanaExplorerUrl = `https://solscan.io/tx/${newSignature}?cluster=${SOLANA_NETWORK}`;
            console.log("solanaExplorerUrl", solanaExplorerUrl);
            setStatusText(
                "¡Listo! Tu NFT se a creado, revisa tu Phantom Wallet 🖖"
            );
        } catch (error) {
            console.error("ERROR GENERATE NFT", error);
            toast.error("Error al generar el NFT");
        }
    };

    return (
        <div className="h-screen bg-black">
            <div className="flex flex-col  w-auto h-auto  bg-black">
                <div className="flex flex-col py-24 place-items-center justify-center">
                    <h1 className="text-5xl font-bold  text-orange-400 rounded-md">
                        Web3 Functions Test
                    </h1>
                    <br />

                    {publicKey ? (
                        <div className="flex flex-col py-24 place-items-center justify-center">
                            <h1 className="text-2xl font-bold text-white">
                                Tu numero de Wallet es {publicKey}
                            </h1>
                            <br />
                            <h1 className="text-2xl font-bold text-white">
                                Tu balance es {balance} SOL
                            </h1>
                            <br />
                            <h1 className="text-2xl  text-white">
                                Enviar una transaccion a:
                            </h1>
                            <input
                                className="h-8 w-72 mt-4   border-2 border-black "
                                type="text"
                                onChange={handleReceiverChange}
                            />
                            <br />
                            <h1 className="text-2xl  text-white">
                                Cantidad de SOL a enviar:
                            </h1>
                            <input
                                className="h-8 w-72 mt-4   border-2 border-black "
                                type="text"
                                onChange={handleAmountChange}
                            />
                            <br />
                            <button
                                type="submit"
                                className="inline-flex h-8 w-52 justify-center bg-orange-600 rounded-md font-bold text-white"
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                Enviar
                            </button>
                            <br />
                            <a href={explorerLink || "#"}>
                                <h1 className="text-md font-bold text-sky-500">
                                    {explorerLink}
                                </h1>
                            </a>
                            <br />

                            <h1 className="text-2xl  text-white">
                                Url del archivo que quieres subir:
                            </h1>
                            <input
                                className="h-8 w-52 mt-4 border-2 border-black"
                                type="float"
                                onChange={handleUrlChange}
                            />
                            <br />
                            <button
                                className="inline-flex h-8 w-52 justify-center bg-orange-600 rounded-md font-bold text-white"
                                onClick={() => {
                                    urlToBLob();
                                }}
                            >
                                Subir archivo a IPFS
                            </button>
                            <br />
                            <p className="text-white font-bold mb-8">
                                {statusText}
                            </p>
                            <br />
                            {uploadUrl ? (
                                <button
                                    className="inline-flex h-8 w-52 justify-center bg-orange-600 rounded-md font-bold text-white"
                                    onClick={() => {
                                        generateNFT();
                                    }}
                                >
                                    Crear NFT 🔥
                                </button>
                            ) : (
                                <button
                                    className="inline-flex h-8 w-auto justify-center rounded-md bg-red-500 font-bold text-white"
                                    onClick={() => {
                                        toast.error(
                                            "Primero sube una imagen a IPFS"
                                        );
                                    }}
                                >
                                    Primer sube una imagen a IPFS ⚠
                                </button>
                            )}
                            <br />
                            <button
                                type="submit"
                                className="inline-flex h-8 w-52 justify-center bg-orange-600 rounded-md font-bold text-white"
                                onClick={() => {
                                    signOut();
                                }}
                            >
                                Desconecta tu wallet 👻
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col place-items-center justify-center">
                            <button
                                type="submit"
                                className="inline-flex h-8 w-52 justify-center bg-orange-600 rounded-md font-bold text-white"
                                onClick={() => {
                                    signIn();
                                }}
                            >
                                Conecta tu wallet 👻
                            </button>
                        </div>
                    )}
                </div>
                <Toaster position="bottom-center" />
            </div>
        </div>
    );
};

export default Home;