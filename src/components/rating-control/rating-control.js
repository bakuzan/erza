import React, { Component } from 'react';
import './rating-control.css';

class RatingControl extends Component {

  constructor() {
    super();

    this.maximum = 10;
    this.iterator = Array(this.maximum).fill(null);
  }

  handleChange(event) {
    if (!this.props.onChange) return;
    const { value } = event.target;
    this.props.onChange({
      target: {
        value,
        name: this.props.name
      }
    });
  }

  ratingColouriser(value) {
    if (value < 4) return 'low';
    if (value < 7) return 'average';
    if (value < 9) return 'good';
    return 'great';
  }

  renderSelectors() {
    return this.iterator.map((item, index) => {
      const value = index + 1;
      const colourise = this.ratingColouriser(value);
      const hoverInfo = `${value}/${this.maximum}`;
      const highlight = this.props.value < value ? '' :
                        this.props.value > value ? ' past' : ' selected';
      return (
        <label key={index} className={`rating-control-option ${colourise}${highlight}`} title={hoverInfo}>
          <input type="radio"
                 name={`${this.props.name}-${value}`}
                 value={value}
                 checked={value === this.props.value}
                 onChange={(e) => this.handleChange(e)}
          />
        </label>
      );
    });
  }

  render() {
    const ratingSelectors = this.renderSelectors();

    return (
      <div className="rating-control" role="radiogroup">
        { ratingSelectors }
      </div>
    );
  }

}

export default RatingControl;
