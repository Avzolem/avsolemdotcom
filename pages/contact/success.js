import MainLayout from "@/components/layouts/MainLayout";
import ParticlesBackground from "@/components/common/ParticlesBackground";

const ContactPage = () => {
    return (
        <div>
            <ParticlesBackground />
            <MainLayout
                title="Gracias! :D"
                childrenClassName="h-screen"
                className="relative"
            >
                <div className="h-min-screen bg-hybrida-bgblue  h-full ">
                    <div className="relative mx-auto max-w-xl">
                        <div className="flex h-screen items-center justify-center">
                            <div className="rounded-xl bg-white px-12 text-center">
                                <h2 className="text-hybrida-fuchsia pt-20 text-3xl font-bold tracking-tight sm:text-4xl">
                                    ¡Gracias por tu compra!
                                </h2>
                                <p className="mt-4 pb-6  text-lg leading-6 text-black">
                                    <h2>
                                        Tu boleto ha sido enviado a tu historial
                                        de transferencias de tu wallet.
                                        <br /> Te invitamos a seguirnos en
                                        nuestras redes sociales para estar al
                                        tanto de los eventos que tenemos para
                                        ti.
                                    </h2>
                                    <br />
                                    <h2>
                                        Para preguntas e información adicional:
                                    </h2>
                                    <br />

                                    <div className="text-center text-sm">
                                        <div className="flex justify-center">
                                            <p>Escribenos un correo a</p> &nbsp;
                                            <a
                                                href="mailto:hybrida@uach.mx"
                                                target="_blank"
                                            >
                                                <p class="font-bold text-sky-400/100">
                                                    eztickets@proton.me
                                                </p>
                                            </a>
                                        </div>
                                        <div className="flex justify-center">
                                            <p>Envía mensaje vía Instagram a</p>{" "}
                                            &nbsp;
                                            <a
                                                href="https://www.instagram.com/avsolem"
                                                target="_blank"
                                            >
                                                <p class="font-bold text-pink-400/100">
                                                    @avsolem
                                                </p>
                                            </a>
                                        </div>
                                        <div className="flex justify-center">
                                            <p>Envía mensaje vía Discord </p>{" "}
                                            &nbsp;
                                            <a
                                                href="https://discord.gg/cvQyBHF2Dz"
                                                target="_blank"
                                            >
                                                <p class="font-bold text-purple-600">
                                                    @etherfuse
                                                </p>
                                            </a>
                                            &nbsp;
                                        </div>
                                    </div>
                                </p>

                                <div className="img">
                                    <img
                                        src="/images/sobre.png"
                                        className="h mx-auto w-64"
                                    />
                                </div>

                                <div className="pt-6 pb-20">
                                    <a href="/">
                                        <button className="inline-flex items-center rounded-full border border-transparent bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                                            Regresar a la página principal
                                        </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
};

export default ContactPage;
