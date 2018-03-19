import React from 'react';
import PropTypes from 'prop-types';
import { Icons } from '../../constants/values';
import { debounce } from '../../utils/common';
import './clearable-input.css';

class ClearableInput extends React.Component {
  constructor(props) {
    super(props);

    this.inputField = null;
    this.clearAndFocusInput = this.clearAndFocusInput.bind(this);
  }

  clearAndFocusInput() {
    this.props.onChange({ target: { name: this.props.name, value: '' } });
    console.log(this.inputField);
    debounce(() => this.inputField.focus(), 100);
  }

  render() {
    const {
      type,
      label,
      name,
      value,
      maxLength,
      onChange,
      ...props
    } = this.props;

    return (
      <div className="has-float-label input-container clearable-input">
        <input
          ref={input => (this.inputField = input)}
          placeholder=" "
          autoComplete="off"
          type={type}
          label={label}
          name={name}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          {...props}
        />
        <label>{label}</label>
        {!!value &&
          type === 'text' && (
            <button
              type="button"
              className="button-icon small clear-input"
              icon={Icons.cross}
              onClick={this.clearAndFocusInput}
            />
          )}
        {!!maxLength && (
          <span className="clearable-input-count">
            {`${value.length}/${maxLength}`}
          </span>
        )}
      </div>
    );
  }
}

ClearableInput.defaultProps = {
  name: 'search',
  label: 'search',
  type: 'text'
};

ClearableInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  maxLength: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func
};

export default ClearableInput;
