import React from 'react';

function Cell(props){
    return (
      <div className="cell" data-value={props['data-value']} data-coords={props['data-coords']}></div>
    )
}

export default Cell;
