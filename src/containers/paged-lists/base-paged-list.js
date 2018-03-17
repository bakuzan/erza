import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import fetchFromServer from '../../graphql/fetch';
import PagingControls from '../../containers/paging-controls/paging-controls';
import Dialog from '../../components/dialog/dialog';
import ClearableInput from '../../components/clearable-input/clearable-input';
import RatingControl from '../../components/rating-control/rating-control';
import { Paths } from '../../constants/paths';
import { Strings } from '../../constants/values';
import {
  capitalise,
  getEventValue,
  updateNestedProperty
} from '../../utils/common';
import {
  shouldIntergrateMalEntry,
  getUniquePropertiesForItemType
} from '../../utils/data';

import '../../components/inline-item-edit/inline-item-edit.css';

const EMPTY_OBJECT = {};
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

class BasePagedList extends Component {
  constructor(props) {
    super(props);
    this.itemProperties = getUniquePropertiesForItemType(props.type);
    this.getMalEntry = fetchMalEntry(props.type);
    this.state = {
      ...getInitialState(this.itemProperties.current)
    };

    this.openEditDialog = this.openEditDialog.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
    this.assignDialogRef = this.assignDialogRef.bind(this);
  }

  componentDidMount() {
    this.shouldHydrateMal = shouldIntergrateMalEntry(this.props.type);
  }

  openEditDialog(_id) {
    const { current, total } = this.itemProperties;
    const editItem = this.props.items.find(x => x._id === _id);
    const defaults = getInitialState(this.itemProperties.current);
    if (editItem.malId) this.refreshMalValues(editItem);
    this.setState({
      ...defaults,
      editItem: {
        ...defaults.editItem,
        _id,
        [current]: editItem[current] || 0,
        min: editItem[current] || 0,
        max: editItem[total] || null,
        overallRating: editItem.rating
      },
      malUpdates: {
        ...defaults.malUpdates,
        values: null,
        message: editItem.malId
          ? Strings.fetchingMalEntry
          : Strings.noLinkedMalEntry,
        status: editItem.malId ? Strings.loading : ''
      }
    });
    this.dialog.showModal();
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

  handleEdit(event) {
    this.props.addHistoryToItem(this.state);
    if (this.dialog.open) this.dialog.close();
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

  assignDialogRef(element) {
    this.dialog = element;
  }

  render() {
    const { type, filters, list, items } = this.props;
    const PagedList = list;
    const { current } = this.itemProperties;
    const editItem =
      items.find(x => x._id === this.state.editItem._id) || EMPTY_OBJECT;
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

    const dynamicListProps = {
      [`add${capitalise(current)}`]: this.openEditDialog
    };

    return (
      <div className="flex-column flex-grow">
        <PagingControls listType={type} filters={filters} />
        <PagedList items={items} {...dynamicListProps} />
        <Dialog
          name={`${type}Edit`}
          title={`Edit ${editItem.title}`}
          getDialogRef={this.assignDialogRef}
          actionText={Strings.edit}
          action={this.handleEdit}
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
                    Array(
                      this.state.editItem[current] - this.state.editItem.min
                    )
                      .fill(null)
                      .map((item, index) => {
                        const historyNumber =
                          this.state.editItem.min + 1 + index;
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
      </div>
    );
  }
}

BasePagedList.propTypes = {
  type: PropTypes.string.isRequired,
  list: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filters: PropTypes.object,
  paging: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ paging: state.paging });

export default connect(mapStateToProps)(BasePagedList);
