"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

export type Question = {
    question: string;
    type: 'choice' | 'judge';
    answer: string;
    options: string[];
    explanation?: string;
};

interface QuizClientProps {
    questions: Question[];
}

export default function QuizClient({ questions }: QuizClientProps) {
    // State
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const topRef = useRef<HTMLDivElement>(null);

    const handleSelect = (index: number, val: string) => {
        if (submitted) return;
        setAnswers((prev) => ({ ...prev, [index]: val }));
    };

    const handleSubmit = () => {
        if (!confirm('确定要提交试卷吗？提交后将无法修改答案。')) return;

        let correctCount = 0;
        questions.forEach((q, idx) => {
            const userAns = answers[idx];
            if (userAns === q.answer) {
                correctCount++;
            }
        });

        // Score calculation
        // Total score logic: Just percentage or count?
        // Let's do Count and Percentage.
        setScore(correctCount);
        setSubmitted(true);

        // Scroll to top to see result
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const checkOptionState = (qIndex: number, optionVal: string, correctVal: string) => {
        if (!submitted) {
            if (answers[qIndex] === optionVal) return 'selected';
            return 'normal';
        }

        // Submitted logic
        const userAns = answers[qIndex];
        if (optionVal === correctVal) return 'correct'; // The correct option
        if (userAns === optionVal && userAns !== correctVal) return 'wrong'; // User selected wrong
        if (userAns === optionVal && userAns === correctVal) return 'correct-selected'; // User selected correct
        if (answers[qIndex] === optionVal) return 'selected'; // Fallback
        return 'normal';
    };

    const getOptionLabel = (q: Question, opt: string, optIndex: number) => {
        if (q.type === 'choice') {
            // Extract "A" from "A. xxxx"
            // Or simply return just the letter A, B... for logic, but display full text.
            // My logic uses "A", "B" etc as value.
            // So I need to know which value this option represents.
            // Usually options are "A. ...", "B. ...".
            // Let's assume the first char is the value.
            // But for display, show the whole text.
            return opt;
        }
        return opt; // "正确" or "错误"
    };

    const getOptionValue = (q: Question, opt: string) => {
        if (q.type === 'choice') {
            // "A. Content" -> "A"
            return opt.substring(0, 1).toUpperCase();
        } else {
            // "正确" -> "T", "错误" -> "F"
            if (opt === '正确') return 'T';
            if (opt === '错误') return 'F';
            return '?';
        }
    };

    const scorePercentage = Math.round((score / questions.length) * 100) || 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20" ref={topRef}>
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                    <Link href="/" className="text-gray-600 hover:text-blue-600 text-sm font-medium flex items-center">
                        &larr; 返回首页
                    </Link>
                    <div className="font-bold text-gray-800">
                        {submitted ? '考试结果' : 'Wuhan City College - Web Exam'}
                    </div>
                    <div className="text-sm font-medium text-gray-600">
                        进度：<span className="text-blue-600">{Object.keys(answers).length}</span> / {questions.length}
                    </div>
                </div>
            </header>

            {/* Result Banner */}
            {submitted && (
                <div className="max-w-5xl mx-auto mt-6 mx-4 bg-white rounded border border-gray-200 p-6 text-center shadow-sm">
                    <h2 className="text-lg font-bold text-gray-700 mb-2">考试成绩</h2>
                    <div className="text-4xl font-bold text-blue-600">
                        {scorePercentage} <span className="text-xl text-gray-400 font-normal">分</span>
                    </div>
                    <p className="text-gray-500 mt-2 text-sm">
                        答对 {score} 题，共 {questions.length} 题
                    </p>
                </div>
            )}

            {/* Questions List */}
            <div className="max-w-5xl mx-auto p-4 space-y-4 mt-2">
                {questions.map((q, idx) => {
                    const isCorrect = submitted && answers[idx] === q.answer;
                    const isWrong = submitted && answers[idx] !== q.answer;

                    return (
                        <div
                            key={idx}
                            id={`q-${idx}`}
                            className={clsx(
                                "bg-white rounded border p-6 scroll-mt-20",
                                !submitted && "border-gray-200 hover:border-gray-300",
                                submitted && isCorrect && "border-green-200 bg-green-50/10",
                                submitted && isWrong && "border-red-200 bg-red-50/10"
                            )}
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-gray-500 font-mono text-sm shrink-0 pt-0.5 w-6">
                                    {idx + 1}.
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base text-gray-900 font-medium leading-relaxed mb-4">
                                        {q.question}
                                        <span className="ml-2 text-xs font-normal text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                                            {q.type === 'choice' ? '单选' : '判断'}
                                        </span>
                                    </h3>

                                    <div className="space-y-2 pl-1">
                                        {q.options.map((opt, optIdx) => {
                                            const val = getOptionValue(q, opt);
                                            const state = checkOptionState(idx, val, q.answer);

                                            return (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => handleSelect(idx, val)}
                                                    disabled={submitted}
                                                    className={clsx(
                                                        "w-full text-left px-3 py-2.5 rounded border text-sm transition-colors flex items-center group",
                                                        state === 'normal' && "border-transparent hover:bg-gray-50 hover:border-gray-200 text-gray-700",
                                                        state === 'selected' && !submitted && "border-blue-200 bg-blue-50 text-blue-900",
                                                        state === 'correct' && "border-green-200 bg-green-50 text-green-800",
                                                        state === 'correct-selected' && "border-green-300 bg-green-100 text-green-900 font-medium",
                                                        state === 'wrong' && "border-red-200 bg-red-50 text-red-900",
                                                    )}
                                                >
                                                    <span className={clsx(
                                                        "w-4 h-4 rounded-full border flex items-center justify-center mr-3 shrink-0",
                                                        state === 'normal' && "border-gray-300",
                                                        state === 'selected' && !submitted && "border-blue-600 bg-blue-600",
                                                        (state === 'correct' || state === 'correct-selected') && "border-green-600 bg-green-600",
                                                        state === 'wrong' && "border-red-500 bg-red-500",
                                                    )}>
                                                        {(state === 'selected' || state === 'correct' || state === 'correct-selected' || state === 'wrong') && (
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                        )}
                                                    </span>
                                                    <span>{opt}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Explanation */}
                                    {submitted && (
                                        <div className="mt-4 pt-3 border-t border-gray-100 text-sm">
                                            <div className="flex gap-2">
                                                <span className={clsx("font-bold", isCorrect ? "text-green-600" : "text-red-600")}>
                                                    {isCorrect ? "回答正确" : "回答错误"}
                                                </span>
                                                {!isCorrect && <span className="text-gray-600">正确答案：{q.answer}</span>}
                                            </div>
                                            {q.explanation && (
                                                <div className="mt-1 text-gray-500 bg-gray-50 p-2 rounded text-xs leading-relaxed">
                                                    解析：{q.explanation}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer Submit */}
            {!submitted && (
                <div className="fixed bottom-0 left-0 right-0 p-3 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                    <div className="max-w-5xl mx-auto flex justify-end">
                        <button
                            onClick={handleSubmit}
                            className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow-sm transition-colors text-sm"
                        >
                            提交试卷
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
