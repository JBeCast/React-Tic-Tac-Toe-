import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.clickHandler}>
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        clickHandler={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return <div>{(() => {
        let rows = [];
        for (let i=0;i<3;i++) {
          rows.push(<div className="board-row">{(() => {
            let squares = [];
            for (let j=0;j<3;j++) {
              squares.push(this.renderSquare(i*3+j));
            }
            return squares;})()
          }</div>);
        }
        return rows;
      })()}
    </div>
  }
}


class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        move: null
      }],
      stepNumber: 0,
      xIsNext: true,
      movesReversed: false
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    if (calculateWinner(squares) || squares[i]) return;
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        move: i
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  reverseMoves() {
    console.log(this.state.movesReversed);
    this.setState({
      movesReversed: !this.state.movesReversed
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      const coords = indexToCoords(step.move);
      const letter = (move % 2) ? 'X' : 'O';
      const desc = move ? `Move #${move}: ${letter} ${coords}` : 'Game start';
      return (
        <li key={move}>
          <a href="#" className={move === this.state.stepNumber ? 'currentMove' : ''}
            onClick={() => {this.jumpTo(move)}}>{desc}
          </a>
        </li>
      )
    });

    if (this.state.movesReversed) moves.reverse();

    let status;
    if (winner) status = 'Winner: ' + winner;
    else if (this.state.stepNumber >= 9) status = 'Draw!';
    else status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <h4 id="history">History</h4>
          <ol>{moves}</ol>
          <button onClick={() => {this.reverseMoves()}}>
            {this.state.movesReversed ? 'First to last' : 'Last to first' }
          </button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function indexToCoords(i) {
  return i !== null ? `(${Math.floor((i/3)) + 1},${(i%3) + 1})` : '';
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
