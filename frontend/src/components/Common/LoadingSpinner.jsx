export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-primary-500/20 animate-pulse"></div>
                </div>
            </div>
        </div>
    )
}