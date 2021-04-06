import PropTypes from 'prop-types';
import React from 'react';

import { capitalise } from 'utils';

import './HistoryAverages.scss';

const niceNumber = (num) => (Math.round(num * 100) / 100).toFixed(2);

function HistoryAverages({ data, scores }) {
  if (!data) {
    return null;
  }

  const averageKeys = Object.keys(data);
  const gridTemplateColumns = Array(averageKeys.length).fill('1fr').join(' ');

  return (
    <div className="history-averages">
      <div className="history-averages__title">
        Rating averages of the original run through
      </div>
      <div className="history-averages__data" style={{ gridTemplateColumns }}>
        {averageKeys.map((name) => (
          <div key={name} className="history-averages__average">
            <div>{capitalise(name)}</div>
            <div>{niceNumber(data[name])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

HistoryAverages.propTypes = {
  data: PropTypes.shape({
    mean: PropTypes.number,
    median: PropTypes.number,
    mode: PropTypes.number
  })
};

export default HistoryAverages;
