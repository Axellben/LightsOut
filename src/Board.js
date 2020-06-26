import React, { Component } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nRows: 5,
    nCols: 5,
    chanceLightStartsOn: 0.25,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard(),
    };
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    const { nRows, nCols, chanceLightStartsOn } = this.props;
    let board = new Array(nRows);
    for (let i = 0; i < nCols; ++i) {
      board[i] = new Array(nCols);
    }

    for (let i = 0; i < nRows; ++i) {
      for (let j = 0; j < nCols; ++j) {
        board[i][j] = Math.random() < chanceLightStartsOn ? true : false;
      }
    }

    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let { nCols, nRows } = this.props;
    let board = this.state.board;
    let [x, y] = coord.split("-").map(Number);

    function flipCell(y, x) {
      // if this coord is actually on board, flip it

      if (x >= 0 && x < nCols && y >= 0 && y < nRows) {
        board[y][x] = !board[y][x];
      }
    }

    // TODO: flip this cell and the cells around it
    flipCell(x, y);
    flipCell(x - 1, y);
    flipCell(x, y + 1);
    flipCell(x + 1, y);
    flipCell(x, y - 1);

    // win when every cell is turned off
    // TODO: determine is the game has been won
    let hasWon = board.every((row) => row.every((state) => state === false));

    this.setState({ board, hasWon });
  }

  renderBoardBody() {
    let boardBody = [];

    for (let i = 0; i < this.props.nRows; ++i) {
      let row = [];
      for (let j = 0; j < this.props.nCols; ++j) {
        let coord = `${i}-${j}`;
        row.push(
          <Cell
            key={coord}
            isLit={this.state.board[i][j]}
            flipCellsAroundMe={() => this.flipCellsAround(coord)}
          />
        );
      }
      boardBody.push(<tr key={i}>{row}</tr>);
    }
    return boardBody;
  }

  /** Render game board or winning message. */

  render() {
    // if the game is won, just show a winning msg & render nothing else
    if (this.state.hasWon) {
      return (
        <div>
          <div className="Board-title">
            <div className="winner">
              <span className="neon-orange">You</span>
              <span className="neon-blue">Won</span>
            </div>
          </div>
        </div>
      );
    }
    // make table board
    return (
      <div>
        <div className="Board-title">
          <div className="neon-orange">Lights</div>
          <div className="neon-blue">Out</div>
        </div>
        <table className="Board">
          <tbody>{this.renderBoardBody()}</tbody>
        </table>
      </div>
    );
  }
}

export default Board;
