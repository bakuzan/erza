import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import { createAnime, editAnime } from '../../actions/index'
import { Strings, Enums } from '../../constants/values'
import { Paths } from '../../constants/paths'
import { capitalise, getEventValue } from '../../utils/common'
import ValidationUtil from '../../utils/validation'
import AnimeModel from '../../models/anime-model';
import RatingControl from '../../components/rating-control/rating-control';
import Tickbox from '../../components/tickbox/tickbox';
import SelectBox from '../../components/select-box/select-box';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import TabContainer from '../../components/tab-container/tab-container'
import TabView from '../../components/tab-view/tab-view'

class AnimeCreate extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.item); // yes, i know i'm assigning a prop to state.

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleListUpdate = this.handleListUpdate.bind(this);
  }

  handleUserInput({ target }) {
    const updatedValue = getEventValue(target);
    this.setState((prevState) => {
      const updatedState = Object.assign({}, prevState, { [target.name]: updatedValue });
      return ValidationUtil.validateAnimeModel(updatedState, target.name);
    });
  }
  
  handleListUpdate(name, newList) {
    this.setState({ [name]: newList });
  }

  handleSubmit(event) {
    event.preventDefault();
    const animeItem = Object.assign({}, this.state);
    if (this.props.isCreate) return this.props.dispatch(createAnime(animeItem));
    return this.props.dispatch(editAnime(animeItem));
  }

  render() {
    if (this.props.isFetching) return ( <LoadingSpinner size="fullscreen" /> );
    console.log('render anime create :: ', this.state);
    const statusOptions = Object.keys(Enums.anime.status).map(item => ({
      text: capitalise(item),
      value: Enums.anime.status[item]
    }));

    return (
      <div className="flex-column center-contents padding-10">
        <header>
          <h4>
          { `${this.props.isCreate ? Strings.create : Strings.edit} ${Strings.anime}` }
          </h4>
        </header>
        <div className="width-100 flex-row">
          <div className="series-image-container">
            <img src={this.state.image} alt={`Cover for ${this.state.title || 'anime under creation.'}`} />
          </div>
          <form name="animeForm"
                className="center-contents flex-column"
                autoComplete="false"
                noValidate=""
                onSubmit={e => this.handleSubmit(e)}
                >
            <TabContainer>
              <TabView name="Required">
                <div className="flex-column">
                  <div className="has-float-label input-container">
                    <input type="text"
                           name="title"
                           value={this.state.title}
                           placeholder="title"
                           autoFocus
                           autoComplete="false"
                           onChange={(e) => this.handleUserInput(e)}
                     />
                    <label>title</label>
                  </div>
                  <div className="has-float-label input-container">
                    <input type="number"
                           name="episode"
                           value={this.state.episode}
                           min="0"
                           max={this.state.series_episodes || null}
                           placeholder="episode"
                           onChange={(e) => this.handleUserInput(e)}
                     />
                    <label>episode</label>
                  </div>

                  <div className="has-float-label input-container">
                    <input type="date"
                           name="start"
                           value={this.state.start}
                           max={this.state.end}
                           placeholder="start"
                           onChange={(e) => this.handleUserInput(e)}
                     />
                    <label>start</label>
                  </div>
                  <div className="has-float-label input-container">
                    <input type="date"
                           name="end"
                           value={this.state.end}
                           min={this.state.start}
                           placeholder="end"
                           onChange={(e) => this.handleUserInput(e)}
                           disabled={this.state.status !== Enums.anime.status.completed}
                     />
                    <label>end</label>
                  </div>

                  <SelectBox name="status"
                             text="status"
                             value={this.state.status}
                             onSelect={(e) => this.handleUserInput(e)}
                             options={statusOptions}
                    />

                  <RatingControl name="rating"
                                 value={this.state.rating}
                                 onChange={this.handleUserInput}
                  />

                  <Tickbox text="owned"
                           name="owned"
                           checked={this.state.owned}
                           onChange={this.handleUserInput}
                   />
                  <Tickbox text="is adult"
                           name="isAdult"
                           checked={this.state.isAdult}
                           onChange={this.handleUserInput}
                  />
                  <Tickbox text="is repeat"
                           name="isRepeat"
                           checked={this.state.isRepeat}
                           onChange={this.handleUserInput}
                           disabled={this.state.status !== Enums.anime.status.completed}
                  />
                </div>
              </TabView>
              <TabView name="Additional">
                <div className="flex-column">
                  <div className="has-float-label input-container">
                    <input type="number"
                      name="series_episodes"
                      value={this.state.series_episodes}
                      min="1"
                      placeholder="episodes"
                      onChange={(e) => this.handleUserInput(e)}
                      />
                    <label>total episodes</label>
                  </div>

                  <FileUploader
                    name="image"
                    value={this.state.image}
                    placeholder="upload image"
                    onFileSelect={(e) => this.handleUserInput(e)}
                    />
                  <div className="has-float-label input-container">
                    <input type="url"
                      name="link"
                      value={this.state.link}
                      placeholder="link"
                      onChange={(e) => this.handleUserInput(e)}
                      />
                    <label>link</label>
                  </div>
                  
                  <InputList
                    name="tags"
                    label="tags"
                    placeholder="add tag..."
                    list={this.state.tags}
                    updateList={this.handleListUpdate}
                   />
                </div>
              </TabView>
            </TabContainer>
            <div className="button-group">
              <button type="submit" className="button ripple">
              { this.props.isCreate ? Strings.create : Strings.edit }
              </button>
              <Link to={`${Paths.base}${Paths.anime.list}${Strings.filters.ongoing}`}
                    className="button-link">
              { Strings.cancel }
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

}

AnimeCreate.propTypes = {
  isCreate: PropTypes.bool.isRequired,
  item: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired
};

const getInitalItem = (state, params) => {
  if (!!params.id) return new AnimeModel(state.byId[params.id]);
  return new AnimeModel();
}

const mapStateToProps = (state, ownProps) => ({
  isCreate: !ownProps.params.id,
  item: getInitalItem(state.entities.anime, ownProps.params),
  isFetching: state.isFetching
})

export default connect(
  mapStateToProps
)(AnimeCreate)
