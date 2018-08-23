import React, { Component } from 'react';
import './App.css';

import Grid from "./Grid"

class App extends Component {
  state = {
    gameBoard: [],
    snakeLength: 5,
    directionQueue: ["right"],
    snakePosition: [],
  }

  componentDidMount(){
    window.addEventListener('keydown', this.handleKeyDown);
    this.setUpBoard()
      .then(this.placeStartingSnake)
  }

  componentWillUnmount(){
    window.removeEventListener('keydown', this.handleKeyDown);
    clearInterval(this.timerID);
    clearInterval(this.delayTimer);
  }

  setUpBoard = async () => {
    let gameBoard =[];
    let rows = [];
    //loop for height
    for (let i = 0; i < 26; i++){
      //loop for width
      for (let n = 0; n < 25; n++){
        // put n number of items in an array
        rows.push("empty");
      }
      // then push that array (row) to the main board
      gameBoard.push(rows)
      // empty the row and start again for the next n row
      rows = []
    }
    this.setState({
      gameBoard: gameBoard,
    })
  }

  placeStartingSnake = () => {
    //copy the current state gameBoard
    let gameBoard = [...this.state.gameBoard]
    let centralCell = 12;
    let snakePosition = [];
    //starting from central cell (column 12) running snakeLen times
    for (let i = centralCell; i > (centralCell - this.state.snakeLength); i--){
      //set cell value to "snake"
      gameBoard[13][i] = "snake";
      // add that cell to the snakes position array to be updated in state
      snakePosition.push([13, i])
    }

    this.setState({
      gameBoard: gameBoard,
      snakePosition: snakePosition
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
    e.preventDefault();
    let queue = [...this.state.directionQueue]
    let direction;
    //take direction entered and add it to queue
    switch(e.keyCode) {
      case 37:
      case 65:
          direction = "left"
          break;
      case 39:
      case 68:
          direction = "right"
          break;
      case 38:
      case 87:
          direction = "up"
          break;
      case 40:
      case 83:
          direction = "down"
          break;
      default:
          direction = this.state.directionQueue[0]
    }
    queue.push(direction)

    this.setState({
      directionQueue: queue,
    })
  }

  traverseDirectionQueue = () => {
    let queue = [...this.state.directionQueue]
    if (queue.length > 1){
      // prevent user changing direction on the same axis they are currently on
      let horizontal = ["left", "right"]
      let vertical = ["up", "down"]
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
    if (gameBoard[row][col] === "snake"){
      this.playerHasDied()
    }
  }

  playerHasDied = () => {
    clearInterval(this.timerID);
    clearInterval(this.delayTimer);
    console.log("died!")
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

    // if the snakes new head position is valid
    if (this.validMove(snakeNextPosition[0], snakeNextPosition[1])){
      //delete the tail
      let snakeTail = snakePosition.pop()
      //then add the new head to the front
      snakePosition.unshift(snakeNextPosition)
      //check if snake has run into itself -maybe move this?
      this.collidedWithSelf(snakeNextPosition[0], snakeNextPosition[1])

      // loop through snake array
      let gameBoard = [...this.state.gameBoard];
      snakePosition.forEach((position, i) => {
        //and update equivalent positions on the gameBoard
        gameBoard[position[0]][position[1]] = "snake";
      })
      // set the previous tail position on the board to empty
      gameBoard[snakeTail[0]][snakeTail[1]] = "empty"
      // update the snakePosition and gameBoard states with the new values

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
    this.timerID = setInterval(() => {
      this.moveSnake()
    }, 100)
  }

  render() {
    return (
      <div className="App">
        <Grid gameBoard={this.state.gameBoard}/>
        <button onClick={this.startGame}>Start</button>
      </div>
    );
  }
}

export default App;
