let currentQuestion = {};
let score = 0;

const CIPHER_KEY = 'XYZABCDEFGHIJKLMNOPQRSTUVW';

async function loadQuestions() {
    const response = await fetch('data/questions.json');
    const questions = await response.json();
    return questions;
}

function displayQuestion(question) {
    currentQuestion = question;
    document.getElementById('question').textContent = question.question;
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index));
        answersDiv.appendChild(button);
    });
}

function selectAnswer(index) {
    const buttons = document.querySelectorAll('#answers button');
    buttons.forEach(button => button.classList.remove('selected'));
    buttons[index].classList.add('selected');
}

function checkAnswer() {
    const selectedButton = document.querySelector('#answers button.selected');
    if (!selectedButton) return;
    const selectedAnswer = Array.from(selectedButton.parentNode.children).indexOf(selectedButton);
    const correct = selectedAnswer === decryptAnswer(currentQuestion.correctAnswer);
    if (correct) {
        score++;
        document.getElementById('score-value').textContent = score;
        // Here you would call a function to handle the crypto reward
        // rewardPlayer(score);
    }
    displayResult(correct);
}

function displayResult(correct) {
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = correct ? 'Correct!' : 'Incorrect. Try again!';
    resultDiv.style.color = correct ? 'green' : 'red';
}

function decryptAnswer(encryptedAnswer) {
    // Step 1: Decode Base64
    let decoded = atob(encryptedAnswer);
    
    // Step 2: Remove random padding (last 3 characters)
    decoded = decoded.slice(0, -3);
    
    // Step 3: Apply substitution cipher
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
        let index = CIPHER_KEY.indexOf(decoded[i]);
        if (index !== -1) {
            decrypted += String.fromCharCode(index + 65);
        } else {
            decrypted += decoded[i];
        }
    }
    
    // Step 4: Convert to number and subtract 1 (0-based index)
    return parseInt(decrypted, 36) - 1;
}

// Export functions to be used in app.js
export { loadQuestions, displayQuestion, checkAnswer };
