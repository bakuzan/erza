import React, {PropTypes} from 'react'
import RatingControl from '../rating-control/rating-control';
import {formatDateForDisplay, padNumber} from '../../utils/common'

const HistoryList = ({ items }) => (
  <ul className="history-list">
    {
      items.length === 0 ? (
        <li>
          <p>No items to display.</p>
        </li>
      ) :
      items.map(item => (
        <li key={item._id}>
          <time dateTime={formatDateISO(item.date)}>{ formatDateForDisplay(item.date) }</time>
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
          {
            !!item.note &&
            <span>{item.note}</span>
          }
        </li>
      ))
    }
  </ul>
);

HistoryList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default HistoryList
