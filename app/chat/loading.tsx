export default function ChatLoading() {
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center">
            <div className="text-center">
                <div className="chat chat-start mb-4">
                    <div className="chat-bubble bg-base-300 animate-pulse">
                        <div className="h-4 w-32"></div>
                    </div>
                </div>
                <div className="chat chat-end mb-4">
                    <div className="chat-bubble bg-primary/20 animate-pulse">
                        <div className="h-4 w-40"></div>
                    </div>
                </div>
                <span className="loading loading-dots loading-lg text-primary"></span>
                <p className="mt-4 text-base-content/70">Cargando chat...</p>
            </div>
        </div>
    );
}