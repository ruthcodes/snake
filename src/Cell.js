import React, { Component } from 'react';

export default class Cell extends Component{
  handleClick = (e) => {
    console.log(e.target.getAttribute("data-value"))
    console.log(e.target.getAttribute("data-coords"))
  }

  render(){
    return (
      <div className="cell" onClick={this.handleClick} data-value={this.props['data-value']}data-coords={this.props['data-coords']}></div>
    )
  }
}
