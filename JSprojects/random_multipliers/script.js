// const num1 = Math.ceil(Math.random() * 10)
// const num2 = Math.ceil(Math.random() * 10)

// const question = document.getElementById("question")
// const input = document.getElementById("input")
// const scoreEl = document.getElementById("score")
// const submit = document.getElementById("submit")

// let score = 0  

// const answer = num1 * num2

// question.innerText = `What is ${num1} multiplied by ${num2}?`

// submit.addEventListener("click", () => {
//     if (input.value == answer) {
//         alert("Correct!")
//         score++
//     } else {
//         alert(`Wrong! The correct answer is ${answer}.`)
//         score--
//     }

//     scoreEl.innerText = score  
//     updateLocalStorage(score)
// })

const num1 = Math.ceil(Math.random() * 10);
const num2 = Math.ceil(Math.random() * 10);

const question = document.getElementById("question");
const input = document.getElementById("input");
const scoreEl = document.getElementById("score");
const form = document.getElementById("form");

// Get score from localStorage or start at 0
let score = JSON.parse(localStorage.getItem("score"));

if (!score) {
  score = 0;
}

scoreEl.innerText = `score: ${score}`;

const answer = num1 * num2;

question.innerText = `What is ${num1} multiplied by ${num2}?`;

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const userAnswer = +input.value;

  if (userAnswer === answer) {
    score++;
  } else {
    score--;
  }

  updateLocalStorage();
  scoreEl.innerText = `score: ${score}`;

  location.reload();
});

function updateLocalStorage() {
  localStorage.setItem("score", JSON.stringify(score));
}