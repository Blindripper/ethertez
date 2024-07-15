import { connectWallet } from './wallet.js';
import { loadQuestions, displayQuestion, checkAnswer } from './quiz.js';

let questions = [];
let currentQuestionIndex = 0;

async function initializeApp() {
    questions = await loadQuestions();
    if (questions.length > 0) {
        displayQuestion(questions[currentQuestionIndex]);
    }

    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
    document.getElementById('submit-answer').addEventListener('click', handleSubmitAnswer);
}

function handleSubmitAnswer() {
    checkAnswer();
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    displayQuestion(questions[currentQuestionIndex]);
}

document.addEventListener('DOMContentLoaded', initializeApp);
