import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { List } from 'mko';
import './ItemList.scss';

function ItemList({ className, items, isFetching, ...props }) {
  const noItems = items.length === 0;
  const noDataNotFetching = !isFetching && noItems;
  const hasData = !!items.length;

  return (
    <List className={classNames('item-list', className)} columns={1} {...props}>
      {noDataNotFetching && (
        <li>
          {' '}
          <p>No items to display.</p>{' '}
        </li>
      )}
      {hasData && items}
    </List>
  );
}

ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default ItemList;
