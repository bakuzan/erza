import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createAnime, updateAnime } from '../../actions/index'
import { Strings } from '../../constants/strings'

class AnimeCreate extends Component {
  
  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.item); // yes, i know i'm assigning a prop to state.
  }
  
  handleUserInput(event) {
    const { name, type, value, checked } = event.target;
    const updatedValue = type === Strings.checkbox ? checked : value; 
    this.setState({ [name]: updatedValue });
  }
  
  handleSubmit(event) {
    event.preventDefault();
    console.log(event, this.state);
    const animeItem = Object.assign({}, this.state);
    if (this.props.isCreate) return this.props.dispatch(createAnime(animeItem));
    return this.props.dispatch(updateAnime(animeItem));
  }
  
  render() {
    <div>
      <form name="animeForm" noValidate="" onSubmit={e => this.handleSubmit(e)}>
        <div className="has-float-label text-input-container">
          <input type="text"
                 name="title"
                 value={this.state.title}
                 placeholder="title"
                 autoFocus
                 onChange={(e) => this.handleUserInput(e)}
           />
          <label>title</label>
        </div>

        <button type="submit">
        { this.props.isCreate ? Strings.create : Strings.edit }
        </button>
      </form>
    </div>
  }
  
}

AnimeCreate.PropTypes = {
  isCreate: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired
};

const getInitalItem = (state, params) => {
  if (!!params.id) return state[params.id];
  return {
    id: null,
    title: ''
  };
}

const mapStateToProps = (state, ownProps) => ({
  isCreate: !ownProps.params.id,
  item: getInitalItem(state.anime.byId, ownProps.params)
})

export default connect(
  mapStateToProps
)(AnimeCreate)
