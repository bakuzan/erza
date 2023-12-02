import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import ChipListInput from 'meiko/ChipListInput';
import ClearableInput from 'meiko/ClearableInput';
import DateSelector from 'meiko/DateSelector';
import ImageSelector from 'meiko/ImageSelector';
import LoadingSpinner from 'meiko/LoadingSpinner';
import RatingControl from 'meiko/RatingControl';
import SelectBox from 'meiko/SelectBox';
import Tabs from 'meiko/Tabs';
import Tickbox from 'meiko/Tickbox';
import { ButtonisedNavLink, Button } from 'components/Buttonised';
import MalSearch from 'components/MalSearch';
import SeriesImageContainer from 'components/SeriesImageContainer';
import { Strings, Enums, Icons } from 'constants/values';
import Paths from 'constants/paths';
import { loadTags } from 'actions/tags';
import { showAlertError } from 'actions/alert';

import {
  capitalise,
  getEventValue,
  objectsAreEqual,
  constructObjectFromSearchParams,
  formatDateForInput
} from '../utils';
import {
  mapStateToEntityList,
  shouldIntergrateMalEntry,
  intergrateMalEntry,
  getUniquePropertiesForItemType,
  itemModelForType
} from 'utils/data';
import animeValidator from 'utils/validators/animeCreation';
import mangaValidator from 'utils/validators/mangaCreation';

const loadData = (props) => {
  props.loadTags();
  if (!!props.itemId) {
    props.actions.loadById(props.itemId);
  }
};

const mapEnumToSelectBox = (value) => ({
  text: value.length > 3 ? capitalise(value) : value.toUpperCase(),
  value
});

const STATUS_OPTIONS = Enums.status.All.map(mapEnumToSelectBox);

class BaseCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBasicUrlInput: true,
      form: {
        ...itemModelForType(props.type)(props.item),
        isAdult: props.isAdult
      }
    };

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

    this.setState((p) => ({
      form: { ...p.form, ...this.resolveSearchParams() }
    }));
  }

  componentDidUpdate(prevProps) {
    const previous = prevProps.item || {};
    const current = this.props.item || {};

    const itemUnchanged = objectsAreEqual(current, previous);
    const isAdultUnchanged = this.props.isAdult === prevProps.isAdult;

    if (itemUnchanged && isAdultUnchanged) {
      return;
    }

    if (!isAdultUnchanged) {
      this.props.loadTags();
    }

    this.setState((p) => ({
      form: {
        ...p.form,
        ...current,
        ...this.resolveSearchParams(),
        isAdult: this.props.isAdult
      }
    }));
  }

  resolveSearchParams() {
    const { search } = this.props.location;
    return this.props.isCreate && search
      ? constructObjectFromSearchParams(search)
      : {};
  }

  handleMalSelect(malItem) {
    if (!malItem) {
      return this.setState((p) => ({ form: { ...p.form, malId: null } }));
    }

    if (!this.shouldHydrateMal(this.state.form, malItem)) {
      return;
    }

    this.setState((prevState) => ({
      form: {
        ...prevState.form,
        ...this.hydrateMalFields(prevState.form, malItem)
      }
    }));
  }

  handleUserInput({ target }) {
    const updatedValue = getEventValue(target);
    this.setState((prevState) => {
      const updatedState = {
        ...prevState.form,
        [target.name]: updatedValue
      };

      return {
        ...prevState,
        form: {
          ...this.validator.validateChanges(updatedState, target.name)
        }
      };
    });
  }

  handleDateInput(date, name, hasError) {
    if (hasError) {
      return;
    }

    this.setState((prev) => {
      const updated = { ...prev.form, [name]: date };

      return {
        form: { ...this.validator.validateChanges(updated, name) }
      };
    });
  }

  handleListUpdate(name, newList) {
    this.setState((prev) => ({ form: { ...prev.form, [name]: newList } }));
  }

  handleUploadError(uploadError) {
    const { message, error } = uploadError;
    const detail = `HTTP ${error.statusCode}\n${error.message}`;
    this.props.showAlertError({ message, detail });
  }

  handleSubmit(event) {
    event.preventDefault();
    const form = { ...this.state.form };
    const item = { ...form, malId: form.malId || null };

    if (this.props.isCreate) {
      this.props.actions.create(item);
    } else {
      this.props.actions.edit(item);
    }
  }

  render() {
    const { type, isCreate, isFetching, item } = this.props;

    if (isFetching || !item || !item.tags) {
      return <LoadingSpinner size="fullscreen" />;
    }

    const { form, showBasicUrlInput } = this.state;
    const { current, total } = getUniquePropertiesForItemType(type);
    const availableTags = this.props.typeaheadTags;
    const titlePrefix = isCreate ? Strings.create : Strings.edit;
    const titleSuffix = isCreate || !form.title ? '' : `${form.title}`;

    const seriesTypes = Enums.seriesType[type];
    const SERIES_TYPE_OPTIONS = seriesTypes.map(mapEnumToSelectBox);

    return (
      <div className="flex flex--column center-contents padding-10">
        <Helmet>
          <title>{`${titlePrefix} ${titleSuffix} ${capitalise(
            Strings[type]
          )}`}</title>
        </Helmet>
        <header className="width-100">
          <h4>{`${titlePrefix} ${Strings[type]}`}</h4>
        </header>
        <div className="width-100 flex flex--row">
          <SeriesImageContainer
            isFull
            src={form.image}
            alt={`Cover for ${form.title || `${type} under creation.`}`}
            containerStyle={{ minWidth: 235 }}
          >
            {form.image && form.image.startsWith('blob:') && (
              <div>
                <p>* This is a preview image</p>
              </div>
            )}
          </SeriesImageContainer>
          <form
            name={`${type}Form`}
            className="center-contents flex flex--column"
            autoComplete="false"
            noValidate=""
            onSubmit={this.handleSubmit}
          >
            <Tabs.Container
              className="tabs-component"
              tabsClassName="tabs-container"
            >
              <Tabs.View name="Required">
                <div className="flex flex--column width-100">
                  <MalSearch
                    menuClassName="erza-autocomplete-menu"
                    id={form.malId || null}
                    itemId={form.id}
                    type={type}
                    search={form.title}
                    onUserInput={this.handleUserInput}
                    selectMalItem={this.handleMalSelect}
                  />

                  <ClearableInput
                    type="number"
                    id={current}
                    name={current}
                    label={current}
                    value={form[current]}
                    min="0"
                    max={!!Number(form[total]) ? form[total] : null}
                    onChange={this.handleUserInput}
                  />

                  {type === Strings.manga && (
                    <ClearableInput
                      type="number"
                      id="volume"
                      name="volume"
                      label="volume"
                      value={form.volume}
                      min="0"
                      max={
                        !!Number(form.series_volumes)
                          ? form.series_volumes
                          : null
                      }
                      onChange={this.handleUserInput}
                    />
                  )}

                  <DateSelector
                    id="start"
                    name="start"
                    label="start"
                    value={formatDateForInput(form.start)}
                    beforeDate={form.end}
                    onChange={this.handleDateInput}
                  />

                  <DateSelector
                    id="end"
                    name="end"
                    label="end"
                    value={formatDateForInput(form.end)}
                    afterDate={form.start}
                    onChange={this.handleDateInput}
                    disabled={form.status !== Enums.status.Completed}
                  />

                  <SelectBox
                    id="status"
                    name="status"
                    text="status"
                    value={form.status}
                    onChange={this.handleUserInput}
                    options={STATUS_OPTIONS}
                  />

                  <RatingControl
                    id="rating"
                    name="rating"
                    label="series rating"
                    value={form.rating}
                    onChange={this.handleUserInput}
                  />

                  <ChipListInput
                    tagClassName="erza-tag"
                    menuClassName="erza-autocomplete-menu"
                    id="tags"
                    attr="name"
                    name="tags"
                    chipsSelected={form.tags}
                    chipOptions={availableTags}
                    updateChipList={this.handleListUpdate}
                    createNew={(item) => {
                      this.handleListUpdate('tags', [
                        ...form.tags,
                        { ...item, id: -1 }
                      ]);
                    }}
                  />
                </div>
              </Tabs.View>
              <Tabs.View name="Additional">
                <div className="flex flex--column width-100">
                  <ClearableInput
                    type="number"
                    id={total}
                    name={total}
                    label={`total ${current}s`}
                    value={form[total]}
                    min="0"
                    onChange={this.handleUserInput}
                  />

                  {type === Strings.manga && (
                    <ClearableInput
                      type="number"
                      id="series_volumes"
                      name="series_volumes"
                      label="total volumes"
                      value={form.series_volumes}
                      min="0"
                      onChange={this.handleUserInput}
                    />
                  )}

                  <div className="image-options center-contents">
                    {showBasicUrlInput ? (
                      <ClearableInput
                        type="text"
                        id="image"
                        name="image"
                        label="image"
                        value={form.image}
                        placeholder=" "
                        onChange={this.handleUserInput}
                      />
                    ) : (
                      <ImageSelector
                        className="uploader"
                        uploaderClassName="uploader"
                        id="image"
                        name="image"
                        url={form.image}
                        onChange={this.handleUserInput}
                        onError={this.handleUploadError}
                      />
                    )}
                    <div>
                      <Button
                        btnStyle="primary"
                        icon={Icons.upDown}
                        onClick={() =>
                          this.setState((p) => ({
                            showBasicUrlInput: !p.showBasicUrlInput
                          }))
                        }
                      ></Button>
                    </div>
                  </div>

                  <ClearableInput
                    type="url"
                    id="link"
                    name="link"
                    label="link"
                    value={form.link}
                    placeholder=" "
                    onChange={this.handleUserInput}
                  />
                  <ClearableInput
                    type="number"
                    id="malId"
                    name="malId"
                    label="mal id"
                    value={form.malId || ''}
                    min="0"
                    onChange={this.handleUserInput}
                  />

                  <Tickbox
                    text="owned"
                    id="owned"
                    name="owned"
                    checked={form.owned}
                    onChange={this.handleUserInput}
                  />
                  <Tickbox
                    text="is adult"
                    id="isAdultSeries"
                    name="isAdult"
                    checked={form.isAdult}
                    disabled={true}
                    onChange={this.handleUserInput}
                  />
                  <Tickbox
                    text="is repeat"
                    id="isRepeat"
                    name="isRepeat"
                    checked={form.isRepeat}
                    onChange={this.handleUserInput}
                    disabled={
                      form.status !== Enums.status.Completed ||
                      (form.isRepeat && form[current] !== 0)
                    }
                  />
                </div>
              </Tabs.View>
              <Tabs.View name="Series">
                <div className="flex flex--column width-100">
                  <DateSelector
                    id="series_start"
                    name="series_start"
                    label="series start"
                    value={formatDateForInput(form.series_start)}
                    beforeDate={form.series_end}
                    onChange={this.handleDateInput}
                  />

                  <DateSelector
                    id="series_end"
                    name="series_end"
                    label="series end"
                    value={formatDateForInput(form.series_end)}
                    afterDate={form.series_start}
                    onChange={this.handleDateInput}
                  />

                  <SelectBox
                    id="series_type"
                    name="series_type"
                    text="series type"
                    value={form.series_type}
                    onChange={this.handleUserInput}
                    options={SERIES_TYPE_OPTIONS}
                  />

                  {type !== Strings.manga && (
                    <Tickbox
                      text="Force In Season"
                      id="legacyIsSeason"
                      name="_legacyIsSeason"
                      checked={form._legacyIsSeason || false}
                      onChange={this.handleUserInput}
                    />
                  )}
                </div>
              </Tabs.View>
            </Tabs.Container>
            <div className="button-group">
              <Button type="submit" btnStyle="primary">
                {this.props.isCreate ? Strings.create : Strings.edit}
              </Button>
              <ButtonisedNavLink
                link
                to={`${Paths.base}${Paths[type].list}${Enums.status.Ongoing}`}
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
  actions: PropTypes.shape({
    loadById: PropTypes.func.isRequired,
    create: PropTypes.func,
    edit: PropTypes.func
  }).isRequired,
  isCreate: PropTypes.bool.isRequired,
  itemId: PropTypes.number,
  item: PropTypes.object,
  isFetching: PropTypes.bool.isRequired,
  typeaheadTags: PropTypes.arrayOf(PropTypes.object),
  isAdult: PropTypes.bool.isRequired
};

function getInitalItem(entities, props) {
  const Model = itemModelForType(props.type);
  if (!props.itemId) {
    return Model();
  }

  const item = entities[props.type].byId[props.itemId];
  if (!item) {
    return;
  }

  return Model(item);
}

const mapStateToProps = (state, ownProps) => ({
  isFetching: state.isFetching,
  isCreate: !ownProps.itemId,
  item: getInitalItem(state.entities, ownProps),
  typeaheadTags: mapStateToEntityList(state.entities.tags),
  isAdult: state.isAdult
});

const mapDispatchToProps = {
  loadTags,
  showAlertError
};

export default connect(mapStateToProps, mapDispatchToProps)(BaseCreate);
