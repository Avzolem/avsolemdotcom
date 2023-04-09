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

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Hero() {
    return (
        <div className="relative">
            <main className="lg:relative">
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
                                    src="/images/andres.jpeg"
                                    className="w-[40rem] rounded-lg shadow-2xl "
                                />
                            </div>

                            {/* Aqui va el texto */}
                            <div className="m-auto">
                                <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                                    <span className=" text-primary xl:inline">
                                        Hi, i'm Andrés Aguilar{" "}
                                    </span>{" "}
                                </h1>
                                <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                    <span className=" bg-accent bg-clip-text text-transparent xl:inline">
                                        Tech Enthusiast & Web Developer 🦈{" "}
                                    </span>
                                </h1>
                            </div>
                        </div>
                    </div>
                </section>
                <br />
                <br />

                {/*  simple title center text center*/}

                <section className="relative">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl sm:text-center">
                            <h2 className="text-5xl font-bold  text-primary">
                                This Site is Under Construction
                            </h2>

                            <p className="mt-6 text-2xl font-semibold text-secondary">
                                I'm currently working on this site, so please
                                check back later for updates!
                            </p>
                            <br />
                        </div>
                    </div>
                </section>

                <br />
                <br />

                {/*  simple title center text center*/}

                <section className="relative">
                    <br />
                    <br />
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl sm:text-center">
                            <h2 className="font-semibold leading-7 text-primary">
                                Powered by
                            </h2>
                            <div className="relative mx-auto flex justify-center overflow-hidden ">
                                {" "}
                                <img
                                    src="https://solana.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdark-horizontal.e4df684f.svg&w=256&q=75"
                                    className=" w-[15rem]  "
                                />
                            </div>

                            <p className="mt-6 text-lg leading-8 text-base-content">
                                With all the power of the Solana blockchain to
                                create a user experience matchless.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
