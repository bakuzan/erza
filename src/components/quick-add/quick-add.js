import PropTypes from 'prop-types';
import React from 'react';

import fetchFromServer from '../../graphql/fetch';
import Dialog from '../../components/dialog/dialog';
import ClearableInput from '../../components/clearable-input/clearable-input';
import RatingControl from '../../components/rating-control/rating-control';
import { Paths } from '../../constants/paths';
import { Strings } from '../../constants/values';
import { getEventValue, updateNestedProperty } from '../../utils/common';
import {
  shouldIntergrateMalEntry,
  getUniquePropertiesForItemType
} from '../../utils/data';

import './quick-add.css';

const fetchMalEntry = type => search =>
  fetchFromServer(Paths.build(Paths.malSearch, { type, search }));

const getInitialState = current => ({
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
    this.state = { ...getInitialState(this.itemProperties.current) };

    this.assignDialogRef = this.assignDialogRef.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  componentDidMount() {
    this.getMalEntry = fetchMalEntry(this.props.type);
    this.shouldHydrateMal = shouldIntergrateMalEntry(this.props.type);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isOpen === this.props.isOpen) return;

    if (this.props.isOpen) {
      this.onOpenEditDialog();
      this.dialog.showModal();
    } else {
      this.dialog.close();
    }
  }

  assignDialogRef(el) {
    this.dialog = el;
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

  onOpenEditDialog() {
    const { originalItem } = this.props;
    const { current, total } = this.itemProperties;
    const defaults = getInitialState(this.itemProperties.current);
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
      .then(response => {
        if (response.error) throw response.error;
        const malItem = response.find(x => x.id === editItem.malId);
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
      .catch(error => {
        this.setState({
          malUpdates: {
            values: null,
            message: Strings.failedMalUpdate,
            status: Strings.error
          }
        });
      });
  }

  render() {
    const { type, originalItem, onSubmit } = this.props;
    const { current } = this.itemProperties;

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

    return (
      <Dialog
        name={`${type}Edit`}
        title={`Edit ${originalItem.title}`}
        getDialogRef={this.assignDialogRef}
        actionText={Strings.edit}
        action={onSubmit}
      >
        <div className="paged-list-edit">
          <span
            className={`mal-update-message ${this.state.malUpdates.status}`}
          >
            {this.state.malUpdates.message}
          </span>
          {!!this.state.editItem._id && (
            <div>
              <div className="has-float-label input-container">
                <input
                  type="number"
                  name={current}
                  value={this.state.editItem[current]}
                  min={this.state.editItem.min}
                  max={limitByTotal}
                  placeholder=" "
                  onChange={this.handleUserInput}
                />
                <label>{current}</label>
              </div>
              {showSeriesOverallRating && (
                <RatingControl
                  name="overallRating"
                  label="Rating"
                  value={this.state.editItem.overallRating || 0}
                  onChange={this.handleUserInput}
                />
              )}
              <ul className="list column one">
                {!!this.state.editItem[current] &&
                  Array(this.state.editItem[current] - this.state.editItem.min)
                    .fill(null)
                    .map((item, index) => {
                      const historyNumber = this.state.editItem.min + 1 + index;
                      return (
                        <li key={index} className="flex-row">
                          <RatingControl
                            name={`ratings.${historyNumber}`}
                            label={`rating for ${current} ${historyNumber}`}
                            value={
                              this.state.editItem.ratings[historyNumber] || 0
                            }
                            onChange={this.handleUserInput}
                          />
                          <ClearableInput
                            name={`notes.${historyNumber}`}
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
      </Dialog>
    );
  }
}

QuickAdd.propTypes = {
  type: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  originalItem: PropTypes.object,
  onSubmit: PropTypes.func.isRequired
};

export default QuickAdd;
