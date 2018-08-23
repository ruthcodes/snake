import React, { Component } from 'react';

export default class Score extends Component{

  render(){
    return (
      <div className="score">{this.props.score}</div>
    )
  }
}
