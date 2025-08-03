'use client'

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Toaster } from "react-hot-toast";

interface LayoutProps {
    title?: string;
    description?: string;
    children: React.ReactNode;
    childrenClassName?: string;
}

const Layout = ({
    title,
    description,
    children,
    childrenClassName,
    ...rest
}: LayoutProps) => {
    return (
        <div className="flex min-h-screen flex-col" {...rest}>
            <Header />
            <Toaster position="bottom-center" reverseOrder={false} />
            <main className={`flex-grow ${childrenClassName || ''}`}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;