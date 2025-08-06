'use client';

import React from 'react';
import Head from 'next/head';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Seo from '@/components/common/Seo';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    childrenClassName?: string;
    [key: string]: any; // For rest props
}

const Layout: React.FC<LayoutProps> = ({
    title,
    description,
    children,
    childrenClassName,
    ...rest
}) => {
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Seo subtitle={title} description={description} />
            <div className="flex min-h-screen flex-col " {...rest}>
                <Header />
                <Toaster position="bottom-center" reverseOrder={false} />
                <div className={`my-0 ${childrenClassName}`}>{children}</div>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;