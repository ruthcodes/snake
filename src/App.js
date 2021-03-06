import React, { Component } from 'react';
import './App.css';

import Grid from "./Grid"
import Score from "./Score"
import Keyboard from 'simple-keyboard';
import 'simple-keyboard/build/css/index.css';

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
    directionQueue: [RIGHT],
    snakePosition: [],
    score: 0,
    gameRunning: false,
  }

  componentDidMount(){
    window.addEventListener('keydown', this.handleKeyDown);
    this.keyboard = new Keyboard({
      debug: false,
      layoutName: this.layoutName,
      onKeyPress: button => this.onKeyPress(button),
      newLineOnEnter: true,
      layout: {
        'default': [
          'w',
          'a s d',
        ]}
    });
    this.setUpBoard()
  }

  onKeyPress = button => {
    let e = new Event('keydown');
    let keyCode = button.charCodeAt(0);
    if (keyCode > 90) {  // 90 is keyCode for 'z'
       keyCode -= 32;
    }
    e.keyCode = keyCode
    this.handleKeyDown(e)
  }

  componentWillUnmount(){
    window.removeEventListener('keydown', this.handleKeyDown);
    clearInterval(this.timerID);
    clearInterval(this.delayTimer);
  }

  reset = () => {
    clearInterval(this.timerID);
    clearInterval(this.delayTimer);
    this.setState({
      gameBoard: [],
      directionQueue: [RIGHT],
      snakePosition: [],
      score: 0,
      gameRunning: false,
    })
    this.setUpBoard()
  }


  setUpBoard = async () => {
    let gameBoard =[];
    let rows = [];
    //loop for height
    for (let i = 0; i < 26; i++){
      //loop for width
      for (let n = 0; n < 25; n++){
        // put n number of items in an array
        rows.push(EMPTY);
      }
      // then push that array (row) to the main board
      gameBoard.push(rows)
      // empty the row and start again for the next n row
      rows = []

    }
    this.setState({
      gameBoard: gameBoard,
    }, () =>{
      this.placeStartingSnake()
    })

  }

  placeStartingSnake = () => {
    //copy the current state gameBoard
    let gameBoard = [...this.state.gameBoard]
    let centralCell = 12;
    let snakePosition = [];
    let snakeStartingLength = 5;
    //starting from central cell (column 12) running snakeLen times
    for (let i = centralCell; i > (centralCell - snakeStartingLength); i--){
      //set cell value to "snake"
      gameBoard[13][i] = SNAKE;
      // add that cell to the snakes position array to be updated in state
      snakePosition.push([13, i])
    }

    this.setState({
      gameBoard: gameBoard,
      snakePosition: snakePosition,
    })
  }

  placeFood = () => {
    //choose a random spot on the gameBoard
    let gameBoard = [...this.state.gameBoard]
    let availableCells = [];

    //forEach of the rows, columns
    gameBoard.forEach((row,r) => {
      row.forEach((col, c) => {
        //if row/col is empty
        if (col === "empty"){
          //push to a new array as [row,col]
          availableCells.push([r,c])
        }
      })
    })
    //choose a random array from the new array
    const randomCell = availableCells[Math.floor(Math.random()*availableCells.length)];
    //and set that row/col in the gameboard as food
    gameBoard[randomCell[0]][randomCell[1]] = FOOD;

    this.setState({
      gameBoard: gameBoard,
    })
  }

  validMove = (row, col) => {
    // if the move is within board boundary
    if(row >= 0 && row < 26 && col >=0 && col <25){
      return true;
    }
    // if returning false, player has run into wall
    return false;
  }

  handleKeyDown = (e) => {
    // 32 is spacebar
    if (!this.state.gameRunning && e.keyCode === 32){
      this.startGame()
    }
    if(this.state.gameRunning){
      e.preventDefault();
      let queue = [...this.state.directionQueue]
      let direction;
      //take direction entered and add it to queue
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
    let queue = [...this.state.directionQueue]
    if (queue.length > 1){
      // prevent user changing direction on the same axis they are currently on
      let horizontal = [LEFT, RIGHT]
      let vertical = [UP, DOWN]
      // if new direction is horizontal and so is the current (same for vertical)
      if (
        (horizontal.includes(queue[0]) && horizontal.includes(queue[1])) ||
        (vertical.includes(queue[0]) && vertical.includes(queue[1]))
      ){
        // remove the new input to reset direction to whatever it was previously
        queue.pop()
      } else {
        // if new move valid, remove the first item, so new input is now first
        queue.shift()
      }
    }
    this.setState({
      directionQueue: queue,
    })
  }

  collidedWithSelf = (row, col) => {
    let gameBoard = [...this.state.gameBoard];
    if (gameBoard[row][col] === SNAKE){
      this.playerHasDied()
      return true
    }
    return false
  }

  playerHasDied = () => {
    clearInterval(this.timerID);
    clearInterval(this.delayTimer);
    this.setState({
      gameRunning: false,
    })
    alert(`You died! Score: ${this.state.score}`)
    this.reset()
  }

  moveSnake = () => {
    // update the direction before moving snake
    this.traverseDirectionQueue()
    // get array of current snake positions
    let snakePosition = [...this.state.snakePosition];
    // get position of head
    let snakeHeadRow = snakePosition[0][0]
    let snakeHeadCol = snakePosition[0][1]
    // make empty array to store the snakes new position after successful move
    let snakeNextPosition = [];
    // decide which array index of the snake needs incrememnting dependent on direction
    switch(this.state.directionQueue[0]) {
      case "right":
          snakeNextPosition = [snakeHeadRow, snakeHeadCol+1]
          break;
      case "left":
          snakeNextPosition = [snakeHeadRow, snakeHeadCol-1]
          break;
      case "up":
          snakeNextPosition = [snakeHeadRow-1, snakeHeadCol]
          break;
      case "down":
          snakeNextPosition = [snakeHeadRow+1, snakeHeadCol]
          break;
      default:
          snakeNextPosition = [snakeHeadRow, snakeHeadCol]
    }
    let gameBoard = [...this.state.gameBoard];

    // if the snakes new head position is valid
    if (this.validMove(snakeNextPosition[0], snakeNextPosition[1])){
      //if snake not eating delete the tail,
      //otherwise keep it so snake grows while still moving forwards
      if (gameBoard[snakeNextPosition[0]][snakeNextPosition[1]] !== FOOD){
        //delete the tail
        let snakeTail = snakePosition.pop()
        // set the previous tail position on the board to empty
        gameBoard[snakeTail[0]][snakeTail[1]] = EMPTY;
      } else {
        //place food if snake eats current food
        this.placeFood()
        //add 1 to score
        this.setState({
          score: this.state.score + 1,
        })
      }
      //then add the new head to the front
      snakePosition.unshift(snakeNextPosition)
      //check if snake has run into itself
      if(this.collidedWithSelf(snakeNextPosition[0], snakeNextPosition[1])){
        //stop executing rest of function if player has self collided
        return;
      }

      // loop through snake array
      snakePosition.forEach((position, i) => {
        //and update equivalent positions on the gameBoard
        gameBoard[position[0]][position[1]] = SNAKE;
      })
      // update the snakePosition, gameBoard then availableCells states with the new values
      this.setState({
        snakePosition: snakePosition,
        gameBoard: gameBoard,
      })
    } else {
      // if move was invalid
      return this.playerHasDied()
    }
  }

  startGame = () => {
    if(!this.state.gameRunning){
      this.setState({
        gameRunning: true,
      })
      this.placeFood();
      this.timerID = setInterval(() => {
        this.moveSnake()
      }, 100)
    }
  }

  render() {
    return (
      <div className="App">
        <Score score={this.state.score}/>
        <Grid gameBoard={this.state.gameBoard}/>
        <div className="simple-keyboard"></div>
        <div>
          <button className="buttonControls" onClick={this.startGame}>Start</button>
          <button className="buttonControls" onClick={this.reset}>Reset</button>
          <div className="infoText">
            <p>If you have a keyboard, the WASD or arrow keys can be used to control the snake.</p>
            <p>Press the spacebar or start button to begin.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
