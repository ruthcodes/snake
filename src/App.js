import React, { Component } from 'react';
import './App.css';

import Grid from "./Grid"

class App extends Component {
  state = {
    gameBoard: [],
    snakeLength: 5,
    currentDirection: "right",
    snakePosition: [],
  }

  componentDidMount(){
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
      console.log(i)
      // add that cell to the snakes position array to be updated in state
      snakePosition.push([13, i])
    }
      console.log(JSON.parse(JSON.stringify(snakePosition.slice())));

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

  collidedWithSelf = (row, col) => {
    let gameBoard = [...this.state.gameBoard];
    if (gameBoard[row][col] === "snake"){
      this.playerHasDied()
    }
  }

  playerHasDied = () => {
    console.log("died!")
  }

  changeDirection = (direction) =>{
    this.setState({
      currentDirection: direction,
    })
  }

  moveSnake = (direction) => {
    // get array of current snake positions
    let snakePosition = [...this.state.snakePosition];
    console.log("starting move")


    let gameBoard = [...this.state.gameBoard];
    // get position of head
    let snakeHeadRow = snakePosition[0][0]
    let snakeHeadCol = snakePosition[0][1]
    // make empty array to store the snakes new position after successful move
    let snakeNextPosition = [];
    //let incrementRow = 0;
    //let incrementCol = 0;

    switch(direction) {
      case "right":
          snakeNextPosition = [snakeHeadRow, snakeHeadCol+1]
          //incrementRow = 0
          //incrementCol = 1
          break;
      case "left":
          snakeNextPosition = [snakeHeadRow, snakeHeadCol-1]
          //incrementRow = 0
          //incrementCol = -2
          break;
      case "up":
          snakeNextPosition = [snakeHeadRow-1, snakeHeadCol]
          //incrementRow = -2
          //incrementCol = 0
          break;
      case "down":
          snakeNextPosition = [snakeHeadRow+1, snakeHeadCol]
          //incrementRow = 1
          //incrementCol = 0
          break;
      default:
          snakeNextPosition = [snakeHeadRow, snakeHeadCol]
    }

    // if the snakes new head position is valid, delete the last cell from the snakes old position
    if (this.validMove(snakeNextPosition[0], snakeNextPosition[1])){
      //delete the tail
      snakePosition.pop()
      //then add the new head to the front
      snakePosition.unshift(snakeNextPosition)

      // then loop through the old positions incrememnting each by one depending on direction
      /*snakePosition = snakePosition.map((positionArr) => {
        positionArr[0] = positionArr[0] + incrementRow
        positionArr[1] = positionArr[1] + incrementCol
        return positionArr
      })*/

      console.log(JSON.parse(JSON.stringify(snakePosition.slice())));


      // figure out how to update gameBoard based on new snake array


      // finally update the snakePosition and gameBoard states with the new values
      this.setState({
        snakePosition: snakePosition,
        gameBoard: gameBoard,
      })
    } else {
      // if move was invalid
      return this.playerHasDied()
    }

  }

  startGame = () =>{
    this.moveSnake("right")
  }

  render() {
    return (
      <div className="App">
        <Grid gameBoard={this.state.gameBoard}/>
        <button onClick={this.placeStartingSnake}>Add snake</button>
        <button onClick={this.startGame}>Start</button>
      </div>
    );
  }
}

export default App;
