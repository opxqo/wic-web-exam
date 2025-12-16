import questions from '../data/questions.json';
import QuizClient, { Question } from './QuizClient';

function shuffle(array: any[]) {
    let currentIndex = array.length, randomIndex;
    const newArr = [...array];

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArr[currentIndex], newArr[randomIndex]] = [
            newArr[randomIndex], newArr[currentIndex]];
    }

    return newArr;
}

/**
 * Stratified sampling to ensure uniform distribution across modules.
 * Algorithm: Round Robin selection from shuffled module queues.
 */
function stratifiedSample(questions: any[], count: number) {
    if (count <= 0) return [];

    // 1. Group by module
    const groups: Record<string, any[]> = {};
    questions.forEach(q => {
        const m = q.module || 'default';
        if (!groups[m]) groups[m] = [];
        groups[m].push(q);
    });

    // 2. Shuffle each group
    const queues = Object.values(groups).map(g => shuffle(g));

    // 3. Round Robin collection
    const selected = [];
    let i = 0;
    while (selected.length < count && queues.some(q => q.length > 0)) {
        const queue = queues[i % queues.length];
        if (queue.length > 0) {
            selected.push(queue.pop());
        }
        i++;
    }

    // 4. Final shuffle to mix modules in the output list
    return shuffle(selected);
}

export default async function QuizPage({
    searchParams,
}: {
    searchParams: Promise<{ c?: string; j?: string }>
}) {
    const { c, j } = await searchParams;
    const choiceCount = parseInt(c || '20', 10);
    const judgeCount = parseInt(j || '10', 10);

    const choices = questions.filter((q: any) => q.type === 'choice') as Question[];
    const judges = questions.filter((q: any) => q.type === 'judge') as Question[];

    const selectedChoices = stratifiedSample(choices, choiceCount);
    const selectedJudges = stratifiedSample(judges, judgeCount);

    // Combine
    const finalQuestions = [...selectedChoices, ...selectedJudges] || [];

    if (finalQuestions.length === 0) {
        console.warn("No questions were selected. This might indicate issues with the data source.");
        throw new Error("未能加载题目数据，请联系管理员检查题库配置。");
    }

    return <QuizClient questions={finalQuestions} />;
}
