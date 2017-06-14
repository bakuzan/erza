import React, {PropTypes} from 'react'
import RatingControl from '../../rating-control/rating-control';
import {padNumber} from '../../../utils/common'
import {getUniquePropertiesForItemType} from '../../../utils/data'
import {formatDateISO, formatDateTimeForDisplay} from '../../../utils/date'
import {Icons} from '../../../constants/values'

const HistoryListItem = ({ item, type }) => {
  const {current} = getUniquePropertiesForItemType(type);
  return (
    <li className="history-list-item">
      <time dateTime={formatDateISO(item.date)}>{ formatDateTimeForDisplay(item.date) }</time>
      <div className="flex-column">
        <span>Episode {padNumber(item[current], 3)}</span>
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
              icon={Icons.editable}
              onClick={editAction}
            ></button>
          }
          {
            !!deleteAction &&
            <button 
              type="button"
              className="button-icon small"
              icon={Icon.cross}
              onClick={deleteAction}
            ></button>
          }
          </div>
      }
    </li>
  )
}

HistoryListItem.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired
}

export default HistoryListItem
