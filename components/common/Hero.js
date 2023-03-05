import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import { TicketIcon } from "@heroicons/react/solid";
import {
    ArrowPathIcon,
    CloudArrowUpIcon,
    Cog6ToothIcon,
    FingerPrintIcon,
    LockClosedIcon,
    ServerIcon,
} from "@heroicons/react/solid";

const feats = [
    {
        name: "Authenticity:",
        description:
            "EzTickets are unique and tied to a specific event, which means they are virtually impossible to falsify. This ensures that event attendees can be sure that their ticket is authentic and valid.",
        icon: TicketIcon,
    },
    {
        name: "Ease of transfer:",
        description:
            "EzTickets are easily transferable between people, meaning that if an attendee is unable to make it to the event, they can safely and easily sell or transfer their ticket.",
        icon: TicketIcon,
    },
    {
        name: "Access Control:",
        description:
            "Event organizers can use EzTickets to control access to the event and ensure that only people with valid tickets can enter. This can help prevent overcapacity and ensure attendee safety.",
        icon: TicketIcon,
    },
    {
        name: "Improve the attendee experience: ",
        description:
            " EzTickets can offer a more interactive and personalized experience for event attendees. For example, they can be used to offer exclusive content or to unlock special offers within the event.",
        icon: TicketIcon,
    },
    {
        name: "Registration and monitoring:",
        description:
            "EzTickets enable ticket ownership registration and tracking, which means event organizers can keep track of who has purchased a ticket and how many tickets have been sold in total. This can be helpful for future event planning and promotion.",
        icon: TicketIcon,
    },
    {
        name: "EzTickets:",
        description:
            "In short, EzTickets offer a secure, easy, and efficient way to manage event tickets and can significantly enhance the experience for both event organizers and attendees.",
        icon: TicketIcon,
    },
];

