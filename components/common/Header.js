/* eslint-disable @next/next/no-img-element */
import { Fragment, useState } from "react";
import Link from "next/link";
import { Popover, Transition, Menu } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { useSession, signOut } from "next-auth/react";
import classNames from "@/utils/classNames";
import { useEffect } from "react";
import { Router, useRouter } from "next/router";
import Image from "next/image";
import { themeChange } from "theme-change";

//HEADER SETUP
const logoUrl = "/logo.png";

const navigation = {
    categories: [],
    pages: [
        { name: "PORTFOLIO", href: "/portfolio" },
        { name: "CV", href: "/cv" },
        { name: "CONTACT", href: "/contact" },
        { name: "CANDY MACHINE", href: "/candymachine" },
        { name: "UTILITIES", href: "/utilities" },
    ],
};
let phantom;

const Header = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [publicKey, setPublicKey] = useState(null);

    useEffect(() => {
        themeChange(false);

        if ("phantom" in window) {
            const provider = window.phantom?.solana;
            let key = window.localStorage.getItem("publicKey");
            if (key) {
                let firstFour = key?.substring(0, 4);
                let lastFour = key?.substring(key?.length - 4);
                key = firstFour + "..." + lastFour;
                setPublicKey(key);
            }

            if (provider?.isPhantom) {
                console.log(provider);
                phantom = provider;
            }
        }
    }, []);

    const connectWallet = async () => {
        if ("phantom" in window) {
            const provider = window.phantom?.solana;
            if (provider?.isPhantom) {
                phantom = provider;
                try {
                    const { solana } = window;

                    if (solana.isPhantom) {
                        console.log("Phantom wallet is installed");
                        const response = await phantom.connect();
                        console.log(response.publicKey.toString());
                        //loginWithPhantom();
                        router.push("/auth/signin");
                    } else {
                        console.log("Phantom wallet is not installed");
                        window.open("https://phantom.app/", "_blank");
                    }
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log("Phantom wallet is not installed");
            }
        } else {
            window.open("https://phantom.app/", "_blank");
        }
    };

    const signOutWallet = () => {
        console.log("sign out");
        window.localStorage.removeItem("publicKey");
        window.localStorage.removeItem("signature");
        router.reload(window.location.pathname);
    };

    return (
        <Popover className="relative ">
            <div
                className="pointer-events-none absolute inset-0 z-20 shadow "
                aria-hidden="true"
            />
            <div className="relative z-20  bg-base-100">
                {/* DESKTOP */}
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 sm:py-4 md:justify-start md:space-x-10 lg:px-8">
                    <div>
                        <Link href="/" className="flex">
                            {/* <img
                                className="h-8 mx-2 w-auto sm:h-10"
                                src={logoUrl}
                                alt="Avsolem logo"
                            /> */}
                            <div className="font-bold text-primary inline-flex text-lg transition-all duration-200 md:text-3xl">
                                <span className="">Avso</span>
                                <span className="text-base-content">
                                    lem 🦈
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className="-my-2 -mr-2 md:hidden">
                        <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                            <span className="sr-only">Open menu</span>
                            <MenuIcon className="h-6 w-6" aria-hidden="true" />
                        </Popover.Button>
                    </div>
                    <div className="hidden md:flex md:flex-1 md:items-center md:justify-between ">
                        <Popover.Group as="nav" className="flex space-x-5">
                            {navigation.pages.map((page) => (
                                <Link
                                    key={page.name}
                                    href={page.href}
                                    className="text-base font-medium text-primary"
                                >
                                    {page.name}
                                </Link>
                            ))}
                        </Popover.Group>
                        {/* HEADER DESKTOP RIGHT SECTION BUTTONS */}

                        {/* CHANGE THEME BUTTON  */}
                        <div className="flex justify-end flex-1 px-2">
                            <div className="flex items-stretch">
                                <div className="dropdown dropdown-end">
                                    <div tabindex="0" class="m-1 btn">
                                        Change Color
                                    </div>
                                    <ul
                                        tabindex="0"
                                        class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                                        data-choose-theme=""
                                    >
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
                            </div>
                        </div>

                        {/* WALLET BUTTON */}
                        <div className="flex items-center md:ml-12">
                            {publicKey ? (
                                <Menu as="div" className="relative ml-3">
                                    <div>
                                        <Menu.Button className="flex rounded-full bg-purple-500 text-sm focus:outline-none focus:ring-white  focus:ring-offset-2">
                                            <span className="sr-only">
                                                Open user menu
                                            </span>

                                            <Image
                                                className="rounded-full px-1 py-2"
                                                width={32}
                                                height={32}
                                                src="/images/phantom.png"
                                                alt=""
                                            />
                                            <div className="px-1 py-2 text-white">
                                                {publicKey}
                                            </div>
                                        </Menu.Button>
                                    </div>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 z-40 mt-2 w-48 origin-top-right rounded-md bg-black py-1 shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        href="/user/profile"
                                                        className={classNames(
                                                            active
                                                                ? "bg-gray-100"
                                                                : "",
                                                            "block px-4 py-2 text-sm text-white"
                                                        )}
                                                    >
                                                        Mi Cuenta
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            {true && (
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <Link
                                                            href="/admin/dashboard"
                                                            className={classNames(
                                                                active
                                                                    ? "bg-black"
                                                                    : "",
                                                                "block px-4 py-2 text-sm text-white"
                                                            )}
                                                        >
                                                            Admin Dashboard
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            )}

                                            <Menu.Item>
                                                {({ active }) => (
                                                    <div
                                                        className={classNames(
                                                            active
                                                                ? "bg-black"
                                                                : "",
                                                            "block cursor-pointer px-4 py-2 text-sm text-white"
                                                        )}
                                                        onClick={() =>
                                                            signOutWallet()
                                                        }
                                                    >
                                                        Salir
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                <button
                                    className="rounded-md btn px-4 py-2 text-sm font-medium text-base-100 hover:bg-accent"
                                    onClick={() => {
                                        connectWallet();
                                    }}
                                >
                                    <a>Conect Wallet</a>
                                </button>
                            )}
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
