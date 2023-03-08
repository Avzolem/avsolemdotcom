import MainLayout from "@/components/layouts/MainLayout";
import Hero from "@/components/common/Hero";

import ParticlesBackground from "../components/common/ParticlesBackground";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function Home() {
    return (
        <div data-theme="">
            {/* <ParticlesBackground /> */}
            <MainLayout>
                <Hero />
            </MainLayout>
        </div>
    );
}
