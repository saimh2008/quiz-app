const quiz = document.querySelector("#quiz");
const startBtn = document.querySelector(".startBtn")
const heading = document.querySelector(".heading")

let currentQuestion;
let questionsArray = [];
let score = 0;
let totalQuestions = 0;
let questionNumber = 0;


// -------------------------
// Question select
// -------------------------

function selectQuestion(questionsArray) {
    const randomIndex = Math.floor(Math.random() * questionsArray.length);
    return questionsArray[randomIndex];
}


// -------------------------
// questions show
// -------------------------

function showQuestion(randomQuestion) {
    questionNumber++;

    heading.innerHTML = `<p>Question ${questionNumber} / ${totalQuestions}</p>`

    const progressBar = document.querySelector(".progress-bar");
    progressBar.style.display = "block";
    const progress = document.querySelector(".progress");
    progress.style.width = `${(questionNumber / totalQuestions) * 100}%`;

    quiz.innerHTML = `
        <h2>${randomQuestion.question}</h2>
    `;

    const answers = [
        randomQuestion.correct_answer,
        ...randomQuestion.incorrect_answers
    ];

    answers.sort(() => Math.random() - 0.5);

    answers.forEach(answer => {

        const button = document.createElement("button");

        button.textContent = answer;
        button.className = "answer-btn";

        quiz.appendChild(button);
    });
}

// -------------------------
// Fetch questions
// -------------------------
startBtn.addEventListener("click", () => {
    startBtn.style.display = 'none'
    quiz.innerHTML = `<div class="loadingScrn">
    <p>Loading... Please wait</p>
    </div>`
    Promise.all([
        fetch("https://opentdb.com/api.php?amount=5&category=18"),
        fetch("https://opentdb.com/api.php?amount=5&category=19")
    ])
        .then(responses =>
            Promise.all(
                responses.map(response => response.json())
            )
        )
        .then(data => {

            const computerQuestions = data[0].results;
            const mathsQuestions = data[1].results;

            questionsArray = [
                ...computerQuestions,
                ...mathsQuestions
            ];

            totalQuestions = questionsArray.length

            currentQuestion = selectQuestion(questionsArray);

            questionsArray = questionsArray.filter(
                question => question !== currentQuestion
            );

            showQuestion(currentQuestion);

        })

});



// -------------------------
// Answers clickable
// -------------------------

quiz.addEventListener("click", (e) => {

    if (!e.target.classList.contains("answer-btn")) {
        return;
    }

    const button = e.target;

    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.disabled = true;
    });

    if (button.textContent === currentQuestion.correct_answer) {
        score++;
        button.textContent += " ✅";
        button.classList.add("correct");
    }
    else {
        const correctButton = [...document.querySelectorAll(".answer-btn")]
            .find(btn => btn.textContent === currentQuestion.correct_answer);

        correctButton.classList.add("correct");
        correctButton.textContent += " ✅";

        button.classList.add("wrong");
        button.textContent += " ❌";
    }

    // Next button
    const nextBtn = document.createElement("button");

    if (questionNumber === totalQuestions) {
        nextBtn.textContent = "Finish Quiz";
    } else {
        nextBtn.textContent = "Next Question";
    }

    nextBtn.className = "next-btn";
    quiz.appendChild(nextBtn);
});


// -------------------------
// Next Question
// -------------------------

quiz.addEventListener("click", (e) => {
    if (e.target.classList.contains("restart-btn")) {
        location.reload();
    }
    if (!e.target.classList.contains("next-btn")) {
        return;
    }

    if (questionsArray.length === 0) {
        document.querySelector(".progress-bar").style.display='none'
        heading.innerHTML = ``
        quiz.innerHTML = `
        <h2 class="finished-title">Quiz Finished 🎉</h2>
        <p class="final-score">Your Score: ${score} / ${totalQuestions}</p>
        <button class="restart-btn">Restart Quiz</button>
        `;
        return;
    }

    currentQuestion = selectQuestion(questionsArray);

    questionsArray = questionsArray.filter(
        question => question !== currentQuestion
    );

    showQuestion(currentQuestion)


});


