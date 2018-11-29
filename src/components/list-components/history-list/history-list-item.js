import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ClearableInput, Dialog, RatingControl, Utils } from 'meiko';
import { ButtonIcon } from 'components/buttonised';
import { padNumber, capitalise } from '../../../utils/common';
import { getUniquePropertiesForItemType } from '../../../utils/data';
import { Strings, Icons } from '../../../constants/values';

const { formatDateISO, formatDateTimeForDisplay } = Utils.Date.DateFormat;

class HistoryListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      note: props.item.note || '',
      rating: props.item.rating || 0
    };

    this.assignDialogRef = this.assignDialogRef.bind(this);
    this.showDeleteDialog = this.showDeleteDialog.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.confirmEdit = this.confirmEdit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  assignDialogRef(element) {
    this.deleteDialog = element;
  }

  showDeleteDialog() {
    this.deleteDialog.show();
  }

  confirmDelete() {
    this.props.deleteAction(this.props.item._id);
    this.deleteDialog.close();
  }

  toggleEdit() {
    this.setState((prev) => ({ isEditing: !prev.isEditing }));
  }

  confirmEdit() {
    const updateObject = Object.assign({}, this.props.item, {
      note: this.state.note,
      rating: Number(this.state.rating)
    });
    this.props.editAction(updateObject);
    this.toggleEdit();
  }

  handleUserInput(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const { item, type, editAction, deleteAction } = this.props;
    const { current } = getUniquePropertiesForItemType(type);
    const capitalisedCurrent = capitalise(current);
    const number = padNumber(item[current], 3);

    return (
      <li className="history-list-item">
        <time dateTime={formatDateISO(item.date)}>
          {formatDateTimeForDisplay(item.date)}
        </time>
        <div className="flex-column">
          <span>{`${capitalisedCurrent} ${number}`}</span>
          {!item.rating && !this.state.isEditing ? (
            <span>Unrated</span>
          ) : (
            <RatingControl
              name="rating"
              value={this.state.rating}
              onChange={this.state.isEditing ? this.handleUserInput : null}
            />
          )}
        </div>
        {!this.state.isEditing ? (
          <span>{item.note}</span>
        ) : (
          <ClearableInput
            name="note"
            label="note"
            maxLength={140}
            value={this.state.note}
            onChange={this.handleUserInput}
          />
        )}
        {(!!editAction || !!deleteAction) && (
          <div className="list-item-actions">
            {this.state.isEditing && (
              <ButtonIcon
                btnSize="small"
                title="Save entry"
                icon={Icons.save}
                onClick={this.confirmEdit}
              />
            )}
            {!!editAction && (
              <ButtonIcon
                name="isEditing"
                btnSize="small"
                title={this.state.isEditing ? 'Cancel edit' : 'Edit entry'}
                icon={this.state.isEditing ? Icons.cross : Icons.editable}
                onClick={this.toggleEdit}
              />
            )}
            {!!deleteAction &&
              !this.state.isEditing && (
                <span className="delete-action">
                  <ButtonIcon
                    btnSize="small"
                    title="Delete entry"
                    icon={Icons.cross}
                    onClick={this.showDeleteDialog}
                  />
                  <Dialog
                    name="historyDelete"
                    title={`Delete ${capitalisedCurrent} ${number}`}
                    localised="true"
                    getDialogRef={this.assignDialogRef}
                    actionText={Strings.delete}
                    action={this.confirmDelete}
                  >
                    <p>{Strings.deleteConfirmation}</p>
                  </Dialog>
                </span>
              )}
          </div>
        )}
      </li>
    );
  }
}

HistoryListItem.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func
};

export default HistoryListItem;
