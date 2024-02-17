import { gameBoard } from "./gameboard";

export const boardEvaluation = (function () {
  function winner(board) {
    const _n = gameBoard.getN();

    const winCount = _n >= 10 ? 5 : 3;

    for (let col = 0; col < _n; col++) {
      for (let row = 0; row < _n; row++) {
        const char = board[row][col];
        if (char === "") continue;

        // Check horizontally
        for (let i = 0; i < _n - winCount + 1; i++) {
          let count = 0;
          for (let j = 0; j < winCount; j++) {
            if (board[row][i + j] === char) {
              count++;
            } else {
              break;
            }
          }
          if (count === winCount) return char;
        }

        // Check vertically
        for (let i = 0; i < _n - winCount + 1; i++) {
          let count = 0;
          for (let j = 0; j < winCount; j++) {
            if (board[i + j][col] === char) {
              count++;
            } else {
              break;
            }
          }
          if (count === winCount) return char;
        }

        // Check diagonally (from top-left to bottom-right)
        for (let i = 0; i < _n - winCount + 1; i++) {
          let count = 0;
          for (let j = 0; j < winCount; j++) {
            if (board[i + j][col + j] === char) {
              count++;
            } else {
              break;
            }
          }
          if (count === winCount) return char;
        }

        // Check diagonally (from top-right to bottom-left)
        for (let i = 0; i < _n - winCount + 1; i++) {
          let count = 0;
          for (let j = 0; j < winCount; j++) {
            if (board[i + j][col - j] === char) {
              count++;
            } else {
              break;
            }
          }
          if (count === winCount) return char;
        }
      }
    }

    // Check for a tie
    let isBoardFull = true;
    for (let row = 0; row < _n; row++) {
      for (let col = 0; col < _n; col++) {
        if (board[row][col] === "") {
          isBoardFull = false;
          break;
        }
      }
      if (!isBoardFull) break;
    }
    if (isBoardFull) return "tie";

    // No winner yet
    return "";
  }

  return { winner };
})();