export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="flex space-x-2 mb-4">
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-bounce"></div>
            </div>
            <h2 className="text-gray-600 font-medium ml-1">正在生成试卷...</h2>
        </div>
    );
}
