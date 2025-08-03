'use client'

import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = {
    pages: [
        { name: "CONTACT", href: "/contact" },
        { name: "TOOLBOX", href: "/" },
        { name: "PROJECTS", href: "https://github.com/Avzolem" },
    ],
};

const Header = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Popover className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-base-100/95 backdrop-blur-sm shadow-lg' : 'bg-base-100'}`}>
            <div className="relative z-20">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div>
                        <Link href="/" className="flex">
                            <div className="font-bold text-primary inline-flex text-xl transition-all duration-200 md:text-2xl lg:text-3xl">
                                <span className="">Avso</span>
                                <span className="text-secondary">lem 🦈</span>
                            </div>
                        </Link>
                    </div>
                    
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-base-100 p-2 text-primary hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                            <span className="sr-only">Open menu</span>
                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    
                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                        <Popover.Group as="nav" className="flex space-x-8 ml-10">
                            {navigation.pages.map((page) => (
                                <Link
                                    key={page.name}
                                    href={page.href}
                                    className="text-base hover:text-accent font-medium text-primary transition-colors duration-200"
                                >
                                    {page.name}
                                </Link>
                            ))}
                        </Popover.Group>
                        
                        {/* Theme selector for desktop */}
                        <div className="flex items-center">
                            <select
                                className="select select-bordered select-sm bg-base-200 text-primary"
                                data-choose-theme
                            >
                                <option value="avsolem">Avsolem</option>
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="cyberpunk">Cyberpunk</option>
                                <option value="retro">Retro</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
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
                    className="absolute inset-x-0 top-0 z-30 origin-top-right transform transition md:hidden"
                >
                    <div className="divide-y-2 divide-base-300 rounded-lg bg-base-100 shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="px-5 pt-5 pb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Link href="/">
                                        <div className="font-bold text-primary inline-flex text-xl">
                                            <span className="">Avso</span>
                                            <span className="text-secondary">lem 🦈</span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="-mr-2">
                                    <Popover.Button className="inline-flex items-center justify-center rounded-md bg-base-100 p-2 text-primary hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </Popover.Button>
                                </div>
                            </div>
                        </div>
                        <div className="py-6 px-5 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {navigation.pages.map((page) => (
                                    <Link
                                        key={page.name}
                                        href={page.href}
                                        className="rounded-md text-lg font-medium text-primary hover:text-accent p-3 hover:bg-base-200 transition-all duration-200"
                                    >
                                        {page.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-6">
                                <label className="text-sm font-medium text-secondary mb-2 block">Theme</label>
                                <select
                                    className="select select-bordered w-full bg-base-200"
                                    data-choose-theme
                                >
                                    <option value="avsolem">Avsolem</option>
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="cyberpunk">Cyberpunk</option>
                                    <option value="retro">Retro</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

export default Header;