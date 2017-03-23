import React from 'react'
import './tickbox.css'

const Tickbox = ({ name, checked, disabled, onChange, text }) => (
  <label className="tickbox">
    <input type="checkbox"
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
      />
    { text }
  </label>
);

export default Tickbox
