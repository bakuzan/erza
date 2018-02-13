import PropTypes from 'prop-types';
import React from 'react';
import './tickbox.css';

const Tickbox = ({ name, checked, disabled, onChange, text }) => (
  <div className="input-container">
    <label className="tickbox">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {text}
    </label>
  </div>
);

Tickbox.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  text: PropTypes.string
};

export default Tickbox;
