const array = [];

function namesData() {
  const names = document.querySelector("#name").value;

  const rollNoS = document.querySelector("#roll-no").value;

  array.push({
    name: names,
    rollNo: rollNoS,
  });
}

const startButton = document.querySelector("#start");
startButton.addEventListener("click", function () {
  const names = document.querySelector("#name").value;

  const rollNoS = document.querySelector("#roll-no").value;
  if (!names || !rollNoS) {
    return;
  }

  sessionStorage.setItem(
    "currentUser",
    JSON.stringify({ name: names, rollNo: rollNoS })
  );
  window.location.href = "./index.html";
});
