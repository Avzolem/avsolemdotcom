import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <>
            <SessionProvider session={session}>
                <Component {...pageProps} />
            </SessionProvider>
        </>
    );
}

export default MyApp;
