'use client'

import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

const WhatsappIndex = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: any) => {
        console.log("data =>", data);
        setLoading(true);

        const { to, message } = data;

        try {
            const waData = {
                to,
                message,
            };
            await axios.post("/api/sendwhatsapp", waData);
            toast.success("Mensaje enviado");
        } catch (error) {
            console.error("ocurrio un error", error);
            toast.error("Ocurrio un error");
        }
        setLoading(false);
    };

    return (
        <div className="megacontainer">
            <Toaster position="bottom-center" reverseOrder={false} />
            <div className="header flex w-full justify-center items-center my-2">
                <Image
                    src="/images/maracashark.png"
                    className="w-24"
                    alt="whatsapp"
                    width={96}
                    height={96}
                />
                <p className=" font-bold text-white text-6xl">
                    {" "}
                    &ensp; Whatsapp Masive Media Bulker
                </p>
            </div>
            <div className="formcontainer flex flex-col items-center justify-center">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="my-5 flex flex-col items-center">
                        <label className="font-bold text-white text-2xl my-2">
                            Numero de destino
                        </label>
                        <input
                            placeholder="+526141707685"
                            {...register("to", { required: true })}
                        />
                        {errors.to && (
                            <span className="text-red-400">
                                This field is required
                            </span>
                        )}
                    </div>

                    <div className="my-8 flex flex-col items-center justify-center">
                        <label className="font-bold text-white text-2xl my-2">
                            Mensaje
                        </label>
                        <textarea
                            className="block w-96 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Escribe tu aviso"
                            {...register("message", { required: true })}
                        />
                        {errors.message && (
                            <span className="text-red-400">
                                This field is required
                            </span>
                        )}
                        <br />
                        <br />
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                            <button
                                className="relative px-7 py-4 bg-black rounded-lg leading-none flex items-center divide-x divide-gray-600"
                                type="submit"
                                disabled={loading}
                            >
                                <span className="flex items-center">
                                    <span className="pr-6 font-bold text-gray-100">
                                        {loading ? "Cargando.." : "Enviar "}
                                    </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-7 w-7 text-pink-600 -rotate-6"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                        stroke="currentColor"
                                    >
                                        <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WhatsappIndex;