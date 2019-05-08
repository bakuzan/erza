import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { Image } from 'mko';

import './SeriesImageContainer.scss';

function SeriesImageContainer({ isFull, children, ...props }) {
  return (
    <div
      className={classNames('series-image-container', {
        'series-image-container--full': isFull
      })}
    >
      <Image {...props} />
      {children}
    </div>
  );
}

SeriesImageContainer.propTypes = {
  isFull: PropTypes.bool,
  isLazy: PropTypes.bool,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

export default SeriesImageContainer;
