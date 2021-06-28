const player = (sign) => {
    const getSign = () => sign;
    return {getSign}
};

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const getCell = position => {
        if (position < 9) {
            return board[position];
        } else {
            return;
        }
    };
    const setCell = (position, sign) => {
        if (position < 9) {
            board[position] = sign;
            return true;
        } else {
            return false;
        }
    };
    return {board, getCell, setCell};
})();

const displayController = (() => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (gameBoard.getCell(parseInt(cell.id)) != "" || !gameController.getIsOver) {
                return;
            }
            gameController.playRound(parseInt(cell.id));
            updateBoard();
        });
    });
    document.getElementById("reset").addEventListener("click", () => {

        gameController.reset();
    });
    const updateBoard = () => {
        cells.forEach(cell => {
            cell.textContent = gameBoard.getCell(parseInt(cell.id));
        });
    };
    const setMessage = (message) => {
        let messageElement = document.getElementById("message");
        messageElement.textContent = message;
    };
    return {cells, updateBoard, setMessage};
})();

const gameController = (() => {
    const playerX = player("X");
    const playerO = player("O");
    let turn = 1;
    let isOver = false;
    let winnerSign = null;
    const playRound = (position) => {
        if (isOver) {return}
        let currentPlayer = getCurrentPlayer();
        let currentPlayerSign = currentPlayer.getSign()
        gameBoard.setCell(position, currentPlayerSign);
        displayController.updateBoard();
        let winner = checkForWin();
        if (winner) {
            isOver = true;
            displayController.setMessage(`${winner} wins`);
            return;
        }
        if (turn >= 9) {
            isOver = true;
            displayController.setMessage("Draw");
            return;
        }
        turn++;
        displayController.setMessage((currentPlayerSign == "X") ? "Player O's Turn" : "Player X's Turn");
    };
    const getCurrentPlayer = () => {
        return turn % 2 == 1 ? playerX : playerO;
    };
    const checkForWin = () => {
        let winnerSign = null;
        const winningCombinations = [
            [0,1,2], // horizontal
            [3,4,5],
            [6,7,8],
            [0,3,6], // vertical
            [1,4,7],
            [2,5,8],
            [0,4,8], // diagonal
            [2,4,6]
        ];
        winningCombinations.forEach(combination => {
            let one = gameBoard.getCell(combination[0]);
            let two = gameBoard.getCell(combination[1]);
            let three = gameBoard.getCell(combination[2]);
            if ((one == "X" && two == "X" && three == "X") || (one == "O" && two == "O" && three == "O")) {
                console.log("Win");
                winnerSign = one;
            }
        });
        if (winnerSign) {
            return winnerSign;
        }
    };
    const reset = () => {
        [0,1,2,3,4,5,6,7,8].forEach(cellPosition => {
            console.log(cellPosition);
            gameBoard.setCell(cellPosition, "");
        });
        displayController.updateBoard();
        displayController.setMessage("Player X's turn");
        turn = 1;
        isOver = false;
    };
    const getIsOver = () => {
        return isOver;
    };
    return {playerX, playerO, turn, playRound, getCurrentPlayer, checkForWin, reset, getIsOver};
})();