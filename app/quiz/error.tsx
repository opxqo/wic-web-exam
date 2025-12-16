'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
            <h2 className="text-xl font-bold text-red-600 mb-2">生成试卷时发生错误</h2>
            <p className="text-gray-600 mb-6 max-w-md break-words">
                {error.message || "未知错误"}
            </p>
            <div className="space-x-4">
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    重试
                </button>
                <a
                    href="/"
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                >
                    返回首页
                </a>
            </div>
        </div>
    );
}
