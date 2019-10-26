import PropTypes from 'prop-types';
import classNames from 'classnames';
import React from 'react';

import Image from 'meiko/Image';

import './SeriesImageContainer.scss';

function SeriesImageContainer({
  containerStyle,
  isFull,
  fixedWidth,
  children,
  ...props
}) {
  return (
    <div
      style={containerStyle}
      className={classNames('series-image-container', {
        'series-image-container--full': isFull,
        'series-image-container--no-src': !props.src,
        'series-image-container--fixed-width': fixedWidth
      })}
    >
      <Image {...props} />
      {children}
    </div>
  );
}

SeriesImageContainer.defaultProps = {
  containerStyle: {},
  fixedWidth: false
};

SeriesImageContainer.propTypes = {
  isFull: PropTypes.bool,
  isLazy: PropTypes.bool,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  containerStyle: PropTypes.object,
  fixedWidth: PropTypes.bool
};

export default SeriesImageContainer;
