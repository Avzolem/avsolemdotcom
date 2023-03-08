import Head from "next/head";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Seo from "@/components/common/Seo";
import { Toaster } from "react-hot-toast";

const Layout = ({
    title,
    description,
    children,
    childrenClassName,
    ...rest
}) => {
    return (
        <div className="relative flex flex-col h-screen justify-between">
            <Head>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Seo subtitle={title} description={description} />
            <div {...rest}>
                <Header />
                <Toaster position="bottom-center" reverseOrder={false} />
                <div className={`my-0 ${childrenClassName}`}>{children}</div>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
