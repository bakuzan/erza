import React from 'react';

class RatingControl extends Component {

  constructor() {
    super();
    
    this.maximum = 10;
    this.iterator = Array(this.maximum).fill(null);
  }

  handleChange(event) {
    if (!this.props.onChange) return;
    const { value } = event.target;
    this.props.onChange(this.props.name, value);
  }
  
  renderSelectors() {
    return this.iterator.map((item, index) => {
      const value = index + 1;
      
      return (
        <label>
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
