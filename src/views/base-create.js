import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Strings, Enums } from '../constants/values';
import { Paths } from '../constants/paths';
import {
  capitalise,
  getEventValue,
  isObject,
  objectsAreEqual,
  constructObjectFromSearchParams
} from '../utils/common';
import {
  mapStateToEntityList,
  shouldIntergrateMalEntry,
  intergrateMalEntry,
  getUniquePropertiesForItemType,
  itemModelForType
} from '../utils/data';
import animeValidator from '../utils/validators/anime-creation';
import mangaValidator from '../utils/validators/manga-creation';

import {
  MalSearch,
  ClearableInput,
  Tabs,
  ChipListInput,
  SelectBox,
  Tickbox,
  Loaders,
  RatingControl,
  ImageSelector,
  Image,
  Utils
} from 'meiko';
import DateSelector from 'components/date-selector';
import { ButtonisedNavLink, Button } from 'components/buttonised';
import { createTag, loadTags } from '../actions/tags';
import { showAlertError } from '../actions/alert';

const loadData = (props) => {
  props.loadTags();
  if (!!props.itemId) {
    props.actions.loadById(props.itemId, 'getByIdForEdit');
  }
};

const mapEnumToSelectBox = (obj) => (item) => ({
  text: item.length > 3 ? capitalise(item) : item.toUpperCase(),
  value: obj[item]
});

const STATUS_OPTIONS = Object.keys(Enums.status)
  .filter((x) => x !== 'all')
  .map(mapEnumToSelectBox(Enums.status));

class BaseCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.item,
      isAdult: props.isAdult
    }; // yes, i know i'm assigning a props to state.

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleDateInput = this.handleDateInput.bind(this);
    this.handleMalSelect = this.handleMalSelect.bind(this);
    this.handleListUpdate = this.handleListUpdate.bind(this);
    this.handleUploadError = this.handleUploadError.bind(this);
  }

  componentDidMount() {
    loadData(this.props);
    this.hydrateMalFields = intergrateMalEntry(this.props.type);
    this.shouldHydrateMal = shouldIntergrateMalEntry(this.props.type);
    this.validator =
      this.props.type === Strings.anime ? animeValidator : mangaValidator;

    this.setState({ ...this.resolveSearchParams() });
  }

  componentDidUpdate(prevProps) {
    const itemUnchanged = objectsAreEqual(this.props.item, prevProps.item);
    const isAdultUnchanged = this.props.isAdult === prevProps.isAdult;
    if (itemUnchanged && isAdultUnchanged) return;

    if (!isAdultUnchanged) {
      this.props.loadTags();
    }

    this.setState({
      ...this.props.item,
      ...this.resolveSearchParams(),
      isAdult: this.props.isAdult
    });
  }

  resolveSearchParams() {
    const { search } = this.props.location;
    return this.props.isCreate && search
      ? constructObjectFromSearchParams(search)
      : {};
  }

  handleMalSelect(malItem) {
    if (!malItem) return this.setState({ malId: null });
    if (!this.shouldHydrateMal(this.state, malItem)) return;
    this.setState((prevState) => this.hydrateMalFields(prevState, malItem));
  }

  handleUserInput({ target }) {
    const updatedValue = getEventValue(target);
    this.setState((prevState) => {
      const updatedState = Object.assign({}, prevState, {
        [target.name]: updatedValue
      });
      return this.validator.validateChanges(updatedState, target.name);
    });
  }

  handleDateInput(date, name, hasError) {
    if (hasError) return;
    this.setState((prev) => {
      const updated = { ...prev, [name]: date };
      return this.validator.validateChanges(updated, name);
    });
  }

  handleListUpdate(name, newList) {
    this.setState({ [name]: newList });
  }

  handleUploadError(uploadError) {
    const { message, error } = uploadError;
    const detail = `HTTP ${error.statusCode}\n${error.message}`;
    this.props.showAlertError({ message, detail });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.validator.validateSubmission(this.state).then((item) => {
      if (this.props.isCreate) return this.props.actions.create(item);
      return this.props.actions.edit(item);
    });
  }

  render() {
    if (
      this.props.isFetching ||
      !this.props.item.tags ||
      (this.props.item.tags.length > 0 &&
        !this.props.item.tags.find((x) => x && isObject(x)))
    )
      return <Loaders.LoadingSpinner size="fullscreen" />;

    const { type } = this.props;
    const { current, total } = getUniquePropertiesForItemType(type);
    const availableTags = this.props.typeaheadTags;

    const seriesTypes = Enums[type].type;
    const SERIES_TYPE_OPTIONS = Object.keys(seriesTypes).map(
      mapEnumToSelectBox(seriesTypes)
    );

    return (
      <div className="flex-column center-contents padding-10">
        <header>
          <h4>
            {`${this.props.isCreate ? Strings.create : Strings.edit} ${
              Strings[type]
            }`}
          </h4>
        </header>
        <div className="width-100 flex-row">
          <div className="series-image-container full">
            {this.state.image &&
              this.state.image.startsWith('blob:') && (
                <div>
                  <p>* This is a preview image</p>
                </div>
              )}
            <Image
              src={this.state.image}
              alt={`Cover for ${this.state.title || `${type} under creation.`}`}
            />
          </div>
          <form
            name={`${type}Form`}
            className="center-contents flex-column"
            autoComplete="false"
            noValidate=""
            onSubmit={this.handleSubmit}
          >
            <Tabs.TabContainer
              className="tabs-component"
              tabsClassName="tabs-container"
            >
              <Tabs.TabView name="Required">
                <div className="flex-column width-100">
                  <MalSearch
                    menuClassName="erza-autocomplete-menu"
                    id={this.state.malId}
                    itemId={this.state._id}
                    type={type}
                    search={this.state.title}
                    onUserInput={this.handleUserInput}
                    selectMalItem={this.handleMalSelect}
                  />

                  <ClearableInput
                    type="number"
                    name={current}
                    label={current}
                    value={this.state[current]}
                    min="0"
                    max={!!Number(this.state[total]) ? this.state[total] : null}
                    onChange={this.handleUserInput}
                  />

                  {type === Strings.manga && (
                    <ClearableInput
                      type="number"
                      name="volume"
                      label="volume"
                      value={this.state.volume}
                      min="0"
                      max={
                        !!Number(this.state.series_volumes)
                          ? this.state.series_volumes
                          : null
                      }
                      onChange={this.handleUserInput}
                    />
                  )}

                  <DateSelector
                    name="start"
                    label="start"
                    value={Utils.Date.formatDateForInput(this.state.start)}
                    beforeDate={this.state.end}
                    onChange={this.handleDateInput}
                  />

                  <DateSelector
                    name="end"
                    label="end"
                    value={Utils.Date.formatDateForInput(this.state.end)}
                    afterDate={this.state.start}
                    onChange={this.handleDateInput}
                    disabled={this.state.status !== Enums.status.completed}
                  />

                  <SelectBox
                    name="status"
                    text="status"
                    value={this.state.status}
                    onSelect={this.handleUserInput}
                    options={STATUS_OPTIONS}
                  />

                  <RatingControl
                    name="rating"
                    label="series rating"
                    value={this.state.rating}
                    onChange={this.handleUserInput}
                  />

                  <ChipListInput
                    tagClassName="erza-tag"
                    menuClassName="erza-autocomplete-menu"
                    attr="name"
                    name="tags"
                    chipsSelected={this.state.tags}
                    chipOptions={availableTags}
                    updateChipList={this.handleListUpdate}
                    createNew={this.props.createTag}
                  />
                </div>
              </Tabs.TabView>
              <Tabs.TabView name="Additional">
                <div className="flex-column width-100">
                  <ClearableInput
                    type="number"
                    name={total}
                    label={`total ${current}s`}
                    value={this.state[total]}
                    min="0"
                    onChange={this.handleUserInput}
                  />

                  {type === Strings.manga && (
                    <ClearableInput
                      type="number"
                      name="series_volumes"
                      label="total volumes"
                      value={this.state.series_volumes}
                      min="0"
                      onChange={this.handleUserInput}
                    />
                  )}

                  <ImageSelector
                    className="uploader"
                    uploaderClassName="uploader"
                    name="image"
                    url={this.state.image}
                    onChange={this.handleUserInput}
                    onError={this.handleUploadError}
                  />

                  <ClearableInput
                    type="url"
                    name="link"
                    label="link"
                    value={this.state.link}
                    placeholder=" "
                    onChange={this.handleUserInput}
                  />
                  <ClearableInput
                    type="number"
                    name="malId"
                    label="mal id"
                    value={this.state.malId}
                    min="0"
                    onChange={this.handleUserInput}
                  />

                  <Tickbox
                    text="owned"
                    name="owned"
                    checked={this.state.owned}
                    onChange={this.handleUserInput}
                  />
                  <Tickbox
                    text="is adult"
                    name="isAdult"
                    checked={this.state.isAdult}
                    disabled={true}
                    onChange={this.handleUserInput}
                  />
                  <Tickbox
                    text="is repeat"
                    name="isRepeat"
                    checked={this.state.isRepeat}
                    onChange={this.handleUserInput}
                    disabled={
                      this.state.status !== Enums.status.completed ||
                      (this.state.isRepeat && this.state[current] !== 0)
                    }
                  />
                </div>
              </Tabs.TabView>
              {type !== Strings.manga && (
                <Tabs.TabView name="Seasonal">
                  <div className="flex-column width-100">
                    <DateSelector
                      name="series_start"
                      label="series start"
                      value={Utils.Date.formatDateForInput(
                        this.state.series_start
                      )}
                      beforeDate={this.state.series_end}
                      onChange={this.handleDateInput}
                    />

                    <DateSelector
                      name="series_end"
                      label="series end"
                      value={Utils.Date.formatDateForInput(
                        this.state.series_end
                      )}
                      afterDate={this.state.series_start}
                      onChange={this.handleDateInput}
                    />

                    <SelectBox
                      name="series_type"
                      text="series type"
                      value={this.state.series_type}
                      onSelect={this.handleUserInput}
                      options={SERIES_TYPE_OPTIONS}
                    />

                    <Tickbox
                      text="Force In Season"
                      name="_legacyIsSeason"
                      checked={this.state._legacyIsSeason || false}
                      onChange={this.handleUserInput}
                    />
                  </div>
                </Tabs.TabView>
              )}
            </Tabs.TabContainer>
            <div className="button-group">
              <Button type="submit" className="ripple">
                {this.props.isCreate ? Strings.create : Strings.edit}
              </Button>
              <ButtonisedNavLink
                link
                btnStyle="primary"
                to={`${Paths.base}${Paths[type].list}${
                  Strings.filters.ongoing
                }`}
              >
                {Strings.cancel}
              </ButtonisedNavLink>
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
  typeaheadTags: PropTypes.arrayOf(PropTypes.object),
  isAdult: PropTypes.bool.isRequired
};

const setEntityTags = (entities, item) =>
  entities.tags.allIds.length === 0
    ? item.tags
    : item.tags.map((_id) => entities.tags.byId[_id]);
const getInitalItem = (entities, props) => {
  if (!props.itemId) return itemModelForType(props.type)();
  const item = entities[props.type].byId[props.itemId];

  if (!item) return itemModelForType(props.type)();
  const itemForEdit = Object.assign({}, item, {
    tags: !!item.tags ? setEntityTags(entities, item) : []
  });
  return itemModelForType(props.type)(itemForEdit);
};

const mapStateToProps = (state, ownProps) => ({
  isCreate: !ownProps.itemId,
  item: getInitalItem(state.entities, ownProps),
  isFetching: state.isFetching,
  typeaheadTags: mapStateToEntityList(state.entities.tags),
  isAdult: state.isAdult
});

const mapDispatchToProps = {
  createTag,
  loadTags,
  showAlertError
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseCreate);
