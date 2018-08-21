import React, { Component } from 'react';

import Cell from "./Cell"

export default class Grid extends Component{
  render(){
    return (
      <div className="grid">
        {
          this.props.gameBoard.map((row, i) => row.map((col, x) => <Cell data-value={col} data-coords={[i,x]} key={i+x}/>))
        }
      </div>
    )
  }
}
