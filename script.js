let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let timer;
let timeLeft = 30;

// Função para carregar perguntas do arquivo JSON
async function loadQuestions() {
    try {
        const response = await fetch('questions.json'); // Caminho para o arquivo JSON
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        questions = data;
        startQuiz();
    } catch (error) {
        console.error('Houve um problema com a requisição Fetch:', error);
    }
}

function startQuiz() {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-header').style.display = 'flex';
    document.getElementById('quiz').style.display = 'flex';
    document.getElementById('result-screen').style.display = 'none';
    loadQuestion();
    updateScore();
    updateLives();
}

function startTimer() {
    timeLeft = 30;
    document.getElementById('timer').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            handleIncorrectAnswer();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById('question').innerText = question.question;
    question.options.forEach((option, index) => {
        const button = document.getElementById(`option${index + 1}`);
        button.innerText = option;
        button.classList.remove('correct', 'incorrect');
    });
    document.getElementById('nextButton').style.display = 'none';
    startTimer();
}

function selectOption(index) {
    stopTimer();
    const question = questions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');

    options.forEach((btn, i) => {
        if (i === question.correct) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('incorrect');
        }
    });

    if (index === question.correct) {
        score++;
        document.getElementById('result').innerText = ''; //Pro caso de eu querer adicionar alguma menasgem ao responder alguma pergunta
    } else {
        handleIncorrectAnswer();
    }
    document.getElementById('nextButton').style.display = 'block';
    updateScore();
}

function handleIncorrectAnswer() {
    lives--;
    updateLives();
    document.getElementById('result').innerText = ''; //Pro caso de eu querer adicionar alguma mensagem ao responder alguma pergunta
    if (lives <= 0) {
        showGameOver();
    } else {
        document.getElementById('nextButton').style.display = 'block';
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions.length) {
        showResult();
    } else {
        loadQuestion();
        resetOptions();
        stopTimer();
    }
}

function showResult() {
    stopTimer();
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result-screen').style.display = 'flex';
    document.getElementById('result-message').innerText = `Parabéns, você acertou ${score} de ${questions.length} perguntas!`;
}

function showGameOver() {
    stopTimer();
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result-screen').style.display = 'flex';
    document.getElementById('result-message').innerText = `Game Over! Você acertou ${score} de ${questions.length} perguntas.`;
}

function restartGame() {
    score = 0;
    lives = 3;
    currentQuestionIndex = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    document.getElementById('quiz-header').style.display = 'none'; // Esconder o cabeçalho ao reiniciar
    updateScore();
    updateLives();
}

function updateScore() {
    document.getElementById('score').innerText = `Acertos: ${score}`;
}

function updateLives() {
    document.getElementById('lives').innerText = `Vidas: ${lives}`;
}

document.getElementById('start-button').addEventListener('click', loadQuestions);
