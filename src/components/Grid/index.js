import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useRef } from 'react';

import { LoadingBouncer } from 'mko';

import Strings from 'constants/strings';
import { useProgressiveLoading } from 'hooks/useProgressiveLoading';
import { isString } from 'utils';

import './Grid.scss';

function Grid({
  containerClassName,
  className,
  items,
  noItemsText,
  children,
  isFetching,
  isPaged,
  onLoadMore,
  showCount,
  ...other
}) {
  const ref = useRef();
  useProgressiveLoading(ref, onLoadMore);

  const isFn = typeof children === 'function';
  const passedNothing = !items;
  const hasItems = !passedNothing && items.length > 0;
  const displayNoItemsText = !!noItemsText && !isFetching && !showCount;
  const noItemsTextToRender = isString(noItemsText)
    ? noItemsText
    : Strings.noItemsAvailable;

  return (
    <div className={classNames('progressive-grid', containerClassName)}>
      {!passedNothing && !hasItems && displayNoItemsText && (
        <div className="progressive-grid__no-items">{noItemsTextToRender}</div>
      )}
      {!passedNothing && showCount && (
        <div className="progressive-grid__count">
          Showing {items.length} item(s)
        </div>
      )}
      <ul
        ref={ref}
        className={classNames(
          'progressive-grid__grid',
          'progressive-grid__grid--erz',
          className
        )}
        {...other}
      >
        {hasItems && (isFn ? items.map(children) : children)}
      </ul>
      {isFetching && <LoadingBouncer />}
    </div>
  );
}

Grid.defaultProps = {
  noItemsText: true,
  showCount: false
};

Grid.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any),
  showCount: PropTypes.bool,
  noItemsText: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  children: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.arrayOf(PropTypes.node)
  ]).isRequired,
  isFetching: PropTypes.bool,
  onLoadMore: PropTypes.func
};

export default Grid;
