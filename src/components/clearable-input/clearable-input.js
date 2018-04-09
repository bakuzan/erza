import classNames from 'classnames';
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
    const isTextInput = type === 'text';
    const hasMaxNumber = type === 'number' && !isNaN(props.max);
    const notClearable = !isTextInput;

    return (
      <div
        className={classNames(
          'has-float-label input-container clearable-input',
          { 'not-clearable': notClearable }
        )}
      >
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
          isTextInput && (
            <button
              type="button"
              className="button-icon small clear-input"
              icon={Icons.cross}
              onClick={this.clearAndFocusInput}
            />
          )}
        {(!!maxLength || hasMaxNumber) && (
          <span className="clearable-input-count">
            {maxLength && `${value.length}/${maxLength}`}
            {hasMaxNumber && `out of ${props.max || '?'}`}
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
