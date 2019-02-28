import React, { Component } from 'react';
import './App.css';
import './Phone.css';

import Grid from "./Grid";
import Score from './Score';
import Clock from './Clock';
import PhoneButton from "./PhoneButton";
import Modal from 'react-responsive-modal';

//constants
const EMPTY = "empty";
const SNAKE = "snake";
const FOOD = "food";
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";

class App extends Component {
  state = {
    gameBoard: [],
    directionQueue: [RIGHT], // game begins with snake facing right
    snakePosition: [],
    score: 0,
    gameRunning: false,
    phoneKeys: [
      {'main': '1','side':'.'},
      {'main': '2','side':'abc'},
      {'main': '3','side':'def'},
      {'main': '4','side':'ghi'},
      {'main': '5','side':'jkl'},
      {'main': '6','side':'mno'},
      {'main': '7','side':'pqrs'},
      {'main': '8','side':'tuv'},
      {'main': '9','side':'wxyz'},
      {'main': '*','side':'+'},
      {'main': '0','side':'_'},
      {'main': '#','side':'^'},
    ],
    open: false,
  }

  componentDidMount(){
    window.addEventListener('keydown', this.handleKeyDown);
    this.setUpBoard()
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  // Handler for phone keypad
  onButtonClick = button => {
      let e = new Event('keydown');
      // ensures click triggers anywhere within the button or its children
      let pressed = button.target.nodeName === "SPAN" ?
                    button.target.parentElement.dataset.value :
                    button.target.dataset.value
      let keyCode;
      switch(pressed) {
        case '4': // LEFT
            keyCode = 37
            break;
        case '6': // RIGHT
            keyCode = 39
            break;
        case '2': // UP
            keyCode = 38
            break;
        case '8': // DOWN
            keyCode = 40
            break;
        default:
          keyCode = null;
      }
      if (keyCode) {
        e.keyCode = keyCode;
        this.handleKeyDown(e);
      }
  }

  componentWillUnmount(){
    window.removeEventListener('keydown', this.handleKeyDown);
    clearInterval(this.timerID);
  }

  reset = () => {
    clearInterval(this.timerID);
    this.setState({
      gameBoard: [],
      directionQueue: [RIGHT],
      snakePosition: [],
      score: 0,
      gameRunning: false,
    })
    this.setUpBoard()
  }


  setUpBoard = () => {
    let gameBoard =[];
    let rows = [];

    for (let i = 0; i < 26; i++){   // grid height
      for (let n = 0; n < 25; n++){ // grid width
        rows.push(EMPTY);
      }
      gameBoard.push(rows)
      rows = [] // clear to start next row
    }
    this.setState({
      gameBoard: gameBoard,
    }, () =>{
      this.placeStartingSnake()
    })
  }

  placeStartingSnake = () => {
    let gameBoard = [...this.state.gameBoard]
    let snakePosition = [];
    let centralCell = 12;
    let snakeStartingLength = 5;
    // from central cell, running snakeLength times
    for (let i = centralCell; i > (centralCell - snakeStartingLength); i--){
      gameBoard[13][i] = SNAKE;
      snakePosition.push([13, i])
    }
    this.setState({
      gameBoard: gameBoard,
      snakePosition: snakePosition,
    })
  }

  placeFood = () => {
    let gameBoard = [...this.state.gameBoard]
    let availableCells = [];
    // Generate array of currently empty cells
    gameBoard.forEach((row,r) => {
      row.forEach((col, c) => {
        if (col === EMPTY){
          availableCells.push([r,c]) // row index, col index
        }
      })
    })
    // Select random available cell and place food
    const randomCell = availableCells[Math.floor(Math.random()*availableCells.length)];
    gameBoard[randomCell[0]][randomCell[1]] = FOOD;

    this.setState({
      gameBoard: gameBoard,
    })
  }

  validMove = (row, col) => {
    // if the move is within board boundary
    return (row >= 0 && row < 26 && col >=0 && col <25) ?
           true :
           false;
  }

  handleKeyDown = (e) => {
    if (!this.state.gameRunning && e.keyCode === 32){ // 32 is spacebar
      this.startGame();
    }
    if(this.state.gameRunning){
      e.preventDefault();
      let queue = [...this.state.directionQueue]
      let direction;
      // add entered direction to queue
      switch(e.keyCode) {
        case 37:
        case 65:
            direction = LEFT
            break;
        case 39:
        case 68:
            direction = RIGHT
            break;
        case 38:
        case 87:
            direction = UP
            break;
        case 40:
        case 83:
            direction = DOWN
            break;
        default:
            direction = this.state.directionQueue[0]
      }
      queue.push(direction)

      this.setState({
        directionQueue: queue,
      })
    }
  }

  traverseDirectionQueue = () => {
    let queue = [...this.state.directionQueue];
    if (queue.length > 1){
      let horizontal = [LEFT, RIGHT];
      let vertical = [UP, DOWN];
      // if new direction is horizontal and so is the current (same for vertical)
      if (
        (horizontal.includes(queue[0]) && horizontal.includes(queue[1])) ||
        (vertical.includes(queue[0]) && vertical.includes(queue[1]))
      ){
        // remove the new input to reset direction to whatever it was previously
        queue.pop();
      } else {
        // remove previous head of queue
        queue.shift();
      }
    }
    this.setState({
      directionQueue: queue,
    })
  }

  collidedWithSelf = (row, col) => {
    let gameBoard = [...this.state.gameBoard];
    if (gameBoard[row][col] === SNAKE){
      this.playerHasDied();
      return true;
    }
    return false;
  }

  playerHasDied = () => {
    clearInterval(this.timerID);
    this.setState({
      gameRunning: false,
    })
    alert(`You died! Score: ${this.state.score}`);
    this.reset();
  }

  moveSnake = () => {
    this.traverseDirectionQueue(); // update direction
    let snakePosition = [...this.state.snakePosition];
    // get position of snake head
    let snakeHeadRow = snakePosition[0][0];
    let snakeHeadCol = snakePosition[0][1];
    let snakeNextPosition = [];

    switch(this.state.directionQueue[0]) {
      case RIGHT:
          snakeNextPosition = [snakeHeadRow, snakeHeadCol+1];
          break;
      case LEFT:
          snakeNextPosition = [snakeHeadRow, snakeHeadCol-1];
          break;
      case UP:
          snakeNextPosition = [snakeHeadRow-1, snakeHeadCol];
          break;
      case DOWN:
          snakeNextPosition = [snakeHeadRow+1, snakeHeadCol];
          break;
      default:
          snakeNextPosition = [snakeHeadRow, snakeHeadCol];
    }
    let gameBoard = [...this.state.gameBoard];

    // if hitting a wall
    if (!this.validMove(snakeNextPosition[0], snakeNextPosition[1])){
      return this.playerHasDied();
    } else {
      // if not eating
      if (gameBoard[snakeNextPosition[0]][snakeNextPosition[1]] !== FOOD){
        let snakeTail = snakePosition.pop(); // delete the tail
        gameBoard[snakeTail[0]][snakeTail[1]] = EMPTY;
      } else {
        this.placeFood();
        this.setState({
          score: this.state.score + 1,
        })
      }

      snakePosition.unshift(snakeNextPosition); // add new snake head
      // check for collision
      if (this.collidedWithSelf(snakeNextPosition[0], snakeNextPosition[1])) return;

      snakePosition.forEach((position, i) => { // update gameBoard with new snake
        gameBoard[position[0]][position[1]] = SNAKE;
      })

      this.setState({
        snakePosition: snakePosition,
        gameBoard: gameBoard,
      })
    }
  }

  startGame = () => {
    if(!this.state.gameRunning){
      this.setState({
        gameRunning: true,
      })
      this.placeFood();
      this.timerID = setInterval(() => { // start timer that moves snake
        this.moveSnake();
      }, 100);
    }
  }

  render() {
    const { open } = this.state;
    return (
      <div className="App">
        <div className="container">
          <div className="phone-body">
            <div className="phone-top">
              <div className="phone-screen-border">
                <div className="phone-speaker"></div>
                <div className="phone-infobar">
                  <Score score={this.state.score}/>
                  <Clock />
                </div>
                <Grid gameBoard={this.state.gameBoard}/>
                <div className="phone-controls">
                  <div className="phone-control-button" onClick={this.startGame}>Start</div>
                  <div className="phone-control-button" onClick={this.reset}>Reset</div>
                </div>
              </div>
            </div>
            <div className="phone-bottom">
              <div className="phone-buttons">
                {
                  this.state.phoneKeys.map((key,i) => {
                    return <PhoneButton key={i} handleClick={this.onButtonClick} data-value={key.main} side={key.side} />
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className="info-modal">
          <button onClick={this.onOpenModal}>INFO</button>
          <Modal open={open} onClose={this.onCloseModal} center>
            <h2>Controls</h2>
            <p>If you have a keyboard, the WASD or arrow keys can be used to control the snake.</p>
            <p>If not, you can use the 2,4,6,8 keys on the on-screen phone's numberpad.</p>
            <br/>
            <p>Press the spacebar or start button to begin!</p>
          </Modal>
        </div>
      </div>
    );
  }
}

export default App;
