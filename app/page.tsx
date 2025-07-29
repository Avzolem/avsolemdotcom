'use client'

import { useEffect } from "react";
import { themeChange } from "theme-change";
import HeroSection from "@/components/sections/HeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import AboutSection from "@/components/sections/AboutSection";

export default function Home() {
    useEffect(() => {
        themeChange(false);
    }, []);
    
    return (
        <main className="min-h-screen bg-base-100">
            <HeroSection />
            <AboutSection />
            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
        </main>
    );
}