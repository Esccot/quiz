const user = JSON.parse(sessionStorage.getItem("currentUser"));
//taking the data from the first page

if (!user) {
  // if quiz is directly opend then it will redirected to this page
  window.location.href = "./user.html";
}

// created an empty array
let questions = [];

//call back the fetchQuestions function here
fetchQuestions();

function fetchQuestions() {
  // using fetch to get the data from the api url
  // fetch basically sends a request to that link and asks for data

  fetch("https://opentdb.com/api.php?amount=5&type=multiple")
    // when the data comes back, it first comes as a response
    // response is not usable directly so we convert it into json

    .then((res) => res.json())
    // after converting to json, now we finally get the actual data
    // this data contains an object and inside that object there
    //  is an array called results
    /* u have to check in which format api is giving the data u can do it by 
    console.log(data) in the console  and this api gave me this format
    {
  response_code: 0,
  results: [
    { question: "...", correct_answer: "...", incorrect_answers: [...] },
    { question: "...", correct_answer: "...", incorrect_answers: [...] }
  ]
}*/

    .then((data) => {
      // here we are converting the api data format into OUR quiz format
      // map means go through each question one by one

      questions = data.results.map((q) => {
        // api gives incorrect answers as array and correct answer as string
        // so we merge them together to make one options array

        const correct = decodeHTML(q.correct_answer);
        const options = [...q.incorrect_answers, q.correct_answer];

        // randomising the options so the coreect answer is not always last
        options.sort(() => Math.random() - 0.5);

        return {
          question: decodeHTML(q.question), //actual question text
          options: options.map((opt) => decodeHTML(opt)), // all options (shuffled)
          // finding the position of correct answer in options
          // +1 because our radio values start from 1 not 0
          answer: options.indexOf(correct) + 1,
        };
      });

      displayQuestionsAndOptions();
      startTimer();
    });
}

let timeLeft = 90;
// created a variable of timeLeft

let timerInterval;
/* just craeted the variable here and use is later
 this is just like i created a box and i will put 
 something in it later when i need it thats it */

const question = document.querySelector("#questions");
/*selected the questions using id and stores it in a variable of 
questions so that we can acess it whenever we want it
*/

const btn = document.querySelector("#button");
/*same here selected the button and stored it in a varible
of btn for easy acess */

const options = document.querySelector("#options");
/* selected the options and stored it */

let index = 0;
// defined the index as 0

function displayQuestionsAndOptions() {
  // questions logic

  question.innerHTML = "";
  /*clearing the questions evertime for the next 
  question to appear so that it won't show two question at a time*/

  const questionli = document.createElement("li");
  /* dynamically created an element list and stored it */

  questionli.textContent = questions[index].question;
  /* what we have done here is that what should be the
   content of the list we created and questions[index].question means 
   look inside the questions for question
   here questions is actually our array like this 
   questions[{
   question: some question here,
   options: four options here,
   answer: some integer here,
   }] 
  */

  questionli.classList.add("question");
  // added a class for styling the question later

  question.appendChild(questionli);
  options.innerHTML = "";
  //cleared the options everytime and same reason as before

  // options + radio  logic
  for (let i = 0; i < questions[index].options.length; i++) {
    /*used a for loop and given a starting point that is 0 and the ending point
    questions[index].options.length what this means is look inside
    questions for options and check the length of options and that is the ending point
     after that increment in the i that is i++*/

    const li = document.createElement("li");
    //dynamically created an element list and stored it

    const input = document.createElement("input");
    //dynamically created an element input and stored it

    input.type = "radio";
    // told the javascript which type of input it is here it is radio

    input.name = "question-" + index;
    /* given a name to the input cause if dont do it then the user can
    select all the radios */

    input.value = i + 1;
    // given the vlaues to the input

    input.classList.add("radio");
    // added a class for styling it later

    li.appendChild(input);
    li.appendChild(document.createTextNode(" " + questions[index].options[i]));
    /*appended a text node cause dom always needs a node I used [i] cause
    we want the one option at a time  */
    options.appendChild(li);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  //clear the interval bafore starting the timer

  timerInterval = setInterval(() => {
    /* this is the box we created erlier and said we use it when we need it 
    and now we assingened the value to the box or in coding term variable  */

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      /*this means if time becomes zero than clear the interval */

      index++;
      /* incremented the index for next question like an skip cause when time ends
      the question will automatically skip*/
      timeLeft = 90;
      // reassign the tme here
      if (index < questions.length) {
        displayQuestionsAndOptions();
        startTimer();
      } else {
        showResult();
        return;
      }
    }
    timeLeft--;
    //decrementing the tme

    const minutes = Math.floor(timeLeft / 60);
    //figure out this yourself 😪😴
    const seconds = timeLeft % 60;
    // this too 😪😴
    document.getElementById("timer").textContent = `Time: ${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  }, 1000);
}

/* **Note**: the setInterval takes two inputs one is what to execute
and one is how long it needs to wait */

let score = 0;

function calculateScore() {
  const selectedOption = document.querySelector(
    'input[name="question-' + index + '"]:checked'
  );
  /*this is just selecting the input we created and javascript will check is this 
  selected or not  */
  if (selectedOption) {
    // if selected then do this
    const selectedValue = parseInt(selectedOption.value);
    // taking the value from selected option and made it integer using parseInt
    if (selectedValue === questions[index].answer) {
      //compairing the values with the correct answer

      score += 4;
      // increasing the score by 4
    } else {
      score -= 1;
      // negative marking
    }
  }
}

// question changing logic

btn.addEventListener("click", function () {
  calculateScore();
  // calling the calculteScore() function

  if (index === questions.length - 2) {
    btn.innerHTML = "submit";
    /* if u r thinking why we are subtracting 2 here?
    actually our one question is already displayed then we have left with our 4
    questions and we want the button to change the innerHtml to submit at the last 
    question  thats why*/
  }

  if (index >= questions.length - 1) {
    showResult();
    saveToLeaderBoard();
    displayLeaderBoard();
    return;
  } else {
    index++;
  }

  clearInterval(timerInterval);
  timeLeft = 90;
  displayQuestionsAndOptions();
  startTimer();
});

function showResult() {
  question.innerHTML = "";
  options.innerHTML = "";
  // before showing result clear the questions and options

  clearInterval(timerInterval);
  //after qui

  const maxScore = questions.length * 4;
  // assinging the max score
  let finalScore = score;
  let resultLi = document.createElement("li");
  //dynamically created the element list
  resultLi.textContent =
    " your final score is " + finalScore + " out of " + maxScore;

  // this is the content of the list that willbe shown

  let resultbox = document.querySelector("#resultBox");
  // selected the resulBox
  resultbox.appendChild(resultLi);
  btn.remove();
  // at the end while before showing result delete the button
}

function saveToLeaderBoard() {
  let leaderBoard = JSON.parse(localStorage.getItem("leaderBoard")) || [];
  /* here we are getting the data from the **leaderBoard** by using **getItem**
  and **JSON** is javascript object notation so are u thinking what is parse ??
  so parse is coverting string back to object actually we have stored the data in
  string and localstorage always needs strings to store the data  */

  const userExist = leaderBoard.find((e) => e.name === user.name);
  //this line simply checking if the same name userexist

  if (userExist) {
    if (score > userExist.scores) {
      userExist.scores = score;
      //then update the existing user **score**
    }
  } else {
    leaderBoard.push({
      name: user.name,
      rollNo: user.rollNo,
      scores: score,
    });
    // or other wise push to the **leaderBoard**
  }

  leaderBoard.sort((a, b) => b.scores - a.scores);

  localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
  /*  here see i used stringify so as i said earlier **localStorage** stores data
  only in string so we converted it to string and what setItem is doing this is 
  means set the item and give a **key** and here **key** is **leaderBoard** and value is
  **JSON.stringify(leaderBoard) so in the last it means store this **value** to the 
  **key** */
}

function displayLeaderBoard() {
  let leaderBoard = JSON.parse(localStorage.getItem("leaderBoard")) || [];
  /* this means give me the data that is stored in the **leaderBoard** or 
  give me an empty array */

  const leader = document.querySelector("#leader");
  // selected the id **leader**
  leaderBoard.forEach((entry, i) => {
    const div = document.createElement("div");
    div.classList.add("text");
    const paragraph = document.createElement("p");
    const paragraph2 = document.createElement("p");
    const paragraph3 = document.createElement("p");
    paragraph.textContent = `${1 + i}. ${entry.name}`;
    paragraph2.textContent = `${entry.rollNo}`;
    paragraph3.textContent = `${entry.scores}`;

    div.append(paragraph, paragraph2, paragraph3);
    leader.appendChild(div);
  });

  // here are the same things just figure out yourself 😪😪
}

function decodeHTML(text) {
  const txt = document.createElement("textarea");
  txt.innerHTML = text;
  return txt.value;
}
