import React, { PropTypes } from 'react'

const SelectBox = ({ name, value, disabled, onSelect, text, options }) => (
  <div className="has-float-label select-container">
    <select className="select-box"
            name={name}
            value={value}
            onChange={(e) => onSelect(e)}
            disabled={disabled}
      >
      {
        options.map(item => (
          <option key={item.value}
                  value={item.value}>
            { item.text }
          </option>
        ))
      }
    </select>
    <label>{ text }</label>
  </div>
);

export default SelectBox
