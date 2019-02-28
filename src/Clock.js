import React, { Component } from 'react';

class Clock extends Component {
  state = {
    hour: '12',
    minutes: '00',
  }

  componentDidMount(){
    this.timer = setInterval(()=> {
      let date = new Date();
      let hr = date.getHours().toString();
      let mn = date.getMinutes().toString();
      if (mn.length === 1){
        mn = '0'+ mn;
      }
      if (hr.length === 1){
        hr = '0'+ hr;
      }
      this.setState({
        hour: hr,
        minutes: mn,
      })
    },1000)
  }

  shouldComponentUpdate(nextProps, nextState){
    // only re-render if hour/minute changes
    return nextState.hour === this.state.hour &&
           nextState.minutes === this.state.minutes ?
           false :
           true;
  }

  componentWillUnmount(){
    this.timer.clearInterval();
  }

  render(){
    return (
      <div className="phone-clock">{this.state.hour}:{this.state.minutes}</div>
    )
  }
}

export default Clock;
