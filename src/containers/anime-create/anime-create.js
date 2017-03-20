import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createAnime, editAnime } from '../../actions/index'
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
    const animeItem = Object.assign({}, this.state);
    if (this.props.isCreate) return this.props.dispatch(createAnime(animeItem));
    return this.props.dispatch(editAnime(animeItem));
  }

  render() {
    return (
      <div className="center-contents padding-10">
        <form name="animeForm" noValidate="" onSubmit={e => this.handleSubmit(e)}>
          <div className="has-float-label input-container">
            <input type="text"
                   name="title"
                   value={this.state.title}
                   placeholder="title"
                   autoFocus
                   onChange={(e) => this.handleUserInput(e)}
             />
            <label>title</label>
          </div>
          <div className="has-float-label input-container">
            <input type="number"
                   name="episode"
                   value={this.state.episode}
                   min="0"
                   placeholder="episode"
                   onChange={(e) => this.handleUserInput(e)}
             />
            <label>episode</label>
          </div>

          <button type="submit" className="button ripple">
          { this.props.isCreate ? Strings.create : Strings.edit }
          </button>
        </form>
      </div>
    );
  }

}

AnimeCreate.PropTypes = {
  isCreate: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired
};

const getInitalItem = (state, params) => {
  if (!!params.id) return state.byId[params.id];
  return {
    id: null,
    title: '',
    episode: 0
    // TODO Finish this default implementation!!
  };
}

const mapStateToProps = (state, ownProps) => ({
  isCreate: !ownProps.params.id,
  item: getInitalItem(state.anime, ownProps.params)
})

export default connect(
  mapStateToProps
)(AnimeCreate)
