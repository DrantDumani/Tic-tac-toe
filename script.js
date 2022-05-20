//use IIFE for gameboard
const plyr1 = {
    piece: "X"
}

const plyr2 = {
    piece: "O"
}

const gameBoard = (() => {
    const board = document.querySelector(".game-board")
    let currPlyr = null
    const setCurrPlyr = () => {
        currPlyr = currPlyr === plyr1 ? plyr2 : plyr1
    }

    let turnCount = 0
    const setTurnCount = (num) => { turnCount = num }

    const boardArr = []
    const editBoardArr = (index, str = "") => { boardArr[index] = str }
    const takeTurn = (index, elem, text) => {
        elem.textContent = text
        editBoardArr(index, text)
        setCurrPlyr()
        setTurnCount(turnCount += 1)
        console.log(turnCount)
    }

    const init = () => {
        currPlyr = plyr1
        for (let ind = 0; ind < 9; ind += 1) {

            let button = document.createElement("button")
            button.addEventListener("click", (e) => {
                takeTurn(ind, e.target, currPlyr.piece)
            })

            board.appendChild(button)
            editBoardArr(ind)
        }
    }
    return { init, setCurrPlyr, setTurnCount }
})()

gameBoard.init()

// function initGame() {
//     const gameBoard = document.querySelector(".game-board")
//     for (let index = 0; index < 9; index += 1) {
//         let button = document.createElement("button")
//         button.addEventListener("click", () => {
//             globalGameTest[index] = "X"
//             button.textContent = "X"
//             console.log(index, globalGameTest)
//         })

//         gameBoard.appendChild(button)
//         globalGameTest.push("")
//     }
// }

// const globalGameTest = []

// initGame()