import PropTypes from 'prop-types';
import React from 'react';

import { formatDateForDisplay, padNumber } from 'utils';

function RepeatItem(props) {
  const isSingular = props.seriesTotalParts === 1;
  const showEndDate = !isSingular && !props.isCurrentRepeat;

  return (
    <li className="repeat-item">
      <div className="repeat-item__date-range">
        <div className="repeat-item__date">
          {formatDateForDisplay(props.startDate)} (#{padNumber(props.start, 3)})
        </div>
        {!isSingular && <span>-</span>}
        {props.isCurrentRepeat && (
          <div className="repeat-item__date">Present</div>
        )}
        {showEndDate && (
          <div className="repeat-item__date">
            {formatDateForDisplay(props.endDate)} (#{padNumber(props.end, 3)})
          </div>
        )}
      </div>
    </li>
  );
}

RepeatItem.propTypes = {
  repeatInstanceKey: PropTypes.string.isRequired,
  start: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  end: PropTypes.number.isRequired,
  endDate: PropTypes.string.isRequired,
  isCurrentRepeat: PropTypes.bool.isRequired,
  seriesTotalParts: PropTypes.number,
  timesCompleted: PropTypes.number
};

export default RepeatItem;
