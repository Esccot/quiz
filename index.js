const questions = [
  {
    question: " 1. what is javascript mainly used for?",
    options: [
      " A. styling webpages",
      " B. making webpages intreactive",
      " C. creating databases",
      " D. designing logos",
    ],

    answer: 2,
  },

  {
    question:
      " 2. which keyword is used to declare a variable that can change?",
    options: [" A. const", " B. let", " C. static", " D. fixed"],
    answer: 2,
  },

  {
    question: " 3. what does addeventlistener do?",
    options: [
      " A. adds css to an element ",
      " B. listens for users actions like click ",
      " C. creates a new html element",
      " D. deletes element",
    ],

    answer: 2,
  },

  {
    question: " 4. what does arry.length do return?",
    options: [
      " A. last index of an array",
      " B. total number of items ",
      " C. first element",
      " D. array type",
    ],
    answer: 2,
  },

  {
    question: " 5. which one is not a javascript data type?",
    options: [" A. string", " B. number", " C. boolean", " D. character"],
    answer: 4,
  },
];
const question = document.querySelector("#questions");
const btn = document.querySelector("#button");
const options = document.querySelector("#options");
let index = 0;

function displayQuestionsAndOptions() {
  // questions logic
  question.innerHTML = "";
  const questionli = document.createElement("li");
  questionli.textContent = questions[index].question;
  questionli.classList.add("question");
  question.appendChild(questionli);
  options.innerHTML = "";

  // options + radio  logic
  for (let i = 0; i < questions[index].options.length; i++) {
    const li = document.createElement("li");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "question-" + index;
    input.value = i + 1 ;
    input.classList.add("radio");
    li.appendChild(input);
    li.appendChild(document.createTextNode(" " + questions[index].options[i]));
    options.appendChild(li);
  }
}

displayQuestionsAndOptions();

let score = 0;

function calculateScore() {
  const selectedOption = document.querySelector(
    'input[name="question-' + index + '"]:checked'
  );
  if (selectedOption) {
    const selectedValue = parseInt(selectedOption.value);
    if (selectedValue === questions[index].answer) {
      score += 4;
    } else {
      score -= 1;
    }
  }
}

// question changing logic

btn.addEventListener("click", function () {
  calculateScore();

  if (index === questions.length - 2) {
    btn.innerHTML = "submit";
  }

  if (index >= questions.length - 1) {
    showResult();
    return;
  } else {
    index++;
  }

  displayQuestionsAndOptions();
});

function showResult() {
  question.innerHTML = "";
  options.innerHTML = "";

  const maxScore = questions.length * 4;
  let finalScore = score;
  let resultLi = document.createElement("li");
  resultLi.textContent =
    " your final score is " + finalScore + " out of " + maxScore;

  let resultbox = document.querySelector("#resultBox");
  resultbox.appendChild(resultLi);
  btn.remove();
}
