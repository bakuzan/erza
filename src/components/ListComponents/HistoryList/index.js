import PropTypes from 'prop-types';
import React from 'react';

import { ButtonisedNavLink } from 'components/Buttonised';
import Grid from 'components/Grid';
import HistoryListItem from './HistoryListItem';
import Paths from 'constants/paths';
import { getHistoryNameForItemType } from 'utils/data';

import './HistoryList.scss';

function HistoryList({ type, editAction, deleteAction, ...props }) {
  const attr = getHistoryNameForItemType(type);
  const titleUrlBase = `${Paths.base}${Paths[type].view}`;
  const items = props.items.sort((x, y) => {
    const z = y.date - x.date;
    return z === 0 ? y[attr] - x[attr] : z;
  });

  const { nodes } = items.reduce(
    ({ nodes, prevId }, item) => {
      const seriesId = item.series && item.series.id;
      if (seriesId && seriesId !== prevId) {
        nodes = [
          ...nodes,
          <li
            key={`${seriesId}-${item.id}`}
            className="history-list-item series-title"
          >
            <ButtonisedNavLink to={`${titleUrlBase}${seriesId}`}>
              {item.series.title}
            </ButtonisedNavLink>
          </li>
        ];
      }

      nodes = [
        ...nodes,
        <HistoryListItem
          key={item.id}
          type={type}
          item={item}
          editAction={editAction}
          deleteAction={deleteAction}
        />
      ];

      return { nodes, prevId: seriesId };
    },
    { nodes: [], prevId: null }
  );

  console.log('RENDER HISTORY');

  return <Grid {...props}>{nodes}</Grid>;
}

HistoryList.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func
};

export default HistoryList;
