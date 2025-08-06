'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-900">
                    <div className="text-center p-8 max-w-md">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Error crítico del sistema
                        </h2>
                        <p className="text-gray-300 mb-8">
                            La aplicación ha encontrado un error crítico. Por favor, recarga la página.
                        </p>
                        <button
                            onClick={reset}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Recargar página
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}