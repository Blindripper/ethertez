import { connectWallet } from './wallet.js';
import { initializeQuiz } from './quiz.js';

async function initializeApp() {
    await initializeQuiz();
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
}

document.addEventListener('DOMContentLoaded', initializeApp);
