import MainLayout from "@/components/layouts/MainLayout";
import classNames from "@/utils/classNames";
import { useState } from "react";
import { Switch } from "@headlessui/react";
import { useForm } from "react-hook-form";
import ParticlesBackground from "../../components/common/ParticlesBackground";

const ContactPage = () => {
    const [agreed, setAgreed] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // SUBMIT FUNCTION
    const onSubmit = async (data) => {
        setGlobalError("");
        if (!agreed) {
            setGlobalError("You must agree to the terms and conditions");
            return;
        }

        //DO WHATEVER YOU WANT HERE
        console.log("SUBMITED DATA =>", data);
    };

    return (
        <div>
            <ParticlesBackground />
            <MainLayout className="relative">
                <div className="overflow-hidden py-16 px-4 sm:px-6 lg:px-8 lg:py-24">
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
                                        className="text-purple-200"
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
                                        className="text-purple-200"
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
                        <div className="text-center text-3xl font-extrabold  sm:text-4xl">
                            <h2 className="tracking-tight text-white ">
                                Do you want to create an event with{" "}
                            </h2>
                            <span className=" bg-gradient-to-r  from-emerald-500 via-indigo-500  to-purple-500 bg-clip-text text-transparent xl:inline">
                                EzTickets?{" "}
                            </span>
                            <p className="mt-4 text-lg leading-6 text-white">
                                If you are interested in holding an event with
                                us, get in touch with our sales team, for more
                                information.
                            </p>
                        </div>
                        <div className="mt-12">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
                            >
                                <div>
                                    <label
                                        htmlFor="firstName"
                                        className="block text-sm font-medium text-purple-500"
                                    >
                                        Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="firstName"
                                            id="firstName"
                                            autoComplete="given-name"
                                            className="block w-full rounded-md border-purple-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            {...register("firstName", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "First Name is required",
                                                },
                                            })}
                                        />
                                        {errors.firstName && (
                                            <div className="mt-3 text-sm text-red-600">
                                                {errors.firstName.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label
                                        htmlFor="lastName"
                                        className="block text-sm font-medium text-purple-500"
                                    >
                                        Last Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="lastName"
                                            id="lastName"
                                            autoComplete="family-name"
                                            className="block w-full rounded-md border-purple-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            {...register("lastName", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Last Name is required",
                                                },
                                            })}
                                        />
                                        {errors.lastName && (
                                            <div className="mt-3 text-sm text-red-600">
                                                {errors.lastName.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="company"
                                        className="block text-sm font-medium text-purple-500"
                                    >
                                        Company/Club
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="company"
                                            id="company"
                                            autoComplete="organization"
                                            className="block w-full rounded-md border-purple-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            {...register("company", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Company is required",
                                                },
                                            })}
                                        />
                                        {errors.company && (
                                            <div className="mt-3 text-sm text-red-600">
                                                {errors.company.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-purple-500"
                                    >
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            className="block w-full rounded-md border-purple-300 py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            {...register("email", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Email is required",
                                                },
                                            })}
                                        />
                                        {errors.email && (
                                            <div className="mt-3 text-sm text-red-600">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-purple-500"
                                    >
                                        Phone Number
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 flex items-center">
                                            <label
                                                htmlFor="country"
                                                className="sr-only"
                                            >
                                                Country
                                            </label>
                                            <select
                                                id="country"
                                                name="country"
                                                className="h-full rounded-md border-transparent bg-transparent py-0 pl-4 pr-8 text-purple-500 focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                <option>MX</option>
                                                <option>CA</option>
                                                <option>US</option>
                                            </select>
                                        </div>
                                        <input
                                            type="text"
                                            name="phone"
                                            id="phone"
                                            autoComplete="tel"
                                            className="block w-full rounded-md border-purple-300 py-3 px-4 pl-20 focus:border-emerald-500 focus:ring-emerald-500"
                                            placeholder="+1 (555) 987-6543"
                                            {...register("phone", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Teléfono es requerido",
                                                },
                                            })}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <div className="mt-3 text-sm text-red-600">
                                            {errors.phone.message}
                                        </div>
                                    )}
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="message"
                                        className="block text-sm font-medium text-purple-500"
                                    >
                                        Message
                                    </label>
                                    <div className="mt-1">
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            className="block w-full rounded-md border border-purple-300 py-3 px-4 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
                                            defaultValue={""}
                                            {...register("message", {
                                                required: {
                                                    value: true,
                                                    message:
                                                        "Mensaje es requerido",
                                                },
                                                min: {
                                                    value: 20,
                                                    message:
                                                        "Minimum 20 characters",
                                                },
                                                max: {
                                                    value: 280,
                                                    message:
                                                        "Maximum 280 characters",
                                                },
                                            })}
                                        />
                                        {errors.message && (
                                            <div className="mt-3 text-sm text-red-600">
                                                {errors.message.message}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <Switch
                                                checked={agreed}
                                                onChange={setAgreed}
                                                className={classNames(
                                                    agreed
                                                        ? "bg-emerald-600"
                                                        : "bg-purple-200",
                                                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                                )}
                                            >
                                                <span className="sr-only">
                                                    Privacy Policy Agreement
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className={classNames(
                                                        agreed
                                                            ? "translate-x-5"
                                                            : "translate-x-0",
                                                        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                                    )}
                                                />
                                            </Switch>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-base text-purple-500">
                                                By selecting this, you agree to
                                                our{" "}
                                                <a
                                                    href="#"
                                                    className="font-medium text-indigo-500 underline"
                                                >
                                                    Privacy Policy
                                                </a>{" "}
                                                and{" "}
                                                <a
                                                    href="#"
                                                    className="font-medium text-indigo-500 underline"
                                                >
                                                    Cookies Policy
                                                </a>
                                                .
                                            </p>
                                            {globalError && (
                                                <div className="mt-3 text-sm text-red-600">
                                                    {globalError}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                    >
                                        ¡Let's Talk!
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
};

export default ContactPage;
