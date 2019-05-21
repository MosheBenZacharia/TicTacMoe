import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import cow from '../img/Cow.jpg';

const X = 'M'
const O = 'O'

function Button(props) {
  return (
    <button onClick={props.onClick}>Undo </button>
    );
}

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
    {props.value}
    </button>
    );
}

class Board extends React.Component {


  renderSquare(i) {
    return (
      <Square
      value={this.props.squares[i]}
      onClick={()=>this.props.onClick(i)}
      /> 
    );
  }

  render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  undo() {

  const history = this.state.history;
  history.pop();
  this.setState({'history':history});
  }

  handleClick(i) {
    if(this.state.gameOver)
      return;

    const history = this.state.history;
    const current = history[history.length-1];
    const squares = current.squares.slice();

    if(squares[i])
      return;

    squares[i] = this.state.xIsNext ? X : O;
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });

    if(calculateWinner(squares) || !squares.includes(null))
        this.setState({'gameOver': true});
  }

  render() {

    const history = this.state.history;
    const current = history[history.length -1];
    const winner = calculateWinner(current.squares);

    let status;
    if(this.state.gameOver) {
      if(winner)
        status = 'Winner: ' + winner;
      else
        status = 'Tie game!!!';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? X : O);
    }


    return (
    <div>
      <h1> Tic Tac Moe </h1>
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            onClick = {(i)=>this.handleClick(i)}
            gameOver = {this.gameOver}
           />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
      {/*undo*/}
      {!this.state.gameOver && history.length>1 && 
      <Button onClick={()=>this.undo()}/> 
      }
        </div>
      </div>
      {this.state.gameOver  && 
      
      <img src={cow}/>
      }

    </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}