//separate game, player, and DOM logic
//use IIFE for gameboard and game logic
const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""]
    const editBoard = (index, str) => {
        board[index] = str
    }
    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = ""
        }
    }

    const getBoardSpace = (index) => board[index]
    return { editBoard, resetBoard, getBoardSpace }
})()

const gameLogic = (() => {
    let turnCount = 0
    let gameState = "playing"
    const setTurnCount = (num) => { turnCount = num }
    const resetTurnCount = () => setTurnCount(0)

    const players = ["X", "O"]
    let currPlyr = players[0]

    const checkVictory = (index) => {
        let neighbors = null
        let space = gameBoard.getBoardSpace(index)

        switch (index) {
            case 0:
                neighbors = [1, 2, 3, 6, 4, 8]
                break;
            case 1:
                neighbors = [0, 2, 4, 7]
                break;
            case 2:
                neighbors = [0, 1, 5, 8, 4, 6]
                break;
            case 3:
                neighbors = [4, 5, 0, 6]
                break;
            case 4:
                neighbors = [0, 8, 1, 7, 2, 6, 3, 5]
                break
            case 5:
                neighbors = [3, 4, 2, 8]
                break
            case 6:
                neighbors = [0, 3, 7, 8]
                break;
            case 7:
                neighbors = [1, 4, 6, 8]
                break;
            case 8:
                neighbors = [2, 5, 6, 7, 0, 4]
        }

        for (let s = 0; s < neighbors.length; s += 2) {
            if (space === gameBoard.getBoardSpace(neighbors[s]) &&
                space === gameBoard.getBoardSpace(neighbors[s + 1])) {
                gameState = "game over"
                console.log(`${currPlyr} has won the game`)
            }
        }
    }

    const takeTurn = (index) => {
        if ((gameBoard.getBoardSpace(index) !== "") || gameState !== "playing") return
        gameBoard.editBoard(index, currPlyr)

        if (turnCount >= 3) checkVictory(index)
        setTurnCount(turnCount + 1)
        currPlyr = players[(players.indexOf(currPlyr) + 1) % players.length]
    }
    return { setTurnCount, resetTurnCount, takeTurn }
})()

let boardElem = document.querySelector(".game-board")
let spaces = boardElem.querySelectorAll("button")

for (let i = 0; i < spaces.length; i++) {
    spaces[i].addEventListener("click", (e) => {
        gameLogic.takeTurn(i)
        e.target.textContent = gameBoard.getBoardSpace(i)
    })
}