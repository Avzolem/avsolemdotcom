'use client'

import { motion } from "framer-motion";
import Link from "next/link";
import OptimizedImage from "@/components/common/OptimizedImage";

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left order-2 lg:order-1"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6">
                            <span className="block text-primary">Hola, soy</span>
                            <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                                Andrés Aguilar
                            </span>
                        </h1>
                        
                        <p className="text-base sm:text-lg md:text-xl text-secondary mb-8 max-w-2xl mx-auto lg:mx-0">
                            Full Stack Developer apasionado por crear experiencias web 
                            innovadoras y soluciones tecnológicas que marcan la diferencia.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="#projects" className="btn btn-primary w-full sm:w-auto">
                                Ver Proyectos
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link href="#contact" className="btn btn-outline btn-primary w-full sm:w-auto">
                                Contactar
                            </Link>
                        </div>
                        
                        {/* Social Links */}
                        <div className="flex gap-4 mt-8 justify-center lg:justify-start">
                            <a 
                                href="https://github.com/avsolem" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary transition-colors p-2"
                                aria-label="GitHub"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://linkedin.com/in/avsolem" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary transition-colors p-2"
                                aria-label="LinkedIn"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            <a 
                                href="https://twitter.com/avsolem" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-primary transition-colors p-2"
                                aria-label="Twitter"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                </svg>
                            </a>
                        </div>
                    </motion.div>
                    
                    {/* Image/Animation */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative order-1 lg:order-2"
                    >
                        <div className="relative mx-auto w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                            {/* Animated background blob */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur-3xl opacity-30 animate-pulse"></div>
                            
                            {/* Profile image placeholder */}
                            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
                                <OptimizedImage
                                    src="/images/profile.png"
                                    alt="Andrés Aguilar"
                                    fill
                                    priority
                                    className="object-cover"
                                />
                            </div>
                            
                            {/* Floating elements */}
                            <motion.div
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 10, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                                className="absolute -top-4 -right-4 w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-lg shadow-lg flex items-center justify-center"
                            >
                                <span className="text-2xl sm:text-3xl">⚡</span>
                            </motion.div>
                            
                            <motion.div
                                animate={{
                                    y: [0, 20, 0],
                                    rotate: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                                className="absolute -bottom-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-accent rounded-lg shadow-lg flex items-center justify-center"
                            >
                                <span className="text-2xl sm:text-3xl">🚀</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}