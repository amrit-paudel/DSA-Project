
import { Node, Path, Player } from "../scripts/classes.js";

// Making the game board
let gameBoard = document.querySelector(" body > .main>.game-board");
let blockk;
let blockValue;

for (let i = 100; i >= 1; i--) {

    blockk = document.createElement("div");
    blockk.setAttribute("id", i);
    blockk.setAttribute("class", "block");
    blockValue = document.createTextNode(i);
    blockk.append(blockValue);
    gameBoard.append(blockk);

}



/* GAME LOGIC */

// here in each object item [ bottomOfLadder, topOfLadder ]
export let ladder = {
    0: [8, 29],
    1: [22, 61],
    2: [54, 68],
    3: [65, 97]
    //4: [72, 93]
}

// making ladder iterable
ladder[Symbol.iterator] = function () {
    return {
        index: 0,
        values: Object.values(ladder),
        next: function () {
            return {
                value: ladder[this.index++],
                done: this.index > (Object.keys(ladder).length),
            }
        }
    }
}

let ladderData = [];

for (let item in ladder) {
    ladderData.push(...ladder[item]);
}





// here in each object item [ snakeMouth,snakeTail ]
export const snake = {
    0: [23, 17],
    1: [45, 5],
    2: [52, 33],
    3: [67, 28],
    4: [90, 50],
    5: [99, 24],
}




// We will give choice to user to choose the number of players
// up to 4 players

async function play(...players) {
    let displayPlayers = document.getElementById("current-player").children;
    let winnerFound  = false;

    for (let i = 0; i <= players.length - 1; i++) {

        displayPlayers[i].style.boxShadow = "5px 5px 30px black";
        await players[i].play();

        // checking for the winner
        if (players[i].getPlayerValue() >= 100) {
            sessionStorage.setItem("winnerPlayerValue",i);
            declareWinner();
            winnerFound = true;
        }

        while (players[i].getDiceValue() === 6 || players[i].getDiceValue() === 1) {
            await players[i].play();
            // checking for the winner
            if (players[i].getPlayerValue() >= 100) {
                sessionStorage.setItem("winnerPlayerValue",i);
                declareWinner();
                winnerFound = true;
            }
        }

        
        displayPlayers[i].style.boxShadow = "";
        console.log("SKSJSJSJSJSJSJ");
        console.log(sessionStorage.getItem("winnerPlayerValue"));


    }

    if ( winnerFound === false ) {
        play(...players);
    }

    /*
    else if (players[i].playerValue >= 100) {
        declareWinner();
    }
    */


}


// function that checks winner
function declareWinner() {

    // should display a congratulation page
    window.location.href="endingpage.html";
}



// We will form the number of players based on the playerNumber value 
let playerNumber = sessionStorage.getItem("playerNumber");

const players = []; // here the numbers of players are stored
for (let i = 1; i <= playerNumber; i++) {
    players.push(new Player());
}


// here each players gets the respective colors
const colors = ["blue", "red", "yellow", "green"];
for (let i = 0; i <= players.length - 1; i++) {
    players[i].playerColor = colors[i];
}

// Making the each player piece
let block;
let piece;
for (let i = 100; i >= 1; i--) {
    block = document.getElementById(i);

    for (let j = 0; j <= players.length - 1; j++) {
        piece = document.createElement("div");
        piece.setAttribute("id", `p${players[j].playerColor}${i}`);
        piece.setAttribute("class", "each-player-piece");
        piece.setAttribute("style", `background-color:${players[j].playerColor}`);
        block.append(piece);
    }
}






let displayPlayers = document.getElementById("current-player").children;
for (let i = 0; i <= playerNumber - 1; i++) {
    displayPlayers[i].style.display = "block";
}


/*

blue
red
yellow
green
*/


play(...players); // GAME STARTS


















