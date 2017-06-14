import React, {Component, PropTypes} from 'react'
import RatingControl from '../../rating-control/rating-control';
import Dialog from '../../dialog/dialog';
import {padNumber, capitalise} from '../../../utils/common'
import {getUniquePropertiesForItemType} from '../../../utils/data'
import {formatDateISO, formatDateTimeForDisplay} from '../../../utils/date'
import {Strings, Icons} from '../../../constants/values'


class HistoryListItem extends Component {

  constructor() {
    super();

    this.assignDialogRef = this.assignDialogRef.bind(this);
    this.showDeleteDialog = this.showDeleteDialog.bind(this);
  }

  assignDialogRef(element) {
    this.deleteDialog = element;
  }

  showDeleteDialog() {
    this.deleteDialog.show();
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
          !!item.note &&
          <span>{item.note}</span>
        }
        {
            (!!editAction || !!deleteAction) &&
            <div className="list-item-actions">
            {
              !!editAction &&
              <button
                type="button"
                className="button-icon small"
                title="Edit entry"
                icon={Icons.editable}
                onClick={editAction}
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
                getDialogRef={this.assignDialogRef}
                actionText={Strings.delete}
                action={() => deleteAction(item._id)}
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
