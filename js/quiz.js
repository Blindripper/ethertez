let currentQuestion = {};
let score = 0;
let selectedAnswerIndex = null;
let questions = [];
let currentQuestionIndex = 0;

const CIPHER_KEY = 'XYZABCDEFGHIJKLMNOPQRSTUVW';

async function loadQuestions() {
    const response = await fetch('data/questions.json');
    questions = await response.json();
    return questions;
}

function displayQuestion(question) {
    currentQuestion = question;
    selectedAnswerIndex = null;
    document.getElementById('question').textContent = question.question;
    const answersDiv = document.getElementById('answers');
    answersDiv.innerHTML = '';
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.textContent = answer;
        button.addEventListener('click', () => selectAnswer(index));
        answersDiv.appendChild(button);
    });
    
    console.log('Current Question:', question.question);
    console.log('Encrypted correct answer:', question.correctAnswer);
    console.log('Decrypted correct answer index:', decryptAnswer(question.correctAnswer));
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
    
    console.log('Selected answer index:', index);
}

function checkAnswer() {
    if (selectedAnswerIndex === null) {
        alert("Please select an answer before submitting.");
        return;
    }
    const decryptedAnswer = decryptAnswer(currentQuestion.correctAnswer);
    const correct = selectedAnswerIndex === decryptedAnswer;
    
    console.log('Question:', currentQuestion.question);
    console.log('Selected index:', selectedAnswerIndex);
    console.log('Selected answer:', currentQuestion.answers[selectedAnswerIndex]);
    console.log('Encrypted correct answer:', currentQuestion.correctAnswer);
    console.log('Decrypted correct index:', decryptedAnswer);
    console.log('Correct answer:', currentQuestion.answers[decryptedAnswer]);
    console.log('Is correct:', correct);
    
    if (correct) {
        score++;
        document.getElementById('score-value').textContent = score;
    }
    displayResult(correct);
    
    // Move to the next question
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    displayQuestion(questions[currentQuestionIndex]);
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
        let index = CIPHER_KEY.indexOf(decoded[i].toUpperCase());
        if (index !== -1) {
            decrypted += String.fromCharCode(index + 65);
        } else {
            decrypted += decoded[i];
        }
    }
    
    // Step 4: Convert from base 36 and subtract 1 (0-based index)
    let result = parseInt(decrypted, 36) - 1;
    
    // Ensure the result is within the valid range (0-3 for 4 answers)
    return result >= 0 && result <= 3 ? result : 0;
}

async function initializeQuiz() {
    questions = await loadQuestions();
    if (questions.length > 0) {
        displayQuestion(questions[currentQuestionIndex]);
    }
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
}

// Export functions to be used in app.js
export { initializeQuiz };
