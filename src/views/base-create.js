import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router'
import { Strings, Enums } from '../constants/values'
import { Paths } from '../constants/paths'
import { capitalise, getEventValue, updateSameAsObject, isObject } from '../utils/common'
import { formatDateForInput } from '../utils/date'
import { mapStateToEntityList, intergrateMalEntry, getUniquePropertiesForItemType, itemModelForType } from '../utils/data'
import AnimeValidator from '../utils/validators/anime-creation'
import MangaValidator from '../utils/validators/manga-creation'
import RatingControl from '../components/rating-control/rating-control';
import Tickbox from '../components/tickbox/tickbox';
import SelectBox from '../components/select-box/select-box';
import InputList from '../components/input-list/input-list';
import LoadingSpinner from '../components/loading-spinner/loading-spinner';
import TabContainer from '../components/tab-container/tab-container'
import TabView from '../components/tab-view/tab-view'
import FileUploader from '../components/file-uploader/file-uploader'
import MalSearch from '../components/mal-search/mal-search'
import { loadTags } from '../actions/tags'

const loadData = props => {
  props.loadTags();
  if (!!props.itemId) {
    props.actions.loadById(props.itemId, 'getByIdForEdit');
  }
}

class BaseCreate extends Component {

  constructor(props) {
    super(props);
    this.state = Object.assign({}, props.item); // yes, i know i'm assigning a prop to state.

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleMalSelect = this.handleMalSelect.bind(this);
    this.handleListUpdate = this.handleListUpdate.bind(this);
  }

  componentDidMount() {
    loadData(this.props);
    this.hydrateMalFields = intergrateMalEntry(this.props.type);
    this.validator = this.props.type === Strings.anime ? AnimeValidator : MangaValidator;
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (!nextProps.item.tags || !nextProps.item.tags.find(x => x && isObject(x))) return;
    console.log('will get props >> ', nextProps, nextState);
    this.setState(nextProps.item);
  }

  handleMalSelect(malItem) {
    console.log('MAL Select > ', malItem);
    if (updateSameAsObject(this.state, malItem)) return;
    this.setState((prevState) => this.hydrateMalFields(prevState, malItem));
  }

  handleUserInput({ target }) {
    const updatedValue = getEventValue(target);
    this.setState((prevState) => {
      const updatedState = Object.assign({}, prevState, { [target.name]: updatedValue });
      return this.validator.validateChanges(updatedState, target.name);
    });
  }

  handleListUpdate(name, newList) {
    this.setState({ [name]: newList });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.validator.validateSubmission(this.state).then(item => {
      if (this.props.isCreate) return this.props.create(item);
      return this.props.edit(item);
    })
  }

  render() {
    if (this.props.isFetching) return ( <LoadingSpinner size="fullscreen" /> );
    console.log('render base create :: ', this.state, this.props);
    const { type } = this.props;
    const { current, total } = getUniquePropertiesForItemType(type);
    const statusOptions = Object.keys(Enums.status)
                                .filter(x => x !== 'all')
                                .map(item => ({ text: capitalise(item), value: Enums.status[item] }));
    const availableTags = this.props.typeaheadTags.filter(x => x.isAdult === this.state.isAdult);

    return (
      <div className="flex-column center-contents padding-10">
        <header>
          <h4>
          { `${this.props.isCreate ? Strings.create : Strings.edit} ${Strings[type]}` }
          </h4>
        </header>
        <div className="width-100 flex-row">
          <div className="series-image-container full">
          {
            this.state.image && this.state.image.startsWith('blob:') &&
            <div>
              <p>* This is a preview image</p>
            </div>
          }
            <img src={this.state.image} alt={`Cover for ${this.state.title || `${type} under creation.`}`} />
          </div>
          <form name={`${type}Form`}
                className="center-contents flex-column"
                autoComplete="false"
                noValidate=""
                onSubmit={this.handleSubmit}
                >
            <TabContainer>
              <TabView name="Required">
                <div className="flex-column">
                  <MalSearch
                    id={this.state.malId}
                    type={type}
                    search={this.state.title}
                    onUserInput={this.handleUserInput}
                    selectMalItem={this.handleMalSelect}
                  />

                  <div className="has-float-label input-container">
                    <input type="number"
                           name={current}
                           value={this.state[current]}
                           min="0"
                           max={this.state[total] || null}
                           placeholder=" "
                           onChange={this.handleUserInput}
                     />
                    <label>{ current }</label>
                  </div>

                  {
                    type === Strings.manga &&
                    <div className="has-float-label input-container">
                      <input type="number"
                             name="volume"
                             value={this.state.volume}
                             min="0"
                             max={this.state.series_volumes || null}
                             placeholder=" "
                             onChange={this.handleUserInput}
                       />
                      <label>volume</label>
                    </div>
                  }

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
                           disabled={this.state.status !== Enums.status.completed}
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
                           disabled={(this.state.status !== Enums.status.completed) || (this.state.isRepeat && this.state[current] !== 0)}
                  />
                </div>
              </TabView>
              <TabView name="Additional">
                <div className="flex-column">
                  <div className="has-float-label input-container">
                    <input type="number"
                      name={total}
                      value={this.state[total]}
                      min="0"
                      placeholder=" "
                      onChange={this.handleUserInput}
                      />
                    <label>{`total ${current}s`}</label>
                  </div>

                  {
                    type === Strings.manga &&
                    <div className="has-float-label input-container">
                      <input type="number"
                        name="series_volumes"
                        value={this.state.series_volumes}
                        min="0"
                        placeholder=" "
                        onChange={this.handleUserInput}
                        />
                      <label>total volumes</label>
                    </div>
                  }
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
              <Link to={`${Paths.base}${Paths[type].list}${Strings.filters.ongoing}`}
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

BaseCreate.propTypes = {
  type: PropTypes.string.isRequired,
  actions: PropTypes.object.isRequired,
  isCreate: PropTypes.bool.isRequired,
  itemId: PropTypes.string,
  item: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  typeaheadTags: PropTypes.arrayOf(PropTypes.object)
}

const setEntityTags = (entities, item) => entities.tags.allIds.length === 0 ? item.tags : item.tags.map(_id => entities.tags.byId[_id]);
const getInitalItem = (entities, props) => {
  if (!props.itemId) return itemModelForType(props.type)();
  const item = entities[props.type].byId[props.itemId];

  if (!item) return itemModelForType(props.type)();
  const itemForEdit = Object.assign({}, item, {
    tags: !!item.tags ? setEntityTags(entities, item) : []
  });
  console.log('%c get inital !! ', 'color: magenta;', itemForEdit);
  return itemModelForType(props.type)(itemForEdit);
}

const mapStateToProps = (state, ownProps) => ({
  isCreate: !ownProps.itemId,
  item: getInitalItem(state.entities, ownProps),
  isFetching: state.isFetching,
  typeaheadTags: mapStateToEntityList(state.entities.tags)
})

const mapDispatchToProps = {
  loadTags
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaseCreate)
