function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Opening() {
    return (
        <>
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
                                className="w-[30rem] rounded-full shadow-2xl "
                            />
                        </div>

                        {/* Aqui va el texto */}
                        <div className="m-auto">
                            <h1 className="text-white-900 text-center text-xl font-bold tracking-tight  md:text-2xl">
                                <span className=" text-primary xl:inline">
                                    Hi there, i'm{" "}
                                </span>{" "}
                            </h1>
                            <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-5xl md:text-7xl">
                                <span className=" text-primary xl:inline">
                                    Andrés Aguilar{" "}
                                </span>{" "}
                            </h1>
                            <br />
                            <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-4xl">
                                <span className=" bg-accent bg-clip-text text-transparent xl:inline">
                                    Web Developer React+NextJS{" "}
                                </span>
                            </h1>
                            <h1 className="text-white-900 text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                                <span class="[&amp;::selection]:text-base-content relative col-start-1 row-start-1 bg-[linear-gradient(90deg,hsl(var(--s))_0%,hsl(var(--sf))_9%,hsl(var(--pf))_42%,hsl(var(--p))_47%,hsl(var(--a))_100%)] bg-clip-text [-webkit-text-fill-color:transparent] [&amp;::selection]:bg-blue-700/20 [@supports(color:oklch(0_0_0))]:bg-[linear-gradient(90deg,hsl(var(--s))_4%,color-mix(in_oklch,hsl(var(--sf)),hsl(var(--pf)))_22%,hsl(var(--p))_45%,color-mix(in_oklch,hsl(var(--p)),hsl(var(--a)))_67%,hsl(var(--a))_100.2%)]">
                                    UX|UI Designer
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

            {/*  simple title center text center*/}

            <section className="relative">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="text-5xl font-bold  text-primary">
                            This Site is Under Construction
                        </h2>

                        <p className="mt-6 text-2xl font-semibold text-secondary">
                            I'm currently working on this site, so please check
                            back later for updates!
                        </p>
                        <br />
                    </div>
                </div>
            </section>

            <br />
            <br />

            {/*  simple title center text center*/}

            {/* <section className="relative">
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
            </section> */}
        </>
    );
}
