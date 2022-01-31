import React, { useState } from "react";
import "./App.css";
import { gameBoard } from "./gameboard";
import { boardEvaluation } from "./boardEvaluation";
import { players } from "./players";
import { computer } from "./computer";
import Board from "./components/Board";
import Scores from "./components/Scores";

function App() {
  const playerA = players.playerA;
  const human = players.human;

  const [state, setState] = useState({
    board: gameBoard,
    nextPlayer: playerA,
    scoreA: 0,
    scoreB: 0,
    nameA: playerA.name,
    nameB: getPlayerB().name,
    isComputerPlaying: false,
    isGameStopped: false,
  });

  let newState = { ...state };

  function setField(col, row, char) {
    return gameBoard.setField(col, row, char);
  }

  function erase() {
    gameBoard.erase();
  }

  function render() {
    newState = {
      ...newState,
      board: gameBoard,
    };
    setState(newState);
  }

  function showNextPlayer() {
    newState = {
      ...newState,
      nextPlayer: getPlayerNext(),
    };
    setState(newState);
  }

  function showScores() {
    newState = {
      ...newState,
      scoreA: players.playerA.getScore(),
      scoreB: getPlayerB().getScore(),
    };
    setState(newState);
  }

  function showMessage() {
    const win = winner();
    console.log(message(win));
    alert(message(win));
  }

  function showNames() {
    newState = {
      ...newState,
      nameA: playerA.name,
      nameB: getPlayerB().name,
    };
    setState(newState);
  }

  function getPlayerB() {
    return players.getOpponent();
  }

  function getPlayerNext() {
    return players.getPlayerNext();
  }

  function toggleOpponent() {
    newState = {
      ...newState,
      isComputerPlaying: !state.isComputerPlaying,
    };
    setState(newState);
    players.toggleOpponent();
  }

  function toggleNext() {
    players.toggleNext();
  }

  function winner() {
    return boardEvaluation.winner(gameBoard.getBoard());
  }

  function incScore() {
    const win = winner();
    if (win != "tie") {
      getPlayerNext().incScore();
    }
  }

  function computerMove() {
    if (!state.isComputerPlaying || getPlayerNext() == playerA) return;
    const bestMove = computer.bestMove();
    move(bestMove.col, bestMove.row);
  }

  function move(col, row) {
    if (state.isGameStopped) return;
    if (state.board.getField(col, row) !== "") return;
    const char = getPlayerNext().char;
    setField(col, row, char);
    render();
    if (isGameOver()) {
      stop();
      showMessage();
      incScore();
      showScores();
    } else {
      toggleNext();
      showNextPlayer();
      computerMove();
    }
  }

  function isGameOver() {
    const win = winner();
    if (win != "") {
      return true;
    } else {
      return false;
    }
  }

  function message(winner) {
    let message = "";
    if (winner == "tie") {
      message = "It is a tie!";
    } else {
      message = getPlayerNext().name + " is the winner!";
    }
    return message;
  }

  function stop() {
    newState = {
      ...newState,
      isGameStopped: true,
    };
    setState(newState);
  }

  function start() {
    newState.isGameStopped = false;
    showScores();
    if (newState.isComputerPlaying && getPlayerNext() != playerA) {
      toggleNext();
      showNames();
    }
    erase();
    render();
  }

  function updateNames(nameA, nameB) {
    if (nameA != nameB && nameA != "" && nameB != "") {
      playerA.name = nameA;
      human.name = nameB;
    }
    showNames();
  }

  function reset() {
    playerA.delScore();
    getPlayerB().delScore();
    start();
  }

  return (
    <div className="App">
      <header>
        <h1>TIC-TAC-TOE</h1>
        <Scores
          nameA={state.nameA}
          nameB={state.nameB}
          scoreA={state.scoreA}
          scoreB={state.scoreB}
        />
      </header>
      <Board board={state.board} handleClick={move} />
      <div className="buttons">
        <button className="button" onClick={start}>
          START
        </button>
        <button className="button">RESET</button>
        <button className="button">AI</button>
        <button className="button">Change Names</button>
      </div>
    </div>
  );
}

export default App;
