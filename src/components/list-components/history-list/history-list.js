import React, {PropTypes} from 'react'
import HistoryListItem from './history-list-item'
import {getHistoryNameForItemType} from '../../../utils/data'
import './history-list.css'

const renderHistoryListItems = (type, items, { editAction, deleteAction }) => {
  const valueProperty = getHistoryNameForItemType(type);
  let list = [], previousSeries = null;
  items.sort((x, y) => {
    const z = y.date - x.date;
    return z === 0 ? y[valueProperty] - x[valueProperty] : z;
  })
  .forEach(item => {
    if (!!item.series && item.series._id !== previousSeries) {
      list.push(<li key={`${item.series._id}-${item._id}`} className="history-list-item series-title">{item.series.title}</li>)
      previousSeries = item.series._id;
    }

    list.push(
      <HistoryListItem
        key={item._id}
        type={type}
        item={item}
        editAction={editAction}
        deleteAction={deleteAction}
      />
    )
  })
  return list;
}

const HistoryList = ({ items, type, editAction, deleteAction }) => (
  <ul className="list column one">
    {
      items.length === 0
      ? ( <li> <p>No items to display.</p> </li> )
      : renderHistoryListItems(type, items, { editAction, deleteAction })
    }
  </ul>
);

HistoryList.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func
}

export default HistoryList
