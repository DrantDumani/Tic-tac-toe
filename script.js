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
    const getBoardInfo = () => [...board]

    const getBoardSpace = (index) => board[index]
    return { getBoardInfo, editBoard, resetBoard, getBoardSpace }
})()

const gameLogic = (() => {
    let turnCount = 0
    let gameState = "playing"
    const getGameState = () => {
        return gameState
    }
    const setGameState = (nextState) => { gameState = nextState }
    const setTurnCount = (num) => { turnCount = num }
    const resetTurnCount = () => setTurnCount(0)

    const players = []
    let currPlyr = null
    const setPlayers = (plyr, index) => {
        players[index] = plyr
    }
    const resetCurrPlyr = () => { currPlyr = players[0] }
    const getPlayers = () => players

    const checkVictory = (index, board) => {
        let neighbors = null
        let space = board[index]

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
                neighbors = [0, 3, 7, 8, 2, 4]
                break;
            case 7:
                neighbors = [1, 4, 6, 8]
                break;
            case 8:
                neighbors = [2, 5, 6, 7, 0, 4]
        }

        for (let s = 0; s < neighbors.length; s += 2) {
            let positions = neighbors.slice(s, s + 2)
            if (positions.every(el => board[el] === space)) return true
        }
        return false
    }

    const nextPlayer = () => players[(players.indexOf(currPlyr) + 1) % players.length]

    const minimax = (board, index, alpha, beta, isMax, depth) => {
        if (checkVictory(index, board)) {
            return board[index] === currPlyr.getStr() ? 1 : -1
        } else if (board.filter(el => el === "").length === 0 || depth === 0) {
            return 0
        }
        let score
        if (isMax) {
            let bestScore = -Infinity
            let minOrMaxPlayer = currPlyr
            for (let j = 0; j < board.length; j++) {
                if (board[j] === "") {
                    board[j] = minOrMaxPlayer.getStr()
                    score = minimax(board, j, alpha, beta, false, depth - 1)
                    board[j] = ""
                    bestScore = Math.max(score, bestScore)
                    alpha = Math.max(score, alpha)
                    if (beta <= alpha) break
                }
            }
            return bestScore
        } else {
            let bestScore = Infinity
            let minOrMaxPlayer = nextPlayer()
            for (let j = 0; j < board.length; j++) {
                if (board[j] === "") {
                    board[j] = minOrMaxPlayer.getStr()
                    score = minimax(board, j, alpha, beta, true, depth - 1)
                    board[j] = ""
                    bestScore = Math.min(score, bestScore)
                    beta = Math.min(score, beta)
                    if (beta <= alpha) break
                }
            }
            return bestScore
        }
    }

    const cpuHandler = () => {
        let plyrType = currPlyr.getType()
        const freeIndices = gameBoard.getBoardInfo().reduce((arr, el, ind) => {
            if (el === "") {
                return arr.concat(ind)
            }
            return arr
        }, [])
        let chosenIndex
        switch (plyrType) {
            case "Human":
                return
            case "Easy AI":
                let randomIndex = freeIndices[Math.floor(Math.random() * freeIndices.length)]
                chosenIndex = randomIndex
                let buttons = document.querySelectorAll(".game-board button")
                buttons[randomIndex].textContent = gameBoard.getBoardSpace(randomIndex)
                break
            case "Normal AI":
            case "Impossible AI":
                let depth = plyrType === "Impossible AI" ? Infinity : 2
                let testBoard = [...gameBoard.getBoardInfo()]
                let bestIndex
                let bestScore = -Infinity

                for (let i = 0; i < testBoard.length; i++) {
                    if (testBoard[i] === "") {
                        testBoard[i] = currPlyr.getStr()
                        let score = minimax(testBoard, i, -Infinity, Infinity, false, depth)
                        testBoard[i] = ""
                        if (score > bestScore) {
                            bestScore = score
                            bestIndex = i
                        }
                    }
                }
                chosenIndex = bestIndex
                break;
        }
        takeTurn(chosenIndex)
        let buttons = document.querySelectorAll(".game-board button")
        buttons[chosenIndex].textContent = gameBoard.getBoardSpace(chosenIndex)
    }

    const takeTurn = (index) => {
        if ((gameBoard.getBoardSpace(index) !== "") || gameState !== "playing") return
        let currStr = currPlyr.getStr()
        gameBoard.editBoard(index, currStr)

        setTurnCount(turnCount + 1)
        if (turnCount >= 5) {
            if (checkVictory(index, gameBoard.getBoardInfo())) {
                currPlyr.setScore(1)
                setEndText(`${currPlyr.getName()} has won the game!`)
                currPlyr = players[0]
                gameState = "game over"
                stateManager()
            }
            if (turnCount >= 9 && gameState === "playing") {
                setEndText("It was a tie!")
                gameState = "game over"
                stateManager()
            }
        }
        if (gameState === "playing") {
            currPlyr = nextPlayer()
            cpuHandler()
        }
    }
    return {
        getPlayers,
        setPlayers,
        resetCurrPlyr,
        setTurnCount,
        resetTurnCount,
        takeTurn,
        setGameState,
        getGameState,
        cpuHandler
    }
})()

let boardElem = document.querySelector(".game-board")
let spaces = boardElem.querySelectorAll("button")

for (let i = 0; i < spaces.length; i++) {
    spaces[i].addEventListener("click", (e) => {
        gameLogic.takeTurn(i)
        e.target.textContent = gameBoard.getBoardSpace(i)
    })
}

function createPlayers(name, type, index) {
    const getName = () => name
    const getType = () => type
    let score = 0
    const setScore = (num) => { score += num }
    const getScore = () => score
    const str = index === 0 ? "X" : "O"
    const getStr = () => str
    return { getName, getType, setScore, getScore, getStr }
}

let startBttn = document.querySelector(".start-btn")
startBttn.addEventListener("click", () => {
    let plyrDivs = document.querySelectorAll(".plyr-options")
    for (let i = 0; i < plyrDivs.length; i++) {
        let name = plyrDivs[i].querySelector("input").value || `Player ${i+1}`
        let type = plyrDivs[i].querySelector("select").value
        let plyr = createPlayers(name, type, i)
        gameLogic.setPlayers(plyr, i)
        gameLogic.resetCurrPlyr()
        gameLogic.setTurnCount(0)
    }
    gameLogic.setGameState("playing")
    stateManager()
    gameLogic.cpuHandler()
})

let restartBtn = document.querySelector(".restart-btn")
restartBtn.addEventListener("click", () => {
    gameLogic.setGameState("playing")
    gameLogic.resetCurrPlyr()
    stateManager()
    gameLogic.cpuHandler()
})

let menuBtn = document.querySelector(".menu-btn")
menuBtn.addEventListener("click", () => {
    gameLogic.setGameState("menu")
    stateManager()
})

function stateManager() {
    let players = gameLogic.getPlayers()
    let currState = gameLogic.getGameState()
    let menu = document.querySelector(".menu-state")
    let game = document.querySelector(".playing-state")
    let p1Score = document.querySelector(".p1-score")
    let p2Score = document.querySelector(".p2-score")

    switch (currState) {
        case "menu":
            menu.classList.remove("inactive-state")
            game.classList.add("inactive-state")
            break;
        case "playing":
            gameBoard.resetBoard()
            gameLogic.resetTurnCount()
            menu.classList.add("inactive-state")
            game.classList.remove("inactive-state")

            let p1Name = document.querySelector(".p1-name")
            let p2Name = document.querySelector(".p2-name")

            let endText = document.querySelector(".end-game-text")

            p1Name.textContent = players[0].getName()
            p1Score.textContent = players[0].getScore()
            p2Name.textContent = players[1].getName()
            p2Score.textContent = players[1].getScore()
            endText.textContent = ""

            for (let i = 0; i < spaces.length; i++) {
                spaces[i].textContent = gameBoard.getBoardSpace(i)
            }
            break;
        case "game over":
            p1Score.textContent = players[0].getScore()
            p2Score.textContent = players[1].getScore()
    }
}

function setEndText(str) {
    let endText = document.querySelector(".end-game-text")
    endText.textContent = str
}

gameLogic.setGameState("menu")
stateManager()