import PropTypes from 'prop-types';
import React from 'react';

import { Button } from 'meiko/Button';

import { zoom } from './utils/consts';

import './ZoomControls.scss';

function ZoomControls({ level, setLevel }) {
  const zoomText = `Showing ${level} month${level > 1 ? 's' : ''}`;

  return (
    <div className="zoom-controls">
      <Button
        className="zoom-controls__button"
        btnStyle="accent"
        icon={'-'}
        aria-label="Zoom out"
        title="Zoom out"
        disabled={level === zoom.MAX_DIVISOR}
        onClick={() => setLevel((p) => p + 1)}
      />
      <div className="zoom-controls__text">{zoomText}</div>
      <Button
        className="zoom-controls__button"
        btnStyle="accent"
        icon={'+'}
        aria-label="Zoom in"
        title="Zoom in"
        disabled={level === zoom.MIN_DIVISOR}
        onClick={() => setLevel((p) => p - 1)}
      />
    </div>
  );
}

ZoomControls.propTypes = {
  level: PropTypes.number.isRequired,
  setLevel: PropTypes.func.isRequired
};

export default ZoomControls;
