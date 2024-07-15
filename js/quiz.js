let currentQuestion = {};
let score = 0;
let selectedAnswerIndex = null;

const CIPHER_KEY = 'XYZABCDEFGHIJKLMNOPQRSTUVW';

async function loadQuestions() {
    const response = await fetch('data/questions.json');
    const questions = await response.json();
    return questions;
}

function displayQuestion(question) {
    currentQuestion = question;
    selectedAnswerIndex = null; // Reset selection for new question
    document.getElementById('question').textContent = question.question;
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index));
        answersDiv.appendChild(button);
    });
    
    // Debug: Log the correct answer
    console.log('Correct answer index:', decryptAnswer(question.correctAnswer));
}

function selectAnswer(index) {
    selectedAnswerIndex = index;
    const buttons = document.querySelectorAll('#answers button');
    buttons.forEach((button, i) => {
        if (i === index) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
    
    // Debug: Log the selected answer
    console.log('Selected answer index:', index);
}

function checkAnswer() {
    if (selectedAnswerIndex === null) {
        alert("Please select an answer before submitting.");
        return;
    }
    const decryptedAnswer = decryptAnswer(currentQuestion.correctAnswer);
    const correct = selectedAnswerIndex === decryptedAnswer;
    
    // Debug: Log comparison details
    console.log('Selected index:', selectedAnswerIndex);
    console.log('Decrypted correct index:', decryptedAnswer);
    console.log('Is correct:', correct);
    
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
