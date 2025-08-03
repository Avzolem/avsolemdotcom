'use client'

import MainLayout from "@/components/layouts/MainLayoutNew";
import dynamic from 'next/dynamic';

const ContactForm = dynamic(() => import('./ContactForm'), {
    ssr: false,
    loading: () => <div className="h-96 bg-base-200 rounded-lg animate-pulse" />
});

const ContactPage = () => {

    return (
        <div>
            <MainLayout childrenClassName="relative">
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
                                        className="text-primary"
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
                                        className="text-primary"
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
                            <span className=" bg-primary bg-clip-text text-transparent xl:inline">
                                Get in touch :D{" "}
                            </span>
                            <p className="mt-4 text-lg leading-6 text-secondary">
                                If you are interested in working with me, or
                                just want to say hi, you can contact me using
                                the form below.
                            </p>
                        </div>
                        <div className="mt-12">
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
};

export default ContactPage;