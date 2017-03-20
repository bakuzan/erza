import React, { Component } from 'react';

class Form extends Component {
  
  constructor() {
    super();
    this.state = 
  }
  
  handleSubmit(event) {
    event.preventDefault();
  }
  
  render() {
    return (
      <form name={this.props.name} onSubmit={this.handleSubmit} noValidate="">
      
      </form>
    );
  }
  
}

export default Form;
