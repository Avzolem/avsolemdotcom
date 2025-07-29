'use client'

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8" ref={ref}>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
                        Sobre mí
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <p className="text-lg text-secondary leading-relaxed">
                            Soy un desarrollador Full Stack apasionado por crear experiencias web 
                            innovadoras y soluciones tecnológicas que marquen la diferencia.
                        </p>
                        <p className="text-lg text-secondary leading-relaxed">
                            Especializado en el ecosistema de React y Next.js, con experiencia en
                            desarrollo Web3 y blockchain, particularmente en Solana. Me encanta
                            combinar diseño y funcionalidad para crear aplicaciones que no solo
                            funcionen bien, sino que también se vean increíbles.
                        </p>
                        <p className="text-lg text-secondary leading-relaxed">
                            Siempre estoy buscando nuevos desafíos y oportunidades para aprender
                            y crecer como desarrollador.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="grid grid-cols-2 gap-6"
                    >
                        <div className="bg-base-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-primary mb-2">3+</div>
                            <div className="text-secondary">Años de experiencia</div>
                        </div>
                        <div className="bg-base-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-primary mb-2">20+</div>
                            <div className="text-secondary">Proyectos completados</div>
                        </div>
                        <div className="bg-base-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-primary mb-2">15+</div>
                            <div className="text-secondary">Tecnologías dominadas</div>
                        </div>
                        <div className="bg-base-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                            <div className="text-3xl font-bold text-primary mb-2">100%</div>
                            <div className="text-secondary">Compromiso</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}