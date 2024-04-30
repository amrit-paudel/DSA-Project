
import { ladder, snake } from "../scripts/main.js";

// A Node class for each block
export class Node {
    constructor(value) {
        this.value = value;
        this.nextNodePtr = null;
        this.prevNodePtr = null;

        this.bottomOfLadder = null;
        this.topOfLadder = null;
        this.snakeMouth = null;
        this.snakeTail = null;
    }

    // checks whether the Node has a ladder or not
    hasLadder() {

        let result = false;
        let item;
        for (item in ladder) {
            if (this.value === (ladder[item][0])) {
                result = true;
                break;
            }
        }
        if (result) {
            this.bottomOfLadder = ladder[item][0];
            this.topOfLadder = ladder[item][1];
        }
        return result;
    }

    // checks whether the Nodes has an snake or not
    hasSnake() {

        let result = false;
        let item;
        for (item in snake) {
            if (this.value === (snake[item][0])) {
                result = true;
                break;
            }
        }
        if (result) {
            this.snakeMouth = snake[item][0];
            this.snakeTail = snake[item][1];
        }
        return result;
    }
};



// A class to make the path
export class Path {
    constructor() {
        this.firstNode = null;
        this.lastNode = null;
        this.prevFirstNode = null;
    }

    // method to construct the path
    makePath(diceValue, playerValue) {
        if (this.firstNode === null && diceValue === 1 ) {
            playerValue += diceValue;
            let newNode = new Node(playerValue);
            this.firstNode = newNode;
            this.lastNode = this.firstNode;

        }
        else if( this.firstNode !== null && playerValue >= 1 ) {
            for (let i = 1; i <= diceValue; i++) {
                let newNode = new Node(playerValue + i);
                newNode.nextNodePtr = this.firstNode;
                this.firstNode.prevNodePtr = newNode;
                this.firstNode = newNode;
                if (this.firstNode.value === 100) {
                    break;
                }
            } 
        }

        else if( this.firstNode === null && diceValue !== 1 ){
            
            return;
        }

        // checking if the node has the ladder
        if (this.firstNode.hasLadder()) {

            let newNode = new Node(this.firstNode.topOfLadder);
            newNode.nextNodePtr = this.firstNode;
            this.firstNode.prevNodePtr = newNode;
            this.firstNode = newNode;
        }

        // checking if the node has snake
        if (this.firstNode.hasSnake()) {

            let newNode = new Node(this.firstNode.snakeTail);
            newNode.nextNodePtr = this.firstNode;
            this.firstNode.prevNodePtr = newNode;
            this.firstNode = newNode;
        }


    }

    async displayPath(playerColor) {


        let tempNode = this.lastNode;

        function displayValue() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log(tempNode.value);
                    if (tempNode.nextNodePtr !== null) {
                        document.querySelector(`.main > .game-board > .block > #p${playerColor}${tempNode.nextNodePtr.value}`).style.display = "none";
                    }
                    document.querySelector(`.main > .game-board > .block > #p${playerColor}${tempNode.value}`).style.display = "block";
                    tempNode = tempNode.prevNodePtr;
                    resolve();
                }, 1000);
            })
        }


        while (tempNode !== null) {
            await displayValue();
            this.lastNode = this.firstNode;
        }


        return new Promise((resolve, reject) => {
            resolve();
        })



    }



};




// A Player class

export class Player {
    constructor() {
        this.playerValue = 0;
        this.diceValue = 0;
        this.path = new Path();
        this.playerColor = null;
    }

    getDiceValue(){
        return this.diceValue;
    }

    getPlayerValue(){
        return this.playerValue;
    }

    // a method to roll the dice
    rollDice() {

        // JS code for rolling dice
        let cube = document.getElementById("cube");
        function getWidthAndHeight() {
            let diceValue;

            let cubeChildrens = [...cube.children];
            for (let item of cubeChildrens) {
                let childWidth = item.getBoundingClientRect().width.toFixed(0);
                let childHeight = item.getBoundingClientRect().height.toFixed(0);

                if (childHeight === "105" && childWidth === "105") {
                    diceValue = item.children.length;
                    break;
                }


            }
            return diceValue;


        }

        function setDiceValue(thiss) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    thiss.diceValue = getWidthAndHeight();
                }, 7000);

            })
        }


        async function diceRoll(thiss) {

            let min = 1;
            let max = 24;

            function getRandom(max, min) {
                return (Math.floor(Math.random() * (max - min + 1)) + min) * 90;
            }

            let randomX = getRandom(max, min);
            let randomY = getRandom(max, min);

            cube.style.webkitTransform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;
            cube.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;


            // Grabbing the dice value
            await setDiceValue(thiss);
        }

        diceRoll(this);


    }

    // method to play the game
    play() {
        return new Promise((resolve, reject) => {

            let cube = document.getElementById("cube");


            const promise = new Promise((resolve, reject) => {
                cube.addEventListener("click", () => {
                    this.rollDice();
                    setTimeout(() => {
                        resolve("diceValueSet");
                    }, 7100);
                })

            });
            promise.then((data) => {
                return new Promise((resolve, reject) => {
                    if (data === "diceValueSet") {
                        // invoking the method to make path
                        this.path.makePath(this.diceValue, this.playerValue);
                    }
                    resolve("makePath");
                })
            })
                .then((data) => {
                    return new Promise((resolve, reject) => {
                        if (data === "makePath") {
                            // now lets increase the player value while traversing along the constructed path

                            this.move(this.path);
                        }
                        resolve("movePath");
                    })
                })
                .then(async (data) => {
                    if (data === "movePath") {
                        await this.path.displayPath(this.playerColor);
                    }
                    resolve();
                })

                
        })
     

    }




    async move(path) {

        let tempNode = path.lastNode;


        while (tempNode !== null) {

            this.playerValue = tempNode.value;
            tempNode = tempNode.prevNodePtr;

        }

    }
}


