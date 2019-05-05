import PropTypes from 'prop-types';
import React from 'react';

import { Portal, Form, ClearableInput, RatingControl, List } from 'mko';
import { Strings } from 'constants/values';
import { getEventValue, updateNestedProperty, objectsAreEqual } from 'utils';
import { getUniquePropertiesForItemType } from 'utils/data';

import './QuickAdd.scss';

const getInitialState = (current, originalItem = {}) => ({
  originalItem,
  editItem: {
    id: null,
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

  static getDerivedStateFromProps(nextProps, prevState) {
    const originalItemIsUnchanged = objectsAreEqual(
      nextProps.originalItem,
      prevState.originalItem
    );

    if (originalItemIsUnchanged) {
      return null;
    }

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
      (originalItemHasChanged && prevProps.originalItem.hasOwnProperty('id')) ||
      (!this.state.editItem.id && this.props.originalItem.id)
    ) {
      this.onOpenEdit();
    }

    if (this.props.isOpen && !prevProps.isOpen) {
      document.body.style = 'overflow: hidden';
    } else if (!this.props.isOpen && prevProps.isOpen) {
      document.body.style = '';
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

    this.setState({
      ...defaults,
      originalItem,
      editItem: {
        ...defaults.editItem,
        id: originalItem.id,
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
        message: Strings.malFetchDisabled
      }
    });
  }

  handleFormSubmit() {
    const { editItem } = this.state;
    this.props.onSubmit(editItem);
    this.resetState();
  }

  render() {
    const { editItem, malUpdates } = this.state;
    const { type, originalItem, onClose } = this.props;

    const {
      status: malStatus,
      message: malMessage,
      values: malValues
    } = malUpdates;
    const { current } = this.itemProperties;
    const currentPlural = `${current}s`;

    const editItemCurrent = editItem[current];
    const malItemCurrent = malValues && malValues[currentPlural];

    const isManga = type === Strings.manga;
    const limitByTotalVolume = !isManga
      ? 0
      : editItem.maxVol
      ? editItem.maxVol
      : malValues && !!malValues.series_volumes
      ? malValues.series_volumes
      : null;

    const limitByTotal = editItem.max ? editItem.max : malItemCurrent || null;

    const showSeriesOverallRating =
      editItemCurrent > 0 &&
      (!!malValues
        ? editItemCurrent === malItemCurrent
        : editItemCurrent === editItem.max);

    const quickAddEntries = Array(editItemCurrent - editItem.min).fill(null);

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
            className="quick-add-form"
            name={`${type}Edit`}
            title={`Edit ${originalItem.title}`}
            submitOptions={submitOptions}
            cancelOptions={cancelOptions}
          >
            <div className="paged-list-edit">
              <span className={`mal-update-message ${malStatus}`}>
                {malMessage}
              </span>
              {!!editItem.id && (
                <div>
                  <div className="updated-item-values-container">
                    <ClearableInput
                      type="number"
                      name={current}
                      id={`${current}`}
                      label={current}
                      value={editItemCurrent}
                      min={editItem.min}
                      max={limitByTotal}
                      onChange={this.handleUserInput}
                    />
                    {isManga && (
                      <ClearableInput
                        type="number"
                        id="volume"
                        name="volume"
                        label="volume"
                        value={editItem.volume}
                        min={editItem.minVol}
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
                      value={editItem.overallRating || 0}
                      onChange={this.handleUserInput}
                    />
                  )}
                  <List columns={1}>
                    {quickAddEntries.map((item, index) => {
                      const historyNumber = editItem.min + 1 + index;
                      const ratingId = `ratings.${historyNumber}`;
                      const noteId = `notes.${historyNumber}`;

                      return (
                        <li key={index} className="flex flex--row">
                          <RatingControl
                            id={ratingId}
                            name={ratingId}
                            label={`rating for ${current} ${historyNumber}`}
                            value={editItem.ratings[historyNumber] || 0}
                            onChange={this.handleUserInput}
                          />
                          <ClearableInput
                            id={noteId}
                            name={noteId}
                            label={`note for ${historyNumber}`}
                            value={editItem.notes[historyNumber] || ''}
                            maxLength={140}
                            onChange={this.handleUserInput}
                          />
                        </li>
                      );
                    })}
                  </List>
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
