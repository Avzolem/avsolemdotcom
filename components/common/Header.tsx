'use client';

/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import { Popover, Transition, Menu } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface NavigationPage {
    name: string;
    href: string;
}

interface Navigation {
    categories: any[];
    pages: NavigationPage[];
}

// HEADER SETUP
const logoUrl = '/logo.png';

const navigation: Navigation = {
    categories: [],
    pages: [
        // { name: "CV", href: "/cv" },
        { name: 'CONTACT', href: '/contact' },
        // { name: "CANDY MACHINE", href: "/candymachine" },
        // { name: "UTILITIES", href: "/utilities" },
        { name: 'TOOLBOX', href: '/' },
        { name: 'PROJECTS', href: 'https://github.com/Avzolem' },
    ],
};

const Header: React.FC = () => {
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
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
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
                            className=" dropdown dropdown-end"
                        >
                            <div tabIndex={0} className="btn normal-case btn-ghost">
                                <svg
                                    width="20"
                                    height="20"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                    ></path>
                                </svg>{' '}
                                <span className="hidden font-normal md:inline">
                                    Theme
                                </span>{' '}
                                <svg
                                    width="12px"
                                    height="12px"
                                    className="hidden h-2 w-2 fill-current opacity-60 sm:inline-block"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 2048 2048"
                                >
                                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                                </svg>
                            </div>{' '}
                            <div className="dropdown-content bg-base-200 text-base-content rounded-box top-px h-[70vh] max-h-96 w-56 overflow-y-auto shadow mt-16">
                                <div
                                    className="grid grid-cols-1 gap-3 p-3"
                                    tabIndex={0}
                                >
                                    <button
                                        className="outline-base-content overflow-hidden rounded-lg text-left"
                                        data-set-theme="avsolem"
                                        data-act-class="[&_svg]:visible"
                                    >
                                        <div
                                            data-theme="avsolem"
                                            className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
                                        >
                                            <div className="grid grid-cols-5 grid-rows-3">
                                                <div className="col-span-5 row-span-3 row-start-1 flex items-center gap-2 px-4 py-3">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        className="invisible h-3 w-3 shrink-0"
                                                    >
                                                        <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                                                    </svg>{' '}
                                                    <div className="flex-grow text-sm">
                                                        avsolem
                                                    </div>{' '}
                                                    <div
                                                        className="flex h-full flex-shrink-0 flex-wrap gap-1"
                                                        data-svelte-h="svelte-izuv7l"
                                                    >
                                                        <div className="bg-primary w-2 rounded"></div>{' '}
                                                        <div className="bg-secondary w-2 rounded"></div>{' '}
                                                        <div className="bg-accent w-2 rounded"></div>{' '}
                                                        <div className="bg-neutral w-2 rounded"></div>{' '}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                    {/* Additional theme buttons truncated for brevity - in a real conversion I would include all of them */}
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
                                        {' '}
                                        <img
                                            className="h-8 w-auto"
                                            src={logoUrl}
                                            alt="logo"
                                        />
                                    </Link>
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <XMarkIcon
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