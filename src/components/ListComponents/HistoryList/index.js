import PropTypes from 'prop-types';
import React from 'react';

import { ButtonisedNavLink } from 'components/Buttonised';
import Grid from 'components/Grid';
import HistoryListItem from './HistoryListItem';
import Paths from 'constants/paths';
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
      if (!!item.series && item.series.id !== previousSeries) {
        list.push(
          <li
            key={`${item.series.id}-${item.id}`}
            className="history-list-item series-title"
          >
            <ButtonisedNavLink
              to={`${Paths.base}${Paths[type].view}${item.series.id}`}
            >
              {item.series.title}
            </ButtonisedNavLink>
          </li>
        );
        previousSeries = item.series.id;
      }

      list.push(
        <HistoryListItem
          key={item.id}
          type={type}
          item={item}
          editAction={editAction}
          deleteAction={deleteAction}
        />
      );
    });

  return list;
}

const HistoryList = ({ type, editAction, deleteAction, ...props }) => {
  return (
    <Grid {...props}>
      {renderHistoryListItems(type, props.items, { editAction, deleteAction })}
    </Grid>
  );
};

HistoryList.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func
};

export default HistoryList;
