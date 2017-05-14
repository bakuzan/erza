import React, {PropTypes} from 'react'
import HistoryListItem from './history-list-item'
import './history-list.css'

const renderHistoryListItems = items => {
  let list = [], previousSeries = null;
  items.forEach(item => {
    if (item.series._id !== previousSeries) {
      list.push(<li key={`${item.series._id}-${item._id}`} className="history-list-item series-title">{item.series.title}</li>)
      previousSeries = item.series._id;
    }

    list.push(<HistoryListItem key={item._id} item={item} />)
  })
  return list;
}

const HistoryList = ({ items }) => (
  <ul className="list column one">
    {
      items.length === 0 ? (
        <li>
          <p>No items to display.</p>
        </li>
      ) :
      renderHistoryListItems(items)
    }
  </ul>
);

HistoryList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired
}

export default HistoryList
