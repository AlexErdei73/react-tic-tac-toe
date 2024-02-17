import React from "react";
import "./Board.css";

const Board = (props) => {
  const { board, handleClick } = props;
  const boardSize = board.getN();
  const cellSize = 85 / boardSize;
  
  let fontSize = 0
  if (boardSize === 3) {
    fontSize = Math.min(100, cellSize * 3)
  } else if (boardSize === 10) {
    fontSize = Math.min(100, cellSize * 3.5)
  }

  return (
    <div className="board">
      {board.getBoard().map((line, row) => {
        return line.map((cell, col) => {
          return (
            <div
              key={`(${row}, ${col})`}
              style={{
                width: `${cellSize}%`,
                height: `${cellSize}%`,
                fontSize: `${fontSize}px`
              }}
              className="cell"
              onClick={() => handleClick(col, row)}
            >
              {cell}
            </div>
          );
        });
      })}
    </div>
  );
};

export default Board;