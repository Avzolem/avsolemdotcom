import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="text-center p-8 max-w-md">
                <div className="mb-8">
                    <div className="text-9xl font-bold text-primary">404</div>
                </div>
                <h2 className="text-3xl font-bold text-base-content mb-4">
                    Página no encontrada
                </h2>
                <p className="text-base-content/70 mb-8">
                    Lo sentimos, no pudimos encontrar la página que estás buscando.
                </p>
                <div className="flex gap-4 justify-center">
                    <Link href="/" className="btn btn-primary">
                        Volver al inicio
                    </Link>
                    <Link href="/contact" className="btn btn-outline">
                        Contactar soporte
                    </Link>
                </div>
            </div>
        </div>
    )
}