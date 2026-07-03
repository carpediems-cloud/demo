/**
 * JavaScript Tic-Tac-Toe Game Demo
 * 
 * An interactive, console-based Tic-Tac-Toe game that supports
 * playing against a friend (Player vs Player) or against a computer (Player vs AI).
 * Demonstrates state management, conditional logic, terminal board rendering,
 * and asynchronous user input using Node.js 'readline'.
 */

const readline = require('readline');

// Game state variables
let board = Array(9).fill(' ');
let currentPlayer = 'X';
let gameMode = ''; // '1' for PvP, '2' for PvAI
let aiDifficulty = 'hard'; // 'easy' or 'hard'
let rl;

/**
 * Resets the game state for a new game.
 */
function resetGame() {
    board = Array(9).fill(' ');
    currentPlayer = 'X';
}

/**
 * Renders the Tic-Tac-Toe board to the console with neat grid styling.
 */
function displayBoard() {
    console.clear();
    console.log("=== TIC-TAC-TOE GAME ===");
    console.log(`Mode: ${gameMode === '1' ? 'Player vs Player' : `Player vs AI (${aiDifficulty.toUpperCase()})`}`);
    console.log(`Current Turn: Player ${currentPlayer}\n`);
    console.log("     |     |     ");
    console.log(`  ${board[0]}  |  ${board[1]}  |  ${board[2]}  `);
    console.log("_____|_____|_____");
    console.log("     |     |     ");
    console.log(`  ${board[3]}  |  ${board[4]}  |  ${board[5]}  `);
    console.log("_____|_____|_____");
    console.log("     |     |     ");
    console.log(`  ${board[6]}  |  ${board[7]}  |  ${board[8]}  `);
    console.log("     |     |     \n");
    console.log("Board position guide:");
    console.log(" 1 | 2 | 3 ");
    console.log(" 4 | 5 | 6 ");
    console.log(" 7 | 8 | 9 \n");
}

/**
 * Checks if a player has won the game.
 * @param {string[]} b The board array
 * @param {string} player The player character ('X' or 'O')
 * @returns {boolean}
 */
function checkWin(b, player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    return winConditions.some(condition => 
        condition.every(index => b[index] === player)
    );
}

/**
 * Checks if the game is a draw (board is full and no winner).
 * @param {string[]} b The board array
 * @returns {boolean}
 */
function checkDraw(b) {
    return b.every(cell => cell !== ' ');
}

/**
 * Evaluates the board score for minimax.
 * @param {string[]} b The board array
 * @returns {number}
 */
function evaluateBoard(b) {
    if (checkWin(b, 'O')) return 10;
    if (checkWin(b, 'X')) return -10;
    return 0;
}

/**
 * Minimax algorithm for optimal AI decisions.
 * @param {string[]} b The board array
 * @param {number} depth 
 * @param {boolean} isMax 
 * @returns {number}
 */
function minimax(b, depth, isMax) {
    const score = evaluateBoard(b);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (checkDraw(b)) return 0;

    if (isMax) {
        let best = -1000;
        for (let i = 0; i < 9; i++) {
            if (b[i] === ' ') {
                b[i] = 'O';
                best = Math.max(best, minimax(b, depth + 1, false));
                b[i] = ' ';
            }
        }
        return best;
    } else {
        let best = 1000;
        for (let i = 0; i < 9; i++) {
            if (b[i] === ' ') {
                b[i] = 'X';
                best = Math.min(best, minimax(b, depth + 1, true));
                b[i] = ' ';
            }
        }
        return best;
    }
}

/**
 * Finds the best move for the AI.
 * @returns {number}
 */
function getBestMove() {
    let bestVal = -1000;
    let bestMove = -1;

    for (let i = 0; i < 9; i++) {
        if (board[i] === ' ') {
            board[i] = 'O';
            let moveVal = minimax(board, 0, false);
            board[i] = ' ';

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }
    return bestMove;
}

/**
 * Gets a random valid move (Easy AI).
 * @returns {number}
 */
function getRandomMove() {
    const available = [];
    for (let i = 0; i < 9; i++) {
        if (board[i] === ' ') available.push(i);
    }
    return available[Math.floor(Math.random() * available.length)];
}

/**
 * Processes the AI's turn.
 */
function handleAITurn() {
    console.log("AI is thinking...");
    setTimeout(() => {
        let move;
        if (aiDifficulty === 'easy') {
            // 30% chance of optimal move, otherwise random
            if (Math.random() < 0.3) {
                move = getBestMove();
            } else {
                move = getRandomMove();
            }
        } else {
            // Always play optimally
            move = getBestMove();
        }

        board[move] = 'O';

        if (checkWin(board, 'O')) {
            displayBoard();
            console.log("🤖 Computer (O) wins! Better luck next time.");
            askPlayAgain();
        } else if (checkDraw(board)) {
            displayBoard();
            console.log("🤝 It's a draw!");
            askPlayAgain();
        } else {
            currentPlayer = 'X';
            playTurn();
        }
    }, 800);
}

/**
 * Asks the user if they want to play again.
 */
function askPlayAgain() {
    rl.question("\nWould you like to play again? (y/n): ", (ans) => {
        if (ans.trim().toLowerCase() === 'y') {
            resetGame();
            startGame();
        } else {
            console.log("\nThanks for playing! Goodbye.");
            rl.close();
        }
    });
}

/**
 * Prompts the active player to make their move.
 */
function playTurn() {
    displayBoard();

    if (gameMode === '2' && currentPlayer === 'O') {
        handleAITurn();
        return;
    }

    rl.question(`Player ${currentPlayer}, enter a position (1-9): `, (input) => {
        const position = parseInt(input.trim(), 10) - 1;

        if (isNaN(position) || position < 0 || position > 8) {
            console.log("\n❌ Invalid choice! Please enter a number between 1 and 9.");
            setTimeout(playTurn, 1500);
            return;
        }

        if (board[position] !== ' ') {
            console.log("\n❌ That position is already taken!");
            setTimeout(playTurn, 1500);
            return;
        }

        board[position] = currentPlayer;

        if (checkWin(board, currentPlayer)) {
            displayBoard();
            console.log(`🎉 Player ${currentPlayer} wins the game!`);
            askPlayAgain();
        } else if (checkDraw(board)) {
            displayBoard();
            console.log("🤝 It's a draw!");
            askPlayAgain();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            playTurn();
        }
    });
}

/**
 * Prompts the user to select AI difficulty.
 */
function chooseDifficulty() {
    console.clear();
    console.log("=== SELECT DIFFICULTY ===");
    console.log("1. Easy (AI makes random mistakes)");
    console.log("2. Hard (AI plays optimally)");
    
    rl.question("\nChoose difficulty (1-2): ", (choice) => {
        choice = choice.trim();
        if (choice === '1') {
            aiDifficulty = 'easy';
            playTurn();
        } else if (choice === '2') {
            aiDifficulty = 'hard';
            playTurn();
        } else {
            console.log("\nInvalid choice. Defaulting to Hard.");
            aiDifficulty = 'hard';
            setTimeout(playTurn, 1500);
        }
    });
}

/**
 * Prompts the user to select a game mode.
 */
function startGame() {
    console.clear();
    console.log("=== WELCOME TO TIC-TAC-TOE ===");
    console.log("1. Player vs Player (PvP)");
    console.log("2. Player vs AI (PvAI)");
    
    rl.question("\nSelect a game mode (1-2): ", (choice) => {
        choice = choice.trim();
        if (choice === '1') {
            gameMode = '1';
            playTurn();
        } else if (choice === '2') {
            gameMode = '2';
            chooseDifficulty();
        } else {
            console.log("\nInvalid option. Please choose 1 or 2.");
            setTimeout(startGame, 1500);
        }
    });
}

/**
 * Main application entry point.
 */
function main() {
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    startGame();
}

// Export for module reuse if needed
module.exports = {
    checkWin,
    checkDraw,
    evaluateBoard,
    minimax
};

// Run game if executed directly
if (require.main === module) {
    main();
}
