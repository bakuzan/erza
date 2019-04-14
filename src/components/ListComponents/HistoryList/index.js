import PropTypes from 'prop-types';
import React from 'react';

import { LoadingBouncer, List } from 'mko';
import { ButtonisedNavLink } from 'components/Buttonised';
import HistoryListItem from './HistoryListItem';
import { Paths } from 'constants/paths';
import { getHistoryNameForItemType } from 'utils/data';

import './HistoryList.scss';

function renderHistoryListItems(type, items, { editAction, deleteAction }) {
  const valueProperty = getHistoryNameForItemType(type);
  let list = [],
    previousSeries = null;

  items
    .sort((x, y) => {
      const z = y.date - x.date;
      return z === 0 ? y[valueProperty] - x[valueProperty] : z;
    })
    .forEach((item) => {
      if (!!item.series && item.series._id !== previousSeries) {
        list.push(
          <li
            key={`${item.series._id}-${item._id}`}
            className="history-list-item series-title"
          >
            <ButtonisedNavLink
              to={`${Paths.base}${Paths[type].view}${item.series._id}`}
            >
              {item.series.title}
            </ButtonisedNavLink>
          </li>
        );
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
      );
    });

  return list;
}

const HistoryList = ({ isFetching, items, type, editAction, deleteAction }) => {
  const noItems = items.length === 0;
  const noDataButFetching = isFetching && noItems;
  const noDataNotFetching = !isFetching && noItems;
  const hasData = !!items.length;
  return (
    <List columns={1}>
      {noDataButFetching && <LoadingBouncer />}
      {noDataNotFetching && (
        <li>
          {' '}
          <p>No items to display.</p>{' '}
        </li>
      )}
      {hasData &&
        renderHistoryListItems(type, items, { editAction, deleteAction })}
    </List>
  );
};

HistoryList.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func
};

export default HistoryList;
