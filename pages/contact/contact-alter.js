import MainLayout from "@/components/layouts/MainLayout";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
import LoadingCircle from "@/components/common/LoadingCircle";
import toast from "react-hot-toast";
import {
    Input,
    PhoneInput,
    TextArea,
    CheckBox,
    Select,
} from "@/components/forms/fields";

const ContactPage = () => {
    const [image, setImage] = useState(null);
    const [loading, setloading] = useState(false);

    //Esto es para subir la imagen a cloudinary

    const uploadImage = async (e) => {
        const files = e.target.files;
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "hybrida_upload");
        setloading(true);

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/ddxpbfk8t/image/upload",
            {
                method: "POST",
                body: data,
            }
        );

        const file = await res.json();
        setImage(file.secure_url);
        setloading(false);
    };

    //.......................................................

    const {
        register,
        clearErrors,
        setError,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const [submitLoading, setSubmitLoading] = useState(false);

    const countryWatch = watch("phoneCountry");
    const phoneWatch = watch("phone");

    const validatePhone = async (phone, country) => {
        const isValidNumber = isValidPhoneNumber(phone, country);
        if (!isValidNumber) {
            setError("phone", {
                type: "manual",
                message: "Número de teléfono no válido",
            });
        } else {
            clearErrors("phone");
        }
    };

    useEffect(() => {
        //every time the country select changes, we need to revalidate...
        if (countryWatch) {
            validatePhone(phoneWatch, countryWatch);
        }
    }, [countryWatch]);

    // SUBMIT FUNCTION
    const onSubmit = async (data) => {
        //DO WHATEVER YOU WANT HERE
        setSubmitLoading(true);
        const { phoneCountry, phone } = data;

        //validate phone
        const isValidNumber = isValidPhoneNumber(phone, phoneCountry);

        if (!isValidNumber) {
            toast.error("Número de teléfono no válido");
            return;
        }

        const phoneParsed = parsePhoneNumber(phone, phoneCountry);

        try {
            //send data to backend using axios
            const dataToSend = { ...data, phone: phoneParsed.number };
            await axios.post("/api/contact", { data: dataToSend });
            toast.success("Formulario enviado correctamente");

            setTimeout(() => {
                window.location.href = "/contact/success";
            }, 2000);
        } catch (error) {
            toast.error("Ocurrio un error al enviar el formulario");
        }

        setSubmitLoading(false);
    };

    return (
        <MainLayout
            title="Registro"
            description="Registrate en la convocatoria Hybrida 2023 de la UACH"
        >
            <div className="overflow-hidden bg-hybrida-bgblue py-16 px-4 sm:px-6 lg:px-8 lg:py-24">
                <div className="relative mx-auto max-w-xl">
                    <svg
                        className="absolute left-full translate-x-1/2 transform"
                        width={404}
                        height={404}
                        fill="none"
                        viewBox="0 0 404 404"
                        aria-hidden="true"
                    >
                        <defs>
                            <pattern
                                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                                x={0}
                                y={0}
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect
                                    x={0}
                                    y={0}
                                    width={4}
                                    height={4}
                                    className="text-hybrida-fuchsia"
                                    fill="currentColor"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width={404}
                            height={404}
                            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
                        />
                    </svg>
                    <svg
                        className="absolute right-full bottom-0 -translate-x-1/2 transform"
                        width={404}
                        height={404}
                        fill="none"
                        viewBox="0 0 404 404"
                        aria-hidden="true"
                    >
                        <defs>
                            <pattern
                                id="85737c0e-0916-41d7-917f-596dc7edfa27"
                                x={0}
                                y={0}
                                width={20}
                                height={20}
                                patternUnits="userSpaceOnUse"
                            >
                                <rect
                                    x={0}
                                    y={0}
                                    width={4}
                                    height={4}
                                    className="text-gray-200"
                                    fill="currentColor"
                                />
                            </pattern>
                        </defs>
                        <rect
                            width={404}
                            height={404}
                            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
                        />
                    </svg>
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-hybrida-fuchsia sm:text-4xl">
                            APLICA A HYBRIDA
                        </h2>
                        <p className="mt-4 text-lg leading-6 text-white">
                            Para aplicar:
                            <br />
                            1. Revisa detenidamente los términos de la
                            <a
                                className="text-sky-500"
                                href="http://www.hybrida.uach.mx/hybrida.pdf"
                            >
                                {" "}
                                convocatoria.
                            </a>
                            <br /> 2. Llena el formato que se presenta a
                            continuación.
                        </p>
                    </div>
                    <div className="mt-12">
                        {/* // FORMULARIO DE REGISTRO */}
                        <form onSubmit={handleSubmit(onSubmit)} className="">
                            <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-x-6 ">
                                {/* NOMBRE  */}
                                <Input
                                    label="Nombre(s)"
                                    name="firstName"
                                    type="text"
                                    register={{
                                        ...register("firstName", {
                                            required: {
                                                value: true,
                                                message: "Nombre es requerido",
                                            },
                                        }),
                                    }}
                                    errorMessage={errors.firstName?.message}
                                />
                                {/* APELLIDO  */}
                                <Input
                                    label="Apellido(s)"
                                    name="lastName"
                                    type="text"
                                    register={{
                                        ...register("lastName", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Apellido es requerido",
                                            },
                                        }),
                                    }}
                                    errorMessage={errors.lastName?.message}
                                />
                            </div>

                            <div className="w-full">
                                {/* EMAIL  */}
                                <Input
                                    label="Email"
                                    name="email"
                                    type="text"
                                    register={{
                                        ...register("email", {
                                            required: {
                                                value: true,
                                                message: "Email es requerido",
                                            },
                                            pattern: {
                                                value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/i,
                                                message: "Email Inválido",
                                            },
                                        }),
                                    }}
                                    errorMessage={errors.email?.message}
                                />
                            </div>
                            {/* TELEFONO */}
                            <PhoneInput
                                label="Número de teléfono"
                                name="phone"
                                type="tel"
                                onChange={(e) => {
                                    validatePhone(e.target.value, countryWatch);
                                }}
                                selectRegister={{
                                    ...register("phoneCountry", {
                                        required: {
                                            value: true,
                                            message:
                                                "El código de país es requerido",
                                        },
                                    }),
                                }}
                                register={{
                                    ...register("phone", {
                                        required: {
                                            value: true,
                                            message:
                                                "El número de teléfono es requerido",
                                        },
                                    }),
                                }}
                                errorMessage={errors.phone?.message}
                            />

                            {/* CATEGORIA DE TU TRABAJO  */}

                            <div className="w-full">
                                <Input
                                    label="Categoría de tu trabajo (opcional):"
                                    name="category"
                                    type="text"
                                    register={{
                                        ...register("category", {}),
                                    }}
                                    errorMessage={errors.category?.message}
                                />
                            </div>

                            {/* AQUI HAY QUE SUBIR TRES EJEMPLOS DE TU TRABAJO */}

                            <div className="w-full text-sm font-medium text-hybrida-fuchsia">
                                <h1>
                                    Ejemplos de tu trabajo con tu nombre: <br />
                                    Tres ejemplos, PNG, JPG, GIF. Tamaño Máx. 3
                                    MB c/u,
                                    <br />
                                </h1>
                                <br />

                                <input
                                    type="file"
                                    name="file1"
                                    placeholder="Subir un archivo"
                                    onChange={uploadImage}
                                    required
                                />
                                <br />
                                <br />
                                <input
                                    type="file"
                                    name="file2"
                                    placeholder="Subir un archivo"
                                    onChange={uploadImage}
                                    required
                                />
                                <br />
                                <br />
                                <input
                                    type="file"
                                    name="file3"
                                    placeholder="Subir un archivo"
                                    onChange={uploadImage}
                                    required
                                />
                                <br />
                                <br />
                                {loading ? (
                                    <h3>Loading...</h3>
                                ) : (
                                    <img
                                        src={image}
                                        style={{ width: "100px" }}
                                    />
                                )}

                                {/* <Input
                                    label="Ejemplos de tu trabajo: (Tres ejemplos, PNG, JPG, GIF. Tamaño Máx. 3 MB c/u)"
                                    name="message"
                                    type="text"
                                    register={{
                                        ...register("message", {}),
                                    }}
                                    errorMessage={errors.category?.message}
                                /> */}
                            </div>

                            {/* LINK A PORTAFOLIO */}

                            <div className="w-full">
                                <Input
                                    label="Link a portafolio o descarga adicional (opcional):"
                                    name="portafolio"
                                    type="text"
                                    placeholder="Cualquier elemento adicional que nos permita conocer mejor tu trabajo."
                                    register={{
                                        ...register("portafolio", {}),
                                    }}
                                    errorMessage={errors.message?.message}
                                />
                            </div>
                            {/* MOTIVOS PARA PARTICIPAR */}

                            <div className="w-full">
                                <TextArea
                                    minlength="3"
                                    label="Motivos para participar: (obligatorio, min 300 caracteres)"
                                    name="motivos"
                                    type="text"
                                    register={{
                                        ...register("motivos", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Este campo es requerido",
                                            },
                                        }),
                                    }}
                                    errorMessage={errors.message?.message}
                                />
                            </div>
                            {/*COMO TE ENTERASTE  */}

                            <div className="w-full">
                                <TextArea
                                    label="¿Cómo te enteraste de HYBRIDA?"
                                    name="comoteenteraste"
                                    type="text"
                                    register={{
                                        ...register("comoteenteraste", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Este campo es requerido",
                                            },
                                        }),
                                    }}
                                    errorMessage={errors.message?.message}
                                />
                            </div>

                            {/*ERES ALUMNO DE LA UACH?  */}

                            <div className="w-full">
                                <Select
                                    type="text"
                                    label="¿Eres alumno, egresado o trabajas en la UACH?"
                                    name="alumno"
                                    register={{
                                        ...register("alumno", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Este campo es requerido",
                                            },
                                        }),
                                    }}
                                    errorMessage={errors.message?.message}
                                />
                            </div>

                            {/* CHECKBOXES */}

                            {/* CHECKBOX 1 */}
                            <div className="w-full">
                                <CheckBox
                                    label="Manifiesto que la obra adjunta es mi trabajo original."
                                    name="terms"
                                    register={{
                                        ...register("terms", {
                                            required: {
                                                value: true,
                                                message:
                                                    "Debes aceptar los términos",
                                            },
                                        }),
                                    }}
                                    errorMessage={errors.terms?.message}
                                />
                            </div>
                            {/* CHECKBOX 2*/}
                            <div className="w-full ">
                                <div className="flex">
                                    <CheckBox
                                        label="He leído y acepto los términos de la "
                                        name="terms"
                                        register={{
                                            ...register("termstwo", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Debes aceptar los términos",
                                                },
                                            }),
                                        }}
                                        errorMessage={errors.termstwo?.message}
                                    />
                                    <a
                                        href="/privacy"
                                        className="block text-sm font-medium text-blue-300 hover:text-blue-100"
                                    >
                                        {" "}
                                        &nbsp; Convocatoria
                                    </a>
                                </div>
                            </div>
                            {/* CHECKBOX 3 */}
                            <div className="w-full">
                                <div className="flex">
                                    <CheckBox
                                        label="Acepto los términos del "
                                        name="terms"
                                        register={{
                                            ...register("termsthree", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Debes aceptar los términos",
                                                },
                                            }),
                                        }}
                                        errorMessage={
                                            errors.termsthree?.message
                                        }
                                    />
                                    <a
                                        href="https://uach.mx/visitantes/privacidad-y-politicas-institucionales-para-el-uso-de-la-pagina-web/"
                                        className="block text-sm font-medium text-blue-300 hover:text-blue-100"
                                    >
                                        {" "}
                                        &nbsp; Aviso de Privacidad
                                    </a>
                                </div>
                            </div>
                            {/* BOTON  */}

                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-hybrida-fuchsia px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? (
                                        <div>
                                            <LoadingCircle />
                                        </div>
                                    ) : (
                                        "Enviar mi aplicacion."
                                    )}
                                </button>
                                <input
                                    type="hidden"
                                    name="_captcha"
                                    value="false"
                                ></input>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ContactPage;
