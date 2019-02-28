import React from 'react';

function PhoneButton(props){
    const rightButtons = ['3','6','9','#'];

    return (
      <div className="phone-button" onClick={props.handleClick} number={props['data-value']} data-value={props['data-value']}>
      {rightButtons.includes(props['data-value']) ? (
        <span data-value={props['data-value']}><span className="button-side-data"> {props.side}</span> {props['data-value']}</span>
      ) : (
        <span data-value={props['data-value']}>{props['data-value']} <span className="button-side-data"> {props.side}</span></span>
      )}
      </div>
    )
}

export default PhoneButton;
