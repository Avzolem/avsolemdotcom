'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "@/utils/classNames";
import dynamic from 'next/dynamic';

const Switch = dynamic(() => import('@headlessui/react').then(mod => mod.Switch), {
    ssr: false,
    loading: () => <div className="h-6 w-11 bg-base-300 rounded-full animate-pulse" />
});

interface FormData {
    firstName: string;
    lastName: string;
    company: string;
    email: string;
    phone: string;
    message: string;
}

export default function ContactForm() {
    const [agreed, setAgreed] = useState(false);
    const [globalError, setGlobalError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setGlobalError("");
        if (!agreed) {
            setGlobalError("You must agree to the terms and conditions");
            return;
        }

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log("SUBMITTED DATA =>", data);
            reset();
            setAgreed(false);
            // Show success message
        } catch (error) {
            setGlobalError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
        >
            <div>
                <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-secondary"
                >
                    Name
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="firstName"
                        autoComplete="given-name"
                        className="input input-bordered w-full focus:input-primary"
                        {...register("firstName", {
                            required: {
                                value: true,
                                message: "First Name is required",
                            },
                        })}
                    />
                    {errors.firstName && (
                        <div className="mt-2 text-sm text-error">
                            {errors.firstName.message}
                        </div>
                    )}
                </div>
            </div>
            
            <div>
                <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-secondary"
                >
                    Last Name
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="lastName"
                        autoComplete="family-name"
                        className="input input-bordered w-full focus:input-primary"
                        {...register("lastName", {
                            required: {
                                value: true,
                                message: "Last Name is required",
                            },
                        })}
                    />
                    {errors.lastName && (
                        <div className="mt-2 text-sm text-error">
                            {errors.lastName.message}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="sm:col-span-2">
                <label
                    htmlFor="company"
                    className="block text-sm font-medium text-secondary"
                >
                    Company/Club
                </label>
                <div className="mt-1">
                    <input
                        type="text"
                        id="company"
                        autoComplete="organization"
                        className="input input-bordered w-full focus:input-primary"
                        {...register("company", {
                            required: {
                                value: true,
                                message: "Company is required",
                            },
                        })}
                    />
                    {errors.company && (
                        <div className="mt-2 text-sm text-error">
                            {errors.company.message}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="sm:col-span-2">
                <label
                    htmlFor="email"
                    className="block text-sm font-medium text-secondary"
                >
                    Email
                </label>
                <div className="mt-1">
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        className="input input-bordered w-full focus:input-primary"
                        {...register("email", {
                            required: {
                                value: true,
                                message: "Email is required",
                            },
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    {errors.email && (
                        <div className="mt-2 text-sm text-error">
                            {errors.email.message}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="sm:col-span-2">
                <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-secondary"
                >
                    Phone Number
                </label>
                <div className="mt-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                            <select
                                className="select select-ghost select-sm pl-3 pr-7 focus:outline-none"
                            >
                                <option>MX</option>
                                <option>US</option>
                                <option>CA</option>
                            </select>
                        </div>
                        <input
                            type="tel"
                            id="phone"
                            autoComplete="tel"
                            className="input input-bordered w-full pl-20 focus:input-primary"
                            placeholder="+52 (625) 121-7055"
                            {...register("phone", {
                                required: {
                                    value: true,
                                    message: "Phone is required",
                                },
                            })}
                        />
                    </div>
                    {errors.phone && (
                        <div className="mt-2 text-sm text-error">
                            {errors.phone.message}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="sm:col-span-2">
                <label
                    htmlFor="message"
                    className="block text-sm font-medium text-secondary"
                >
                    Message
                </label>
                <div className="mt-1">
                    <textarea
                        id="message"
                        rows={4}
                        className="textarea textarea-bordered w-full focus:textarea-primary"
                        {...register("message", {
                            required: {
                                value: true,
                                message: "Message is required",
                            },
                            minLength: {
                                value: 20,
                                message: "Minimum 20 characters",
                            },
                            maxLength: {
                                value: 500,
                                message: "Maximum 500 characters",
                            },
                        })}
                    />
                    {errors.message && (
                        <div className="mt-2 text-sm text-error">
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
                                agreed ? "bg-primary" : "bg-base-300",
                                "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            )}
                        >
                            <span className="sr-only">
                                Privacy Policy Agreement
                            </span>
                            <span
                                aria-hidden="true"
                                className={classNames(
                                    agreed ? "translate-x-5" : "translate-x-0",
                                    "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                                )}
                            />
                        </Switch>
                    </div>
                    <div className="ml-3">
                        <p className="text-base-content text-sm">
                            By selecting this, you agree to our{" "}
                            <a href="#" className="link link-primary">
                                Privacy Policy
                            </a>{" "}
                            and{" "}
                            <a href="#" className="link link-primary">
                                Cookie Policy
                            </a>
                            .
                        </p>
                        {globalError && (
                            <div className="mt-2 text-sm text-error">
                                {globalError}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="sm:col-span-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary w-full"
                >
                    {isSubmitting ? (
                        <>
                            <span className="loading loading-spinner"></span>
                            Sending...
                        </>
                    ) : (
                        "Let's Talk!"
                    )}
                </button>
            </div>
        </form>
    );
}