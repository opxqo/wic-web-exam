import questions from './data/questions.json';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function Home() {
  const choiceLimit = questions.filter((q: any) => q.type === 'choice').length;
  const judgeLimit = questions.filter((q: any) => q.type === 'judge').length;

  async function startQuiz(formData: FormData) {
    'use server';
    const c = formData.get('choiceCount');
    const j = formData.get('judgeCount');
    redirect(`/quiz?c=${c}&j=${j}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            武汉城市学院
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Web企业级开发考试选判题练习
          </p>
        </div>

        <form action={startQuiz} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                单选题数量 (题库共 {choiceLimit} 题)
              </label>
              <input
                name="choiceCount"
                type="number"
                min="0"
                max={choiceLimit}
                defaultValue="20"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                判断题数量 (题库共 {judgeLimit} 题)
              </label>
              <input
                name="judgeCount"
                type="number"
                min="0"
                max={judgeLimit}
                defaultValue="10"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors text-base"
            >
              开始答题
            </button>
          </div>

          <p className="text-xs text-center text-gray-400 mt-4">
            系统生成的试卷仅供练习，请以实际考试要求为准。
          </p>
        </form>
      </div>
    </main>
  );
}
