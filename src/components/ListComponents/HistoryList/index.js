import PropTypes from 'prop-types';
import React from 'react';

import { ButtonisedNavLink } from 'components/Buttonised';
import Grid from 'components/Grid';
import HistoryListItem from './HistoryListItem';
import Paths from 'constants/paths';
import { Icons } from 'constants/values';
import { getHistoryNameForItemType } from 'utils/data';

import './HistoryList.scss';

const iconProps = {
  icon: Icons.clockwise,
  [`aria-label`]: 'Is Repeat',
  title: 'Is Repeat'
};

function HistoryList({ type, editAction, deleteAction, ...props }) {
  const attr = getHistoryNameForItemType(type);
  const titleUrlBase = `${Paths.base}${Paths[type].view}`;
  const items = props.items.sort((x, y) => {
    const z = y.date - x.date;
    return z === 0 ? y[attr] - x[attr] : z;
  });

  const { nodes } = items.reduce(
    ({ nodes, prevId, prevAttrValue }, item) => {
      const seriesId = item.series && item.series.id;
      const attrValue = item[attr];

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
            {item.isRepeat && <div className="history-repeat" {...iconProps} />}
          </li>
        ];
      } else if (attrValue > prevAttrValue) {
        nodes = [
          ...nodes,
          <li
            key={`${seriesId}-${item.id}-repeat-break`}
            className="history-list-item history-list-item--repeat-break"
          >
            <hr className="history-list-break" />
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

      return { nodes, prevId: seriesId, prevAttrValue: attrValue };
    },
    { nodes: [], prevId: null, prevAttrValue: null }
  );

  return <Grid {...props}>{nodes}</Grid>;
}

HistoryList.propTypes = {
  type: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func
};

export default HistoryList;
