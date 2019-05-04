import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';

import { Button } from 'components/Buttonised';
import { Icons } from 'constants/values';

import { MOVE_VIEW_DATE, UPDATE_VIEW_DATE } from './reducer';
import { ARROW_BUTTON_SIZE } from './utils/consts';
import { TimelineDispatcherContext } from './utils/context';
import generateDatesForRange from './utils/generateDatesForRange';

import './Controls.scss';

const arrowWidthStyle = {
  width: `${ARROW_BUTTON_SIZE}px`,
  flex: `1 0 ${ARROW_BUTTON_SIZE}px`
};

function Controls({ dateRange, width }) {
  const dispatch = useContext(TimelineDispatcherContext);
  const buttonWidthStyle = { width: `${width}px` };

  const [from, to] = dateRange;
  const dates = useMemo(() => generateDatesForRange(from, to), [from, to]);

  console.log('CONTROLS > ', dates);

  return (
    <div className={classNames('timeline-controls')}>
      <Button
        className="timeline-controls__button timeline-controls__button--arrow"
        style={arrowWidthStyle}
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
        className="timeline-controls__button timeline-controls__button--arrow"
        style={arrowWidthStyle}
        icon={Icons.right}
        onClick={() => dispatch({ type: MOVE_VIEW_DATE, value: 1 })}
      />
    </div>
  );
}

Controls.displayName = 'TimelineControls';
Controls.propTypes = {
  width: PropTypes.number,
  dateRange: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)])
  )
};

export default Controls;
