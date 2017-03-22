import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import { createAnime, editAnime } from '../../actions/index'
import { Strings } from '../../constants/strings'
import { Paths } from '../../constants/paths'
import AnimeModel from '../../models/anime-model';
import RatingControl from '../../components/rating-control/rating-control';

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
      <div className="flex-column center-contents padding-10">
        <header>
          <h4>
          { `${this.props.isCreate ? Strings.create : Strings.edit} ${Strings.anime}` }
          </h4>
        </header>
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

          <div className="has-float-label input-container">
            <input type="date"
                   name="start"
                   value={this.state.start}
                   placeholder="start"
                   onChange={(e) => this.handleUserInput(e)}
             />
            <label>start</label>
          </div>
          <div className="has-float-label input-container">
            <input type="date"
                   name="end"
                   value={this.state.end}
                   placeholder="end"
                   onChange={(e) => this.handleUserInput(e)}
             />
            <label>end</label>
          </div>

          <RatingControl readOnly="false"
                         name="rating"
                         value={this.state.rating}
                         onChange={this.handleUserInput}
          />

          <div className="has-float-label input-container">
            <label>
              <input type="checkbox"
                     name="owned"
                     value={this.state.owned}
                     onChange={(e) => this.handleUserInput(e)}
             />
             owned
            </label>
          </div>
          <div className="has-float-label input-container">
            <label>
              <input type="checkbox"
                     name="isAdult"
                     value={this.state.isAdult}
                     onChange={(e) => this.handleUserInput(e)}
             />
             is adult
            </label>
          </div>
          <div className="has-float-label input-container">
            <label>
              <input type="checkbox"
                     name="isRepeat"
                     value={this.state.isRepeat}
                     onChange={(e) => this.handleUserInput(e)}
             />
             is repeat
            </label>
          </div>

          <div className="button-group">
            <button type="submit" className="button ripple">
            { this.props.isCreate ? Strings.create : Strings.edit }
            </button>
            <Link to={`${Paths.base}${Paths.anime.list}`}
                  className="button-link">
            { Strings.cancel }
            </Link>
          </div>
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
  if (!!params.id) return new AnimeModel(state.byId[params.id]);
  return new AnimeModel();
}

const mapStateToProps = (state, ownProps) => ({
  isCreate: !ownProps.params.id,
  item: getInitalItem(state.anime, ownProps.params)
})

export default connect(
  mapStateToProps
)(AnimeCreate)
