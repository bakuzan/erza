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

SelectBox.defaultProps = {
  disabled: false
}

SelectBox.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]).isRequired,
  disabled: PropTypes.bool,
  text: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired
}

export default SelectBox
