'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
            <div className="text-center p-8 max-w-md">
                <div className="mb-8">
                    <svg
                        className="mx-auto h-24 w-24 text-error"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-4">
                    ¡Ups! Algo salió mal
                </h2>
                <p className="text-base-content/70 mb-8">
                    {error.message || 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.'}
                </p>
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="btn btn-primary"
                    >
                        Intentar de nuevo
                    </button>
                    <a href="/" className="btn btn-outline">
                        Ir al inicio
                    </a>
                </div>
            </div>
        </div>
    )
}