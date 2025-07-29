'use client'

import { AuthContext } from "@/components/AuthProvider";
import { useContext } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { useStorageUpload } from "@thirdweb-dev/react";
import toast, { Toaster } from "react-hot-toast";

const price = process.env.NEXT_PUBLIC_MINTING_PRICE;
const SOLANA_NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK;

const WalletStep = () => {
    const {
        signIn,
        signOut,
        name,
        email,
        isMinted,
        setIsMinted,
        publicKey,
        truncatePublicKey,
        sendTransaction,
    } = useContext(AuthContext);

    const [isLoading, setIsLoading] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [solanaExplorerLink, setSolanaExplorerLink] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");

    const { mutateAsync: upload } = useStorageUpload();

    const uploadToIpfs = async (file: File) => {
        const uploadUrl = await upload({
            data: [file],
            options: {
                uploadWithGatewayUrl: true,
                uploadWithoutDirectory: true,
            },
        });
        return uploadUrl[0];
    };

    const generateCertificate = async () => {
        setIsLoading(true);

        try {
            let file = null;

            setStatusText("Generando tu NFT 📃 ");
            const cloudinaryURL = `https://res.cloudinary.com/dyalnhdcl/image/upload/v1683376579/Design_n_Blockchain_riguu0.png`;

            await fetch(cloudinaryURL)
                .then((res) => res.blob())
                .then((myBlob) => {
                    myBlob.name = "certificado.png";

                    file = new File([myBlob], "image.png", {
                        type: myBlob.type,
                    });
                });

            const uploadUrl = await uploadToIpfs(file!);

            const mintedData = {
                name,
                imageUrl: uploadUrl,
                publicKey,
            };

            setStatusText("Emitiendo tu NFT en la blockchain de Solana 🚀");

            const { data } = await axios.post("/api/mintnft", mintedData);
            const { signature: newSignature } = data;

            const solanaExplorerUrl = `https://solscan.io/tx/${newSignature}?cluster=${SOLANA_NETWORK}`;

            setUploadUrl(uploadUrl);
            setSolanaExplorerLink(solanaExplorerUrl);

            setStatusText(
                "¡Listo! Tu NFT ha sido emitido, revisa tu Phantom Wallet 👻"
            );
        } catch (error) {
            console.error("Error al generar el certificado", error);
            toast.error(
                "Ocurrió un error al generar el certificado, intenta de nuevo 😢"
            );
        }

        setStatusText("");
        setIsLoading(false);
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-black ">
            <span className="text-white text-8xl pb-7 font-bold">
                Design n' Blockchain
            </span>{" "}
            <Image src="/images/cubos.png" className="w-[300px] h-[300px] mb-4" alt="cubos" width={300} height={300} />
            <br />
            {publicKey ? (
                <>
                    {!isLoading && (
                        <>
                            {solanaExplorerLink ? (
                                <div className="successcontainer text-center">
                                    {uploadUrl && (
                                        <Image
                                            src={uploadUrl}
                                            alt="Certificado"
                                            className="w-[400px] h-[400px] mb-4"
                                            width={400}
                                            height={400}
                                        />
                                    )}
                                    <p className="text-white text-3xl font-bold">
                                        Tu NFT ha sido emitido 🎉{" "}
                                    </p>{" "}
                                    <p className="text-white text-3xl font-bold ">
                                        Revisa tu phantom wallet 👻{" "}
                                    </p>{" "}
                                    <p className="text-white font-bold my-2">
                                        Revisa la transacción en{" "}
                                        <a
                                            href={solanaExplorerLink}
                                            target="_blank"
                                            className="text-emerald-400 underline"
                                        >
                                            Solana Explorer
                                        </a>
                                    </p>
                                    <br />
                                    <button
                                        className="inline-flex  items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                        onClick={() => {
                                            signOut();
                                        }}
                                    >
                                        Desconectar Wallet
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <p className="text-white text-3xl font-bold">
                                        Tu Wallet está conectada 🙌🏼
                                    </p>{" "}
                                    <br />
                                    <p className="text-white font-bold">
                                        {publicKey.toString()}
                                    </p>
                                </>
                            )}
                        </>
                    )}

                    <br />
                    {isLoading && statusText && (
                        <div className="wrapersin flex flex-col items-center justify-center">
                            <div className="loading flex">
                                <LoadingCircle className="m-0 p-0" />
                            </div>
                            <div className="statustextcontainer mt-4">
                                <p className="text-white text-2xl font-bold mb-8">
                                    {statusText}
                                </p>
                                <p className="text-red-600 italic mb-8 text-lg">
                                    ⚠️ Por favor no cierres esta ventana hasta
                                    que se complete el proceso
                                </p>
                            </div>
                        </div>
                    )}

                    {!isLoading && !solanaExplorerLink && (
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                className="inline-flex  items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                                disabled={isLoading}
                                onClick={() => {
                                    generateCertificate();
                                }}
                            >
                                Canjear NFT del Evento 🎟
                            </button>
                        </div>
                    )}

                    <br />
                    {!isLoading && !solanaExplorerLink && (
                        <button
                            className="inline-flex  items-center justify-center rounded-md border border-transparent bg-white px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            onClick={() => {
                                signOut();
                            }}
                        >
                            Desconectar Wallet
                        </button>
                    )}
                </>
            ) : (
                <>
                    <div className="labellegend text-center text-3xl">
                        <p className="text-white text-center mb-4 uppercase font-bold">
                            Gracias por asistir al evento de Design 'n
                            Blockchain
                        </p>
                        <p className="text-white italic text-lg mb-4">
                            Por favor conecta tu wallet en el botón de abajo
                            para canjear tu nft del evento
                        </p>
                    </div>
                    <br />
                    <button
                        type="submit"
                        className="inline-flex  items-center justify-center rounded-md border border-transparent bg-white px-12 py-6 text-2xl font-medium text-black shadow-sm hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                        disabled={isLoading}
                        onClick={() => {
                            signIn();
                        }}
                    >
                        Conecta tu wallet 👻
                    </button>
                    <br />
                    <h1 className="text-white text-center text-base mt-4">
                        <Link href="/" className="text-purple-400 underline">
                            Regresar a la página principal
                        </Link>
                    </h1>
                </>
            )}
            <Toaster position="bottom-center" />
        </div>
    );
};

export default WalletStep;