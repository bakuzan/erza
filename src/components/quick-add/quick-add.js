import PropTypes from 'prop-types';
import React from 'react';

import fetchFromServer from '../../graphql/fetch';
import { Portal, Form, ClearableInput, RatingControl } from 'meiko';

import { Paths } from '../../constants/paths';
import { Strings } from '../../constants/values';
import {
  getEventValue,
  updateNestedProperty,
  objectsAreEqual
} from '../../utils/common';
import {
  shouldIntergrateMalEntry,
  getUniquePropertiesForItemType
} from '../../utils/data';

import './quick-add.scss';

const fetchMalEntry = (type) => (search) =>
  fetchFromServer(Paths.build(Paths.malSearch, { type, search }));

const getInitialState = (current, originalItem = {}) => ({
  originalItem,
  editItem: {
    _id: null,
    [current]: 0,
    min: 0,
    max: null,
    overallRating: 0,
    ratings: {},
    notes: {}
  },
  malUpdates: {
    values: null,
    message: null,
    status: ''
  }
});

class QuickAdd extends React.Component {
  constructor(props) {
    super(props);
    this.itemProperties = getUniquePropertiesForItemType(props.type);
    this.state = {
      ...getInitialState(this.itemProperties.current, props.originalItem)
    };

    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentDidMount() {
    this.getMalEntry = fetchMalEntry(this.props.type);
    this.shouldHydrateMal = shouldIntergrateMalEntry(this.props.type);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const originalItemIsUnchanged = objectsAreEqual(
      nextProps.originalItem,
      prevState.originalItem
    );

    if (originalItemIsUnchanged) return null;
    return {
      originalItem: nextProps.originalItem
    };
  }

  componentDidUpdate(prevProps) {
    const openStateHasChanged = prevProps.isOpen !== this.props.isOpen;
    if (openStateHasChanged && this.props.isOpen) {
      this.props.loadItemById(this.props);
    }

    const originalItemHasChanged = !objectsAreEqual(
      this.props.originalItem,
      prevProps.originalItem
    );
    if (
      originalItemHasChanged &&
      prevProps.originalItem.hasOwnProperty('_id')
    ) {
      this.onOpenEdit();
    }
  }

  resetState() {
    this.setState({
      ...getInitialState(this.itemProperties.current)
    });
  }

  handleUserInput(event) {
    const target = event.target;
    const newValue = getEventValue(target);
    const updateEditValues = updateNestedProperty(
      this.state.editItem,
      target.name,
      newValue
    );
    this.setState({ editItem: updateEditValues });
  }

  onOpenEdit() {
    const { originalItem, type } = this.props;
    const isManga = type === Strings.manga;
    const { current, total } = this.itemProperties;
    const defaults = getInitialState(this.itemProperties.current, originalItem);
    if (originalItem.malId) this.refreshMalValues(originalItem);
    this.setState({
      ...defaults,
      originalItem,
      editItem: {
        ...defaults.editItem,
        _id: originalItem._id,
        [current]: originalItem[current] || 0,
        min: originalItem[current] || 0,
        max: originalItem[total] || null,
        volume: isManga ? originalItem.volume || 0 : undefined,
        minVol: isManga ? originalItem.volume || 0 : undefined,
        maxVol: isManga ? originalItem.series_volumes || null : undefined,
        overallRating: originalItem.rating
      },
      malUpdates: {
        ...defaults.malUpdates,
        values: null,
        message: originalItem.malId
          ? Strings.fetchingMalEntry
          : Strings.noLinkedMalEntry,
        status: originalItem.malId ? Strings.loading : ''
      }
    });
  }

  refreshMalValues(editItem) {
    this.getMalEntry(editItem.title)
      .then((response) => {
        if (response.error) throw response.error;
        const malItem = response.find((x) => x.id === editItem.malId);
        const shouldUpdateMalEntry =
          this.shouldHydrateMal(editItem, malItem) && !!malItem;
        this.setState({
          malUpdates: {
            values: malItem,
            message: shouldUpdateMalEntry
              ? Strings.updatedMalEntry
              : Strings.malEntryUpToDate,
            status: shouldUpdateMalEntry ? Strings.success : ''
          }
        });
      })
      .catch((error) => {
        this.setState({
          malUpdates: {
            values: null,
            message: Strings.failedMalUpdate,
            status: Strings.error
          }
        });
      });
  }

  handleFormSubmit() {
    const values = { ...this.state };
    this.props.onSubmit(values);
    this.resetState();
  }

  render() {
    const { type, originalItem, onClose } = this.props;
    const { current } = this.itemProperties;

    const isManga = type === Strings.manga;
    const limitByTotalVolume = !isManga
      ? 0
      : this.state.editItem.maxVol
      ? this.state.editItem.maxVol
      : this.state.malUpdates.values &&
        !!this.state.malUpdates.values.series_volumes
      ? this.state.malUpdates.values.series_volumes
      : null;

    const limitByTotal = this.state.editItem.max
      ? this.state.editItem.max
      : this.state.malUpdates.values &&
        !!this.state.malUpdates.values[`${current}s`]
      ? this.state.malUpdates.values[`${current}s`]
      : null;

    const showSeriesOverallRating =
      this.state.editItem[current] > 0 &&
      (!!this.state.malUpdates.values
        ? this.state.editItem[current] ===
          this.state.malUpdates.values[`${current}s`]
        : this.state.editItem[current] === this.state.editItem.max);

    const submitOptions = {
      text: Strings.edit,
      onSubmit: this.handleFormSubmit
    };
    const cancelOptions = {
      onCancel: onClose
    };

    return (
      <Portal querySelector="main">
        {this.props.isOpen && (
          <Form
            id="quick-add-form"
            className="themed-background"
            name={`${type}Edit`}
            title={`Edit ${originalItem.title}`}
            submitOptions={submitOptions}
            cancelOptions={cancelOptions}
          >
            <div className="paged-list-edit">
              <span
                className={`mal-update-message ${this.state.malUpdates.status}`}
              >
                {this.state.malUpdates.message}
              </span>
              {!!this.state.editItem._id && (
                <div>
                  <div className="updated-item-values-container">
                    <ClearableInput
                      type="number"
                      name={current}
                      id={`${current}`}
                      label={current}
                      value={this.state.editItem[current]}
                      min={this.state.editItem.min}
                      max={limitByTotal}
                      onChange={this.handleUserInput}
                    />
                    {isManga && (
                      <ClearableInput
                        type="number"
                        id="volume"
                        name="volume"
                        label="volume"
                        value={this.state.editItem.volume}
                        min={this.state.editItem.minVol}
                        max={limitByTotalVolume}
                        onChange={this.handleUserInput}
                      />
                    )}
                  </div>
                  {showSeriesOverallRating && (
                    <RatingControl
                      id="overallRating"
                      name="overallRating"
                      label="Rating"
                      value={this.state.editItem.overallRating || 0}
                      onChange={this.handleUserInput}
                    />
                  )}
                  <ul className="list column one">
                    {!!this.state.editItem[current] &&
                      Array(
                        this.state.editItem[current] - this.state.editItem.min
                      )
                        .fill(null)
                        .map((item, index) => {
                          const historyNumber =
                            this.state.editItem.min + 1 + index;
                          const ratingId = `ratings.${historyNumber}`;
                          const noteId = `notes.${historyNumber}`;

                          return (
                            <li key={index} className="flex-row">
                              <RatingControl
                                id={ratingId}
                                name={ratingId}
                                label={`rating for ${current} ${historyNumber}`}
                                value={
                                  this.state.editItem.ratings[historyNumber] ||
                                  0
                                }
                                onChange={this.handleUserInput}
                              />
                              <ClearableInput
                                id={noteId}
                                name={noteId}
                                label={`note for ${historyNumber}`}
                                value={
                                  this.state.editItem.notes[historyNumber] || ''
                                }
                                maxLength={140}
                                onChange={this.handleUserInput}
                              />
                            </li>
                          );
                        })}
                  </ul>
                </div>
              )}
            </div>
          </Form>
        )}
      </Portal>
    );
  }
}

QuickAdd.propTypes = {
  type: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  originalItem: PropTypes.object,
  loadItemById: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default QuickAdd;
