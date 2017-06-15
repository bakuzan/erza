import React, {Component, PropTypes} from 'react'
import RatingControl from '../../rating-control/rating-control';
import Dialog from '../../dialog/dialog';
import ClearableInput from '../../clearable-input/clearable-input';
import {padNumber, capitalise} from '../../../utils/common'
import {getUniquePropertiesForItemType} from '../../../utils/data'
import {formatDateISO, formatDateTimeForDisplay} from '../../../utils/date'
import {Strings, Icons} from '../../../constants/values'


class HistoryListItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      note: props.note
    }

    this.assignDialogRef = this.assignDialogRef.bind(this);
    this.showDeleteDialog = this.showDeleteDialog.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
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
    this.setState(prev => ({ isEditing: !prev.isEditing }));
  }

  confirmEdit() {
    this.props.editAction(this.props.item._id, this.state.note);
    this.toggleEdit();
  }

  handleUserInput(event) {
    this.setState({ note: event.target.value });
  }

  render() {
    const { item, type, editAction, deleteAction } = this.props;
    const {current} = getUniquePropertiesForItemType(type);
    const capitalisedCurrent = capitalise(current);
    const number = padNumber(item[current], 3);

    return (
      <li className="history-list-item">
        <time dateTime={formatDateISO(item.date)}>{ formatDateTimeForDisplay(item.date) }</time>
        <div className="flex-column">
          <span>{ `${capitalisedCurrent} ${number}` }</span>
          {
            !item.rating
            ? ( <span>Unrated</span> )
            : (
                <RatingControl
                  name="rating"
                  value={item.rating}
                />
              )
          }
        </div>
        {
          !this.state.isEditing
          ? ( <span>{ item.note }</span> )
          : (
              <ClearableInput
                name="note"
                search={this.state.note}
                onChange={this.handleUserInput}
              />
            )
        }
        {
            (!!editAction || !!deleteAction) &&
            <div className="list-item-actions">
            {
              this.state.isEditing &&
              <button
                type="button"
                className="button-icon small"
                title="Save entry"
                icon={Icons.editable}
                onClick={this.confirmEdit}
              ></button>
            }
            {
              !!editAction &&
              <button
                type="button"
                name="isEditing"
                className="button-icon small"
                title="Edit entry"
                icon={Icons.editable}
                onClick={this.toggleEdit}
              ></button>
            }
            {
              !!deleteAction &&
              <span className="delete-action">
                <button
                  type="button"
                  className="button-icon small"
                  title="Delete entry"
                  icon={Icons.cross}
                  onClick={this.showDeleteDialog}
                ></button>
              <Dialog
                name="historyDelete"
                title={`Delete ${capitalisedCurrent} ${number}`}
                localised="true"
                getDialogRef={this.assignDialogRef}
                actionText={Strings.delete}
                action={this.confirmDelete}
                >
                  <p>{ Strings.deleteConfirmation }</p>
                </Dialog>
              </span>
            }
            </div>
        }
      </li>
    )
  }
}

HistoryListItem.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func
}

export default HistoryListItem
