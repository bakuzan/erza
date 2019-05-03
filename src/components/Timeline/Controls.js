import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';

import { Button } from 'components/Buttonised';
import { Icons } from 'constants/values';

import { MOVE_VIEW_DATE, UPDATE_VIEW_DATE } from './reducer';
import { BASE_BUTTON_SIZE } from './utils/consts';
import generateDatesForRange from './utils/generateDatesForRange';
import { TimelineDispatcherContext } from './utils/context';

function Controls({ dateRange }) {
  const dispatch = useContext(TimelineDispatcherContext);
  const buttonWidthStyle = { width: `${BASE_BUTTON_SIZE}px` };

  const [from, to] = dateRange;
  const dates = useMemo(() => generateDatesForRange(from, to), [from, to]);

  console.log('CONTROLS > ', dates);

  return (
    <div className={classNames('timeline-controls')}>
      <Button
        className="timeline-controls__button"
        style={buttonWidthStyle}
        icon={Icons.left}
        onClick={() => dispatch({ type: MOVE_VIEW_DATE, value: -1 })}
      />
      {dates.map((x) => {
        return (
          <Button
            key={x.value}
            className="timeline-controls__button"
            style={buttonWidthStyle}
            onClick={() => dispatch({ type: UPDATE_VIEW_DATE, value: x.value })}
          >
            {x.display}
          </Button>
        );
      })}
      <Button
        className="timeline-controls__button"
        style={buttonWidthStyle}
        icon={Icons.right}
        onClick={() => dispatch({ type: MOVE_VIEW_DATE, value: 1 })}
      />
    </div>
  );
}

Controls.displayName = 'TimelineControls';
Controls.propTypes = {
  dateRange: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  )
};
export default Controls;
