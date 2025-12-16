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

    const selectedChoices = shuffle(choices).slice(0, choiceCount);
    const selectedJudges = shuffle(judges).slice(0, judgeCount);

    // Combine
    const finalQuestions = [...selectedChoices, ...selectedJudges];

    return <QuizClient questions={finalQuestions} />;
}
