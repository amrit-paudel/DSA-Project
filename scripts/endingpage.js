

let winner = document.querySelector("#winner");
const players = ["Player 1","Player 2","Player 3","Player 4"];
let winnerValue = sessionStorage.getItem("winnerPlayerValue");

winner.innerHTML = players[winnerValue];

let replayButton = document.querySelector("#replay-button");

replayButton.addEventListener("click", () => {
    replayButton.href = "home.html";
})

