import PropTypes from 'prop-types';
import React, { Component } from 'react';

import ClearableInput from 'meiko/ClearableInput';
import Dialog from 'meiko/Dialog';
import RatingControl from 'meiko/RatingControl';
import { ButtonIcon } from 'components/Buttonised';
import HistoryNote from './HistoryNote';
import {
  padNumber,
  capitalise,
  formatDateISO,
  formatDateTimeForDisplay
} from 'utils';
import { getUniquePropertiesForItemType } from 'utils/data';
import { Strings, Icons } from 'constants/values';

function getEditButtonProps(isEditing) {
  return isEditing
    ? {
        'aria-label': 'Cancel edit',
        title: 'Cancel edit',
        icon: Icons.cross
      }
    : {
        'aria-label': 'Edit entry',
        title: 'Edit entry',
        icon: Icons.editable
      };
}

class HistoryListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isEditing: false,
      note: props.item.note || '',
      rating: props.item.rating || 0
    };

    this.showDeleteDialog = this.showDeleteDialog.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.confirmEdit = this.confirmEdit.bind(this);
    this.handleUserInput = this.handleUserInput.bind(this);
  }

  showDeleteDialog() {
    this.setState({ isOpen: true });
  }

  confirmDelete() {
    this.props.deleteAction(this.props.item.id);
    this.setState({ isOpen: false });
  }

  toggleEdit() {
    this.setState((prev) => ({ isEditing: !prev.isEditing }));
  }

  confirmEdit() {
    const { note, rating } = this.state;
    const updateObject = {
      ...this.props.item,
      note,
      rating: Number(rating)
    };

    this.props.editAction(updateObject);
    this.toggleEdit();
  }

  handleUserInput(event) {
    if (!this.state.isEditing) {
      return;
    }

    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  render() {
    const { isOpen, isEditing, rating, note } = this.state;
    const { item, type, editAction, deleteAction } = this.props;
    const { current } = getUniquePropertiesForItemType(type);

    const capitalisedCurrent = capitalise(current);
    const number = padNumber(item[current], 3);
    const canEdit = !!editAction;
    const canDelete = !!deleteAction;

    return (
      <li className="history-list-item">
        <time dateTime={formatDateISO(item.date)}>
          {formatDateTimeForDisplay(item.date)}
        </time>
        <div className="flex flex--column history-list-item__rating-block">
          <span>{`#${number}`}</span>
          {!item.rating && !isEditing ? (
            <span>Unrated</span>
          ) : (
            <RatingControl
              id={`rating-${item.id}`}
              name="rating"
              value={rating}
              onChange={this.handleUserInput}
            />
          )}
        </div>
        {!isEditing ? (
          <HistoryNote className="history-list-item__note" text={item.note} />
        ) : (
          <ClearableInput
            id={`note-${item.id}`}
            name="note"
            label="note"
            maxLength={140}
            value={note}
            onChange={this.handleUserInput}
          />
        )}
        {(canEdit || canDelete) && (
          <div className="history-list-item__actions">
            {isEditing && (
              <ButtonIcon
                btnSize="small"
                title="Save entry"
                icon={Icons.save}
                onClick={this.confirmEdit}
              />
            )}
            {canEdit && (
              <ButtonIcon
                name="isEditing"
                btnSize="small"
                onClick={this.toggleEdit}
                {...getEditButtonProps(isEditing)}
              />
            )}
            {canDelete && !isEditing && (
              <span className="delete-action">
                <ButtonIcon
                  btnSize="small"
                  aria-label="Delete entry"
                  title="Delete entry"
                  icon={Icons.cross}
                  onClick={this.showDeleteDialog}
                />
                <Dialog
                  isOpen={isOpen}
                  style={{ top: 0, left: `50%`, transform: `translateX(-90%)` }}
                  name={`historyItem-${item.id}-Delete`}
                  title={`Delete ${capitalisedCurrent} #${number}`}
                  actionText={Strings.delete}
                  onAction={this.confirmDelete}
                  onCancel={() => this.setState({ isOpen: false })}
                  tabTrapProps={{
                    firstId: `historyDelete-${item.id}-Action`,
                    lastId: `historyDelete-${item.id}-Cancel`
                  }}
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
