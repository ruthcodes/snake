import React, { Component } from 'react';

export default class Score extends Component{

  render(){
    return (
      <div className="score">Score: {this.props.score}</div>
    )
  }
}
