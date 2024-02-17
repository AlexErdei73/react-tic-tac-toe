import React, { useState } from "react";
import "./App.css";
import { gameBoard } from "./gameboard";
import { boardEvaluation } from "./boardEvaluation";
import { players } from "./players";
import { computer } from "./computer";
import Board from "./components/Board";
import Scores from "./components/Scores";
import MessageDlg from "./components/MessageDlg";
import FormDlg from "./components/FormDlg";

function App() {
  const [showMesage, setShowMessage] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [extendClicked, setExtendClicked] = useState(false);

  function handleCloseMsgDlg() {
    start();
    setShowMessage(false);
  }

  function handleCloseFormDlg() {
    setShowForm(false);
  }

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
    message: "",
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
    newState = {
      ...newState,
      message: message(win),
    };
    setState(newState);
    setShowMessage(true);
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
    if (win !== "tie") {
      getPlayerNext().incScore();
    }
  }

  function computerMove() {
    if (!state.isComputerPlaying || getPlayerNext() === playerA) return;
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
    return win !== "";
  }

  function message(winner) {
    let message = "";
    if (winner === "tie") {
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
    if (newState.isComputerPlaying && getPlayerNext() !== playerA) {
      toggleNext();
      showNames();
      showNextPlayer();
    }
    erase();
    render();
  }

  function updateNames(nameA, nameB) {
    if (nameA !== nameB && nameA !== "" && nameB !== "") {
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

  function handleExtendButtonClick() {
    setExtendClicked(!extendClicked);
    if (!extendClicked) {
      gameBoard.setBoardSize(10);
      newState = {
        ...newState,
        isComputerPlaying: false,
      };
      setState(newState);
    } else {
      gameBoard.setBoardSize(3);
      reset();
    }
  }

  return (
    <div className="App">
      <header>
        <h1>TIC TAC TOE</h1>
        <Scores
          nameA={state.nameA}
          nameB={state.nameB}
          scoreA={state.scoreA}
          scoreB={state.scoreB}
          nextPlayer={state.nextPlayer}
        />
      </header>
      <Board board={state.board} handleClick={move} />
      <div className="buttons">
        <button className="button" onClick={handleExtendButtonClick}>
          {extendClicked ? "Shrink" : "Extend"}
        </button>
        {!extendClicked && (
          <button
            className="button"
            onClick={() => {
              toggleOpponent();
              showNames();
              reset();
            }}
          >
            AI
          </button>
        )}
        <button className="button" onClick={reset}>
          RESET
        </button>
        <button className="button" onClick={() => setShowForm(true)}>
          Change Names
        </button>
      </div>
      <MessageDlg
        message={state.message}
        onClose={handleCloseMsgDlg}
        show={showMesage}
        title="Game Result"
      />
      <FormDlg
        show={showForm}
        onClose={handleCloseFormDlg}
        title="Change Names"
        updateNames={updateNames}
      />
    </div>
  );
}

export default App;
