import MainLayout from "@/components/layouts/MainLayout";
import ParticlesBackground from "../components/common/ParticlesBackground";

export default function Candymachine() {
    return (
        <div>
            <ParticlesBackground />
            <MainLayout className="relative">
                <div className="">
                    <div className="mx-auto max-w-2xl justify-center py-16 px-4 text-center sm:py-20 ">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            <span className="block"> Your first NFT</span>

                            <span className="block">Get a Gitf NFT</span>
                        </h2>

                        <div className="mt-8 flex justify-center">
                            <div class="w-full">
                                <img
                                    src="/images/boletos.png"
                                    class="w-[40rem] "
                                    alt="boletos"
                                />
                            </div>
                        </div>

                        <p className="mt-4 text-lg leading-6 text-white">
                            <br />
                            With this Candy Machine you have the opportunity to
                            get an EzTicket from this event, which you can save
                            in your favorite Solana wallet.
                            <br />
                        </p>
                        <a
                            href="https://candy-machine-eztickets.vercel.app"
                            className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 px-5 py-3 text-base font-medium text-white hover:bg-purple-700 sm:w-auto"
                        >
                            Claim yours now! :D
                        </a>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
}
