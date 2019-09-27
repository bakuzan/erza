import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import { Image } from 'mko';

import './SeriesImageContainer.scss';

function SeriesImageContainer({ containerStyle, isFull, children, ...props }) {
  return (
    <div
      style={containerStyle}
      className={classNames('series-image-container', {
        'series-image-container--full': isFull,
        'series-image-container--no-src': !props.src
      })}
    >
      <Image {...props} />
      {children}
    </div>
  );
}

SeriesImageContainer.defaultProps = {
  containerStyle: {}
};

SeriesImageContainer.propTypes = {
  isFull: PropTypes.bool,
  isLazy: PropTypes.bool,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  containerStyle: PropTypes.object
};

export default SeriesImageContainer;
