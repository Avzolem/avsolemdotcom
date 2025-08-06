export default function WhatsAppLoading() {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center">
            <div className="max-w-md w-full px-6">
                {/* Header skeleton */}
                <div className="flex items-center justify-center mb-8">
                    <div className="w-24 h-24 bg-base-300 rounded-full animate-pulse"></div>
                    <div className="ml-6">
                        <div className="h-8 bg-base-300 rounded animate-pulse w-48"></div>
                    </div>
                </div>
                
                {/* Form skeleton */}
                <div className="space-y-6">
                    <div>
                        <div className="h-6 bg-base-300 rounded animate-pulse mb-2 w-32"></div>
                        <div className="h-10 bg-base-300 rounded-lg animate-pulse"></div>
                    </div>
                    
                    <div>
                        <div className="h-6 bg-base-300 rounded animate-pulse mb-2 w-24"></div>
                        <div className="h-24 bg-base-300 rounded-lg animate-pulse"></div>
                    </div>
                    
                    <div className="flex justify-center">
                        <div className="h-12 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-lg animate-pulse w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}