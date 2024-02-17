import { matrix } from "./matrix";

export const gameBoard = (function () {
  let _n = 3;

  let _board = matrix(_n, _n);

  function setField(col, row, char) {
    _board.setElement(col, row, char);
  }

  function getField(col, row) {
    return _board.getElement(col, row);
  }

  function erase() {
    _board.fillUp("");
  }

  function getN() {
    return _n;
  }

  function getBoard() {
    return _board.getMatrix();
  }

  function setBoardSize(size) {
    _n = size;
    _board = matrix(_n, _n);
    erase();
  }

  erase();

  return { getN, setField, getField, erase, getBoard, setBoardSize };
})();