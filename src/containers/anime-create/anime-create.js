import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import { createAnime, editAnime } from '../../actions/anime'
import { Strings, Enums } from '../../constants/values'
import { Paths } from '../../constants/paths'
import { capitalise, getEventValue } from '../../utils/common'
import { formatDateForInput } from '../../utils/date'
import { mapStateToEntityList } from '../../utils/data'
import AnimeValidator from '../../utils/validators/anime-creation'
import AnimeModel from '../../models/anime-model';
import RatingControl from '../../components/rating-control/rating-control';
import Tickbox from '../../components/tickbox/tickbox';
import SelectBox from '../../components/select-box/select-box';
import InputList from '../../components/input-list/input-list';
import LoadingSpinner from '../../components/loading-spinner/loading-spinner';
import TabContainer from '../../components/tab-container/tab-container'
import TabView from '../../components/tab-view/tab-view'
import FileUploader from '../../components/file-uploader/file-uploader'
import MalSearch from '../../components/mal-search/mal-search'
import {loadAnimeById} from '../../actions/anime'
import { loadTags } from '../../actions/tags'

const loadData = props => {
  props.loadTags();
  if (!!props.params.id) {
    props.loadAnimeById(props.params.id, 'getByIdForEdit');
  }
}

class AnimeCreate extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.item); // yes, i know i'm assigning a prop to state.

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleListUpdate = this.handleListUpdate.bind(this);
  }

  componentDidMount() {
    loadData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.item.tags || !nextProps.item.tags.find(x => x && typeof x === 'object')) return;
    this.setState(nextProps.item);
  }

  handleMalSelect(malItem) {
    console.log('MAL > ', malItem);
  }

  handleUserInput({ target }) {
    const updatedValue = getEventValue(target);
    this.setState((prevState) => {
      const updatedState = Object.assign({}, prevState, { [target.name]: updatedValue });
      return AnimeValidator.validateAnimeChanges(updatedState, target.name);
    });
  }

  handleListUpdate(name, newList) {
    this.setState({ [name]: newList });
  }

  handleSubmit(event) {
    event.preventDefault();
    const animeItem = AnimeValidator.validateAnimeSubmission(this.state);
    if (this.props.isCreate) return this.props.createAnime(animeItem);
    return this.props.editAnime(animeItem);
  }

  render() {
    if (this.props.isFetching) return ( <LoadingSpinner size="fullscreen" /> );
    console.log('render anime create :: ', this.state, this.props);
    const statusOptions = Object.keys(Enums.anime.status).filter(x => x !== 'all').map(item => ({
      text: capitalise(item),
      value: Enums.anime.status[item]
    }));
    const availableTags = this.props.typeaheadTags.filter(x => x.isAdult === this.state.isAdult);

    return (
      <div className="flex-column center-contents padding-10">
        <header>
          <h4>
          { `${this.props.isCreate ? Strings.create : Strings.edit} ${Strings.anime}` }
          </h4>
        </header>
        <div className="width-100 flex-row">
          <div className="series-image-container">
          {
            this.state.image && this.state.image.startsWith('blob:') &&
            <div>
              <p>* This is a preview image</p>
            </div>
          }
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
                  <MalSearch
                    search={this.state.title}
                    onChange={this.handleUserInput}
                    selectMalItem={this.handleMalSelect}
                  />

                  <div className="has-float-label input-container">
                    <input type="text"
                           name="title"
                           value={this.state.title}
                           placeholder=" "
                           autoFocus
                           autoComplete="false"
                           onChange={this.handleUserInput}
                     />
                    <label>title</label>
                  </div>
                  <div className="has-float-label input-container">
                    <input type="number"
                           name="episode"
                           value={this.state.episode}
                           min="0"
                           max={this.state.series_episodes || null}
                           placeholder=" "
                           onChange={this.handleUserInput}
                     />
                    <label>episode</label>
                  </div>

                  <div className="has-float-label input-container">
                    <input type="date"
                           name="start"
                           value={formatDateForInput(this.state.start)}
                           max={this.state.end}
                           placeholder=" "
                           onChange={this.handleUserInput}
                     />
                    <label>start</label>
                  </div>
                  <div className="has-float-label input-container">
                    <input type="date"
                           name="end"
                           value={formatDateForInput(this.state.end)}
                           min={this.state.start}
                           placeholder=" "
                           onChange={this.handleUserInput}
                           disabled={this.state.status !== Enums.anime.status.completed}
                     />
                    <label>end</label>
                  </div>

                  <SelectBox name="status"
                             text="status"
                             value={this.state.status}
                             onSelect={this.handleUserInput}
                             options={statusOptions}
                    />

                  <RatingControl name="rating"
                                 label="series rating"
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
                           disabled={(this.state.status !== Enums.anime.status.completed) || (this.state.isRepeat && this.state.episode !== 0)}
                  />
                </div>
              </TabView>
              <TabView name="Additional">
                <div className="flex-column">
                  <div className="has-float-label input-container">
                    <input type="number"
                      name="series_episodes"
                      value={this.state.series_episodes}
                      min="0"
                      placeholder=" "
                      onChange={this.handleUserInput}
                      />
                    <label>total episodes</label>
                  </div>

                  <FileUploader
                    name="image"
                    value={this.state.image}
                    placeholder="Choose image"
                    onFileSelect={this.handleUserInput}
                    />
                  <div className="has-float-label input-container">
                    <input 
                      type="url"
                      name="link"
                      value={this.state.link}
                      placeholder=" "
                      onChange={this.handleUserInput}
                      />
                    <label>link</label>
                  </div>

                  <InputList
                    name="tags"
                    label="tags"
                    placeholder=" "
                    list={this.state.tags}
                    typeahead={availableTags}
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
  isFetching: PropTypes.bool.isRequired,
  typeaheadTags: PropTypes.arrayOf(PropTypes.object)
};

const setAnimeTags = (entities, anime) => entities.tags.allIds.length === 0 ? anime.tags : anime.tags.map(_id => entities.tags.byId[_id]);
const getInitalItem = (entities, params) => {
  if (!params.id) return new AnimeModel();
  const anime = entities.anime.byId[params.id];

  if (!anime) return new AnimeModel();
  const editItem = Object.assign({}, anime, {
    tags: !!anime.tags ? setAnimeTags(entities, anime) : []
  });
  console.log('%c get inital !! ', 'color: magenta;', editItem);
  return new AnimeModel(editItem);
}

const mapStateToProps = (state, ownProps) => ({
  isCreate: !ownProps.params.id,
  item: getInitalItem(state.entities, ownProps.params),
  isFetching: state.isFetching,
  typeaheadTags: mapStateToEntityList(state.entities.tags)
})

const mapDispatchToProps = {
  loadTags,
  loadAnimeById,
  createAnime,
  editAnime
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnimeCreate)
