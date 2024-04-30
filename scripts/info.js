


let playerNumberValue ;

const playerNumbers = {
    number: playerNumberValue,
}


let startGame = document.getElementById("start-game");
let playerNumber = document.getElementById("no-of-players");


playerNumberValue = playerNumber.value[playerNumber.value.length - 1];
sessionStorage.setItem("playerNumber",playerNumberValue);

startGame.addEventListener("click", () => {
    playerNumberValue = playerNumber.value[playerNumber.value.length - 1];
    sessionStorage.removeItem("playerNumber")
    sessionStorage.setItem("playerNumber",playerNumberValue);

})







