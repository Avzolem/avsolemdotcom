export default function ContactLoading() {
    return (
        <div className="min-h-screen bg-base-100 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    {/* Title skeleton */}
                    <div className="h-12 bg-base-300 rounded-lg animate-pulse mb-4"></div>
                    <div className="h-6 bg-base-300 rounded-lg animate-pulse mb-8 w-3/4"></div>
                    
                    {/* Form skeleton */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <div className="h-4 bg-base-300 rounded animate-pulse mb-2 w-20"></div>
                                <div className="h-10 bg-base-300 rounded-lg animate-pulse"></div>
                            </div>
                            <div>
                                <div className="h-4 bg-base-300 rounded animate-pulse mb-2 w-20"></div>
                                <div className="h-10 bg-base-300 rounded-lg animate-pulse"></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="h-4 bg-base-300 rounded animate-pulse mb-2 w-24"></div>
                            <div className="h-10 bg-base-300 rounded-lg animate-pulse"></div>
                        </div>
                        
                        <div>
                            <div className="h-4 bg-base-300 rounded animate-pulse mb-2 w-16"></div>
                            <div className="h-10 bg-base-300 rounded-lg animate-pulse"></div>
                        </div>
                        
                        <div>
                            <div className="h-4 bg-base-300 rounded animate-pulse mb-2 w-20"></div>
                            <div className="h-32 bg-base-300 rounded-lg animate-pulse"></div>
                        </div>
                        
                        <div className="h-12 bg-primary/20 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}