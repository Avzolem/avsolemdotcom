import MainLayout from "@/components/layouts/MainLayout";
import Hero from "@/components/common/Hero";

import ParticlesBackground from "../components/common/ParticlesBackground";

import { themeChange } from "theme-change";
import { useEffect } from "react";

/*Initialize under useEffect */

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Home() {
    useEffect(() => {
        themeChange(false);
    }, []);
    return (
        <div>
            {/* <ParticlesBackground /> */}
            <MainLayout>
                <Hero />
            </MainLayout>
        </div>
    );
}
