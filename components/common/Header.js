/* eslint-disable @next/next/no-img-element */
import { Fragment, useState } from "react";
import Link from "next/link";
import { Popover, Transition, Menu } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

//HEADER SETUP
const logoUrl = "/logo.png";

const navigation = {
    categories: [],
    pages: [
        // { name: "CV", href: "/cv" },
        { name: "CONTACT", href: "/contact" },
        // { name: "CANDY MACHINE", href: "/candymachine" },
        // { name: "UTILITIES", href: "/utilities" },
        { name: "TOOLBOX", href: "/" },
        { name: "PROJECTS", href: "https://github.com/Avzolem" },
        { name: "NFTS", href: "/nfts" },
    ],
};
let phantom;

const Header = () => {
    return (
        <Popover className="relative ">
            <div
                className="pointer-events-none absolute inset-0 z-20 shadow "
                aria-hidden="true"
            />
            <div className="relative z-20  bg-base-100">
                {/* DESKTOP */}
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-4   md:justify-start md:space-x-10 lg:px-8">
                    <div>
                        <Link href="/" className="flex">
                            {/* <img
                                className="h-8 mx-2 w-auto sm:h-10"
                                src={logoUrl}
                                alt="Avsolem logo"
                            /> */}
                            <div className="font-bold text-primary inline-flex text-lg transition-all duration-200 md:text-3xl">
                                <span className="">Avso</span>
                                <span className="text-secondary">lem 🦈</span>
                            </div>
                        </Link>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-between  ">
                        <Popover.Group as="nav" className="flex space-x-5">
                            {navigation.pages.map((page) => (
                                <Link
                                    key={page.name}
                                    href={page.href}
                                    className="text-base hover:text-accent font-medium text-primary"
                                >
                                    {page.name}
                                </Link>
                            ))}
                        </Popover.Group>
                        {/* HEADER DESKTOP RIGHT SECTION BUTTONS */}

                        <div
                            title="Change Theme"
                            class=" dropdown dropdown-end"
                        >
                            <div tabindex="0" class="btn normal-case btn-ghost">
                                <svg
                                    width="20"
                                    height="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    class="h-5 w-5 stroke-current"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                    ></path>
                                </svg>{" "}
                                <span class="hidden font-normal md:inline">
                                    Theme
                                </span>{" "}
                                <svg
                                    width="12px"
                                    height="12px"
                                    class="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 2048 2048"
                                >
                                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                                </svg>
                            </div>{" "}
                            <div class="dropdown-content bg-base-200 text-base-content rounded-box top-px h-[70vh] max-h-96 w-56 overflow-y-auto shadow mt-16">
                                <div
                                    class="grid grid-cols-1 gap-3 p-3"
                                    tabindex="0"
                                >
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="avsolem"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="avsolem"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        avsolem
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="dark"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="dark"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        dark
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="cupcake"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="cupcake"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        cupcake
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="bumblebee"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="bumblebee"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        bumblebee
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="emerald"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="emerald"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        emerald
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left [&amp;_svg]:visible"
                                        data-set-theme="corporate"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="corporate"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        corporate
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="synthwave"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="synthwave"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        synthwave
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="retro"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="retro"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        retro
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="cyberpunk"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="cyberpunk"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        cyberpunk
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="valentine"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="valentine"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        valentine
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="halloween"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="halloween"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        halloween
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="garden"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="garden"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        garden
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="forest"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="forest"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        forest
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="aqua"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="aqua"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        aqua
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="lofi"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="lofi"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        lofi
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="pastel"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="pastel"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        pastel
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="fantasy"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="fantasy"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        fantasy
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="wireframe"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="wireframe"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        wireframe
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="black"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="black"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        black
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="luxury"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="luxury"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        luxury
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="dracula"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="dracula"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        dracula
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="cmyk"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="cmyk"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        cmyk
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="autumn"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="autumn"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        autumn
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="business"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="business"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        business
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="acid"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="acid"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        acid
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="lemonade"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="lemonade"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        lemonade
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="night"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="night"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        night
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="coffee"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="coffee"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        coffee
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        class="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="winter"
                                        data-act-class="[&amp;_svg]:visible"
                                    >
                                        <div
                                            data-theme="winter"
                                            class="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div class="grid grid-cols-5 grid-rows-3">
                                                <div class="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        class="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{" "}
                                                    <div class="flex-grow text-sm">
                                                        winter
                                                    </div>{" "}
                                                    <div
                                                        class="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div class="bg-primary w-2 rounded"></div>{" "}
                                                        <div class="bg-secondary w-2 rounded"></div>{" "}
                                                        <div class="bg-accent w-2 rounded"></div>{" "}
                                                        <div class="bg-neutral w-2 rounded"></div>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>{" "}
                                    <a
                                        class="outline-base-content overflow-hidden rounded-lg"
                                        href="/theme-generator/"
                                    >
                                        <div class="hover:bg-neutral hover:text-neutral-content w-full cursor-pointer font-sans">
                                            <div class="flex gap-2 p-3">
                                                <svg
                                                    width="24"
                                                    height="24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="h-4 w-4 fill-current"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <path d="M96,208H48a16,16,0,0,1,0-32H96a16,16,0,0,1,0,32Z"></path>
                                                    <line
                                                        x1="90.25"
                                                        y1="90.25"
                                                        x2="124.19"
                                                        y2="124.19"
                                                    ></line>
                                                    <path d="M124.19,140.19a15.91,15.91,0,0,1-11.31-4.69L78.93,101.56a16,16,0,0,1,22.63-22.63l33.94,33.95a16,16,0,0,1-11.31,27.31Z"></path>
                                                    <path d="M192,112a16,16,0,0,1-16-16V48a16,16,0,0,1,32,0V96A16,16,0,0,1,192,112Z"></path>
                                                    <line
                                                        x1="293.89"
                                                        y1="90.25"
                                                        x2="259.95"
                                                        y2="124.19"
                                                    ></line>
                                                    <path d="M260,140.19a16,16,0,0,1-11.31-27.31l33.94-33.95a16,16,0,0,1,22.63,22.63L271.27,135.5A15.94,15.94,0,0,1,260,140.19Z"></path>
                                                    <line
                                                        x1="124.19"
                                                        y1="259.95"
                                                        x2="90.25"
                                                        y2="293.89"
                                                    ></line>
                                                    <path d="M90.25,309.89a16,16,0,0,1-11.32-27.31l33.95-33.94a16,16,0,0,1,22.62,22.63l-33.94,33.94A16,16,0,0,1,90.25,309.89Z"></path>
                                                    <path d="M219,151.83a26,26,0,0,0-36.77,0l-30.43,30.43a26,26,0,0,0,0,36.77L208.76,276a4,4,0,0,0,5.66,0L276,214.42a4,4,0,0,0,0-5.66Z"></path>
                                                    <path d="M472.31,405.11,304.24,237a4,4,0,0,0-5.66,0L237,298.58a4,4,0,0,0,0,5.66L405.12,472.31a26,26,0,0,0,36.76,0l30.43-30.43h0A26,26,0,0,0,472.31,405.11Z"></path>
                                                </svg>{" "}
                                                <div class="flex-grow text-sm font-bold">
                                                    Make your theme!
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* CHANGE THEME BUTTON  */}
                        <div className="flex justify-end items-stretch flex-1 px-2">
                            <select
                                className=" p-2 shadow menu border border-accent bg-base-100"
                                data-choose-theme
                            >
                                <option
                                    disabled
                                    value=""
                                    className="text-accent"
                                >
                                    Pick a theme
                                </option>
                                <option value="">Default</option>
                                <option value="light">Light</option>
                                <option value="retro">Retro</option>
                                <option value="dracula">Dracula</option>
                                <option value="cyberpunk">Cyberpunk</option>
                                <option value="halloween">Halloween</option>
                            </select>
                            {/* <div className="flex items-stretch">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex="0" class="m-1 btn">
                                        Change Color
                                    </div>
                                    <ul
                                        tabIndex="0"
                                        class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                                        data-choose-theme
                                    >
                                        <li>
                                            <a data-set-theme="avsolem">
                                                Avsolem
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="masum">Masum</a>
                                        </li>
                                        <li>
                                            <a data-set-theme="emerald">
                                                emerald
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="light">light</a>
                                        </li>
                                        <li>
                                            <a data-set-theme="dark">dark</a>
                                        </li>
                                        <li>
                                            <a data-set-theme="cupcake">
                                                cupcake
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="bumblebee">
                                                bumblebee
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="aqua">aqua</a>
                                        </li>
                                        <li>
                                            <a data-set-theme="corporate">
                                                corporate
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="synthwave">
                                                synthwave
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="retro">retro</a>
                                        </li>
                                        <li>
                                            <a data-set-theme="cyberpunk">
                                                cyberpunk
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="valentine">
                                                valentine
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="halloween">
                                                halloween
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="garden">
                                                garden
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="forest">
                                                forest
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="lofi">lofi</a>
                                        </li>
                                        <li>
                                            <a data-set-theme="pastel">
                                                pastel
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="fantasy">
                                                fantasy
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="wireframe">
                                                wireframe
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="black">black</a>
                                        </li>
                                        <li>
                                            <a data-set-theme="luxury">
                                                luxury
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="dracula">
                                                dracula
                                            </a>
                                        </li>
                                        <li>
                                            <a data-set-theme="cmyk">cmyk</a>
                                        </li>
                                    </ul>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE */}
            <Transition
                as={Fragment}
                enter="duration-200 ease-out"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="duration-100 ease-in"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <Popover.Panel
                    focus
                    className="absolute inset-x-0 top-0 z-30 origin-top-right transform p-2 transition md:hidden"
                >
                    <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-5 pt-5 pb-6 sm:pb-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Link href="/">
                                        {" "}
                                        <img
                                            className="h-8 w-auto"
                                            src={logoUrl}
                                            alt="logo"
                                        />
                                    </Link>
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <XIcon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </Popover.Button>
                                </div>
                            </div>
                        </div>
                        <div className="py-6 px-5">
                            <div className="grid grid-cols-2 gap-4">
                                {navigation.pages.map((page) => (
                                    <Link
                                        key={page.name}
                                        href={page.href}
                                        className="rounded-md text-base font-medium text-gray-900 hover:text-gray-700"
                                    >
                                        {page.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default Header;
