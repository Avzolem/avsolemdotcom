export default function Footer() {
    return (
        <footer className="bg-base-200 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-center md:text-left mb-4 md:mb-0">
                        <p className="text-secondary">
                            © {new Date().getFullYear()} Andrés Aguilar. Todos los derechos reservados.
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <a
                            href="https://github.com/avsolem"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-primary transition-colors"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://linkedin.com/in/avsolem"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-primary transition-colors"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://twitter.com/avsolem"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary hover:text-primary transition-colors"
                        >
                            Twitter
                        </a>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <p className="text-sm text-secondary">
                        Hecho con ❤️ usando Next.js, TypeScript y Tailwind CSS
                    </p>
                </div>
            </div>
        </footer>
    );
}