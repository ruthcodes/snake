import React from 'react';

function PhoneButton(props){
    const rightButtons = ['3','6','9','#'];

    return (
      <div className="phone-button" onClick={props.handleClick} data-value={props['data-value']}>
      {rightButtons.includes(props['data-value']) ? (
        <span><span className="side-data"> {props.side}</span> {props['data-value']}</span>
      ) : (
        <span>{props['data-value']} <span className="side-data"> {props.side}</span></span>
      )}
      </div>
    )
}

export default PhoneButton;
