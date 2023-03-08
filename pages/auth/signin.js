/* eslint-disable @next/next/no-img-element */
import {
    getProviders,
    signIn,
    getCsrfToken,
    getSession,
} from "next-auth/react";
import { useRouter } from "next/router";
const bs58 = require("bs58");

const SignInPage = ({ providers, csrfToken, errorMessage }) => {
    const router = useRouter();

    const getProvider = () => {
        if ("phantom" in window) {
            const provider = window.phantom?.solana;

            if (provider?.isPhantom) {
                return provider;
            }
        }
    };

    const loginWithPhantom = async () => {
        try {
            const provider = getProvider();
            const message =
                "Para evitar que alguien se haga pasar por ti, necesitamos que firmes este mensaje";
            const encodeMessage = new TextEncoder().encode(message);
            const signedMessage = await provider.request({
                method: "signMessage",
                params: {
                    message: encodeMessage,
                    display: "UTF-8",
                },
            });
            if (signedMessage.signature) {
                window.localStorage.setItem(
                    "signature",
                    signedMessage.signature
                );
                window.localStorage.setItem(
                    "publicKey",
                    signedMessage.publicKey
                );
                console.log(signedMessage);
                router.push("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className=" flex h-full min-h-full w-full items-center justify-center">
                <div className=" flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        <div>
                            <h2 className="mt-6 text-3xl font-extrabold text-gray-900"></h2>
                        </div>

                        <div className="mt-8">
                            <div className="mt-6">
                                {errorMessage && (
                                    <div className="mt-3 text-sm text-red-600">
                                        {errorMessage}
                                    </div>
                                )}

                                <div>
                                    <button
                                        onClick={() => loginWithPhantom()}
                                        className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                    >
                                        Inicia sesión con Phantom
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export async function getServerSideProps(context) {
    //getting providers and csfr token
    const providers = ""; //await getProviders();
    const csrfToken = ""; //await getCsrfToken(context);
    const session = ""; //await getSession({ req: context.req });
    console.log(csrfToken);
    const { error } = context.query;
    let errorMessage = "";

    //if user is logged in, redirect to home
    if (session?.user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    /*if (error) {
    const errors = {
      Signin: "Try using a different email address",
      OAuthSignin: "Try using a different email address",
      OAuthCallback: "Try using a different email address",
      OAuthCreateAccount: "Try using a different email address",
      EmailCreateAccount: "Try using a different email address",
      Callback: "Try using a different email address",
      OAuthAccountNotLinked:
        "Try using a different email address or sign in with a different provider",
      EmailSignin: "Check your email for a link to reset your password",
      default: "A unknown and misterious error happened",
    };

    errorMessage = errors[error] || errors.default;
  }*/

    return {
        props: { errorMessage, providers, csrfToken },
    };
}

export default SignInPage;
