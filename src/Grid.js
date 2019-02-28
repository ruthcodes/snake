import React from 'react';
import Cell from "./Cell";

function Grid(props){
    return (
      <div className="grid">
        {
          props.gameBoard.map((row, i) => row.map((col, x) => <Cell data-value={col} data-coords={[i,x]} key={i+x}/>))
        }
      </div>
    )
}

export default Grid;
