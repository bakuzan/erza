import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import './item-list.css';

const ItemList = ({ className, items, isFetching }) => {
  const noItems = items.length === 0;
  const noDataNotFetching = !isFetching && noItems;
  const hasData = !!items.length;
  return (
    <ul className={classNames('item-list', className)}>
      {noDataNotFetching && (
        <li>
          {' '}
          <p>No items to display.</p>{' '}
        </li>
      )}
      {hasData && items}
    </ul>
  );
};

ItemList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default ItemList;
