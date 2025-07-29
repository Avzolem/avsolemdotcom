'use client'

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
    {
        title: "Frontend",
        skills: [
            { name: "React", level: 95 },
            { name: "Next.js", level: 90 },
            { name: "TypeScript", level: 85 },
            { name: "Tailwind CSS", level: 95 },
            { name: "HTML/CSS", level: 100 }
        ]
    },
    {
        title: "Backend",
        skills: [
            { name: "Node.js", level: 85 },
            { name: "Express", level: 80 },
            { name: "MongoDB", level: 75 },
            { name: "PostgreSQL", level: 70 },
            { name: "REST APIs", level: 90 }
        ]
    },
    {
        title: "Web3 & Blockchain",
        skills: [
            { name: "Solana", level: 80 },
            { name: "Web3.js", level: 75 },
            { name: "Metaplex", level: 70 },
            { name: "Smart Contracts", level: 65 },
            { name: "NFTs", level: 85 }
        ]
    },
    {
        title: "Herramientas",
        skills: [
            { name: "Git/GitHub", level: 90 },
            { name: "VS Code", level: 95 },
            { name: "Figma", level: 80 },
            { name: "Docker", level: 70 },
            { name: "Vercel", level: 85 }
        ]
    }
];

export default function SkillsSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8" ref={ref}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                        Habilidades
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8"></div>
                    <p className="text-lg text-secondary max-w-2xl mx-auto">
                        Tecnologías y herramientas con las que trabajo diariamente
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skillCategories.map((category, categoryIndex) => (
                        <motion.div
                            key={category.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ duration: 0.6, delay: 0.2 + categoryIndex * 0.1 }}
                            className="bg-base-200 rounded-lg p-6"
                        >
                            <h3 className="text-xl font-bold text-primary mb-6">
                                {category.title}
                            </h3>
                            <div className="space-y-4">
                                {category.skills.map((skill, index) => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm font-medium text-secondary">
                                                {skill.name}
                                            </span>
                                            <span className="text-sm font-medium text-secondary">
                                                {skill.level}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-base-300 rounded-full h-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
                                                transition={{
                                                    duration: 1,
                                                    delay: 0.5 + categoryIndex * 0.1 + index * 0.05,
                                                    ease: "easeOut"
                                                }}
                                                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Additional Skills - Bento Grid Style */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {["UI/UX Design", "Responsive Design", "API Integration", "Problem Solving"].map((skill, index) => (
                        <div
                            key={skill}
                            className="bg-base-200 rounded-lg p-4 text-center hover:bg-base-300 transition-colors cursor-pointer"
                        >
                            <span className="text-primary font-medium">{skill}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}