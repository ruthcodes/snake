import React, { Component } from 'react';
import './App.css';

import Grid from "./Grid"

class App extends Component {
  state = {
    gameBoard: [],
    snakeLength: 5,
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
    //starting from central cell (column 12) running snakeLen times
    for (let i = centralCell; i > (centralCell - this.state.snakeLength); i--){
      //set cell value to "snake"
      gameBoard[13][i] = "snake";
    }

    this.setState({
      gameBoard: gameBoard,
    })

  }

  render() {
    return (
      <div className="App">
        <Grid gameBoard={this.state.gameBoard}/>
        <button onClick={this.placeStartingSnake}>Add snake</button>
      </div>
    );
  }
}

export default App;
