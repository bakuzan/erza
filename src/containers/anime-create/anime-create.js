import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAnime } from '../../actions/index'
import { Strings } from '../../constants/strings'

class AnimeCreate extends Component {
  
  constructor() {
    super();
    this.state = {}; // TODO initalise state 
  }
  
  handleUserInput(event) {
    const { name, type, value, checked } = event.target;
    const updatedValue = type === Strings.checkbox ? checked : value; 
    this.setState({ [name]: updatedValue });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    console.log(event, this.state);
    // Get the state here and dispatch to a thunk
    // thunk will save item to db, then dispatch action
    // action will update redux state
    this.props.dispatch(createAnime());
  }
  
  render() {
    <div>
      <form name="animeForm" noValidate="" onSubmit={e => this.handleSubmit(e)}>
        <div className="has-float-label text-input-container">
          <input type="text"
                 name="title"
                 placeholder="title"
                 autoFocus
                 onChange={(e) => this.handleUserInput(e)}
           />
          <label>title</label>
        </div>

        <button type="submit">
        { Strings.create }
        </button>
      </form>
    </div>
  }
  
}

AnimeCreate = connect()(AnimeCreate)

export default AnimeCreate
