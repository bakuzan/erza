import React, {PropTypes} from 'react'
import RatingControl from '../rating-control/rating-control';
import {formatDateISO, formatDateForDisplay, padNumber} from '../../utils/common'

const HistoryListItem = ({ item }) => (
  <li className="history-list-item">
    <time dateTime={formatDateISO(item.date)}>{ formatDateForDisplay(item.date) }</time>
    <div className="flex-column">
      <span>Episode {padNumber(item.episode, 3)}</span>
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
  </li>
)

HistoryListItem.propTypes = {
  item: PropTypes.object.isRequired
}

export default HistoryListItem