const features = [
    {
        name: "A safer ticket:",
        description:
            "Your tickets are safe on the Solana blockchain, nobody can modify or steal them.",
        icon: TicketIcon,
    },
    {
        name: "A unique ticket:",
        description:
            "EzTicket is a unique ticket, there are no copies, there are no counterfeits. We work with NFT technology.",
        icon: TicketIcon,
    },
    {
        name: "A ticket to the future:",
        description:
            "You can collect your Tickets and sell them in the future. You decide the price.",
        icon: TicketIcon,
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Hero() {
    return (
        <div className="relative">
            <main className="lg:relative">
                {/*  simple title to the right and image to the left*/}
                <section className="relative">
                    <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
                            <div className="relative isolate mx-auto max-w-2xl overflow-hidden sm:mx-0 sm:max-w-none">
                                {" "}
                                {/* Aqui va la imagen */}
                                <img
                                    src="/images/boletines.png"
                                    className="w-[40rem]  "
                                />
                            </div>

                            {/* Aqui va el texto */}
                            <div className="m-auto">
                                <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                    <span className=" text-white xl:inline">
                                        Discover Events{" "}
                                    </span>{" "}
                                </h1>
                                <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                    <span className=" bg-gradient-to-r  from-indigo-500  to-purple-500 bg-clip-text text-transparent xl:inline">
                                        Buy and sell{" "}
                                    </span>
                                    <span className=" bg-gradient-to-r  from-emerald-500 via-indigo-500  to-purple-500 bg-clip-text text-transparent xl:inline">
                                        EzTickets{" "}
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>
                <br />
                <br />
                <br />
                <br />

                {/* Seccion de Features */}
                <section>
                    {" "}
                    <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
                            <div className="px-6 lg:px-0 lg:pt-4 lg:pr-4">
                                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
                                    <h2 className="text-base font-semibold leading-7 text-purple-500">
                                        Jump in to Web3
                                    </h2>
                                    <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                        A ticket with all the security of
                                        blockchain
                                    </p>
                                    <p className="mt-6 text-lg leading-8 text-white">
                                        Create events and manage them safe and
                                        simple, or discover the events in your
                                        city.
                                    </p>
                                    <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-white lg:max-w-none">
                                        {features.map((feature) => (
                                            <div
                                                key={feature.name}
                                                className="relative pl-9"
                                            >
                                                <dt className="inline font-semibold text-white">
                                                    <feature.icon
                                                        className="absolute top-1 left-1 h-5 w-5 text-indigo-600"
                                                        aria-hidden="true"
                                                    />
                                                    {feature.name}
                                                </dt>{" "}
                                                <dd className="inline">
                                                    {feature.description}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                </div>
                            </div>
                            <div className="sm:px-6 lg:px-0">
                                <div className="relative isolate overflow-hidden bg-purple-500 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pt-16 sm:pl-16 sm:pr-0 lg:mx-0 lg:max-w-none">
                                    <div
                                        className="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white"
                                        aria-hidden="true"
                                    />
                                    <div className="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
                                        <img
                                            src="/images/lap.png"
                                            alt="Product screenshot"
                                            width={2432}
                                            height={1442}
                                            className="-mb-12 w-[57rem] max-w-none rounded-tl-xl bg-purple-700 ring-1 ring-white/10"
                                        />
                                    </div>
                                    <div
                                        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10 sm:rounded-3xl"
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <br />
                <br />
                <br />
                <br />
                {/*  simple title to the right and image to the left*/}
                <section className="relative">
                    <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
                            <div className="relative isolate mx-auto max-w-2xl overflow-hidden sm:mx-0 sm:max-w-none">
                                {" "}
                                {/* Aqui va la imagen */}
                                <img
                                    src="/images/herotablet.png"
                                    className="w-[40rem]  "
                                />
                            </div>

                            {/* Aqui va el texto */}
                            <div className="m-auto">
                                <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                    <span className=" text-white xl:inline">
                                        Manage your account{" "}
                                    </span>{" "}
                                </h1>
                                <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                    <span className=" bg-gradient-to-r  from-indigo-500  to-purple-500 bg-clip-text text-transparent xl:inline">
                                        Collect your{" "}
                                    </span>
                                    <span className=" bg-gradient-to-r  from-emerald-500 via-indigo-500  to-purple-500 bg-clip-text text-transparent xl:inline">
                                        EzTickets{" "}
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>
                <br />
                <br />
                <br />
                <br />

                {/*  simple title to the left and image to the right*/}
                <section className="relative">
                    <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-2 lg:items-start">
                            {/* Aqui va el texto */}
                            <div className="m-auto">
                                <h1 className="text-white-900  text-center text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                    <span className=" text-white xl:inline">
                                        Download the App{" "}
                                    </span>{" "}
                                </h1>
                                <br />
                                {/* Enlace de descarga de la app https://ezticket.vercel.app/resources/EzTicket.apk */}
                                <div className="relative mx-auto flex justify-center overflow-hidden ">
                                    <img
                                        src="/images/qr-code.png"
                                        className=" w-[12rem]"
                                    />
                                </div>
                                <br />
                                <h1 className="text-white-900 text-center text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                                    <span className=" bg-gradient-to-r  from-indigo-500  to-purple-500 bg-clip-text text-transparent xl:inline">
                                        Check the schedules, share your{" "}
                                    </span>
                                    <span className=" bg-gradient-to-r  from-emerald-500 via-indigo-500  to-purple-500 bg-clip-text text-transparent xl:inline">
                                        EzTickets{" "}
                                    </span>
                                    <span className=" bg-gradient-to-r  from-indigo-500  to-purple-500 bg-clip-text text-transparent xl:inline">
                                        on social networks.{" "}
                                    </span>
                                </h1>
                            </div>
                            {/* Aqui va la imagen */}
                            <div className="relative isolate mx-auto overflow-hidden sm:mx-0 sm:max-w-none">
                                {" "}
                                <img
                                    src="/images/herophone.png"
                                    className=" w-[40rem]  "
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <br />
                <br />
                <br />
                <br />

                {/*  simple title center text center*/}

                <section className="relative">
                    <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
                        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-300 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
                            {feats.map((feat) => (
                                <div key={feat.name} className="relative pl-9">
                                    <dt className="inline font-semibold text-white">
                                        <feat.icon
                                            className="absolute top-1 left-1 h-5 w-5 text-indigo-500"
                                            aria-hidden="true"
                                        />
                                        {feat.name}
                                    </dt>{" "}
                                    <dd className="inline">
                                        {feat.description}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                    <br />
                    <br />
                    <br />
                    <div className="relative overflow-hidden pt-16">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <img
                                src="/images/herolap.png"
                                alt="App screenshot"
                            />
                        </div>
                    </div>

                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl sm:text-center">
                            <h2 className="text-base font-semibold leading-7 text-indigo-400">
                                Powered by
                            </h2>
                            <div className="relative mx-auto flex justify-center overflow-hidden ">
                                {" "}
                                <img
                                    src="https://solana.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdark-horizontal.e4df684f.svg&w=256&q=75"
                                    className=" w-[15rem]  "
                                />
                            </div>

                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                With all the power of the Solana blockchain to
                                create a user experience matchless.
                            </p>
                            <br />
                            <br />
                            <h2 className="text-base font-semibold leading-7 text-indigo-400">
                                Developed by HackDogs
                            </h2>
                            <br />
                            <div className="relative mx-auto flex justify-center overflow-hidden ">
                                {" "}
                                <img
                                    src="/images/dogo.png"
                                    className=" w-[10rem]  "
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
