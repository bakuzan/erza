import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useReducer, useEffect } from 'react';

import { useDimensions } from 'hooks/useDimensions';
import Controls from './Controls';
import timelineReducer, { initialState } from './reducer';
import { BASE_BUTTON_SIZE } from './utils/consts';
import calculateTimelineArrangement from './utils/calculateTimelineArrangement';
import getDateRange from './utils/getDateRange';
import { TimelineDispatcherContext } from './utils/context';

import './Timeline.scss';

function Timeline({ className, items, onUpdate, ...props }) {
  const [ref, { width }] = useDimensions();
  const [state, dispatch] = useReducer(timelineReducer, initialState());

  const dateRange = getDateRange(state.viewDate, width);
  const rows = calculateTimelineArrangement(width, dateRange, items);
  const accountForArrowButtons = BASE_BUTTON_SIZE;
  const [fromDate, toDate] = dateRange;

  useEffect(() => {
    if (onUpdate && fromDate && toDate) {
      onUpdate([fromDate, toDate]);
    }
  }, [onUpdate, fromDate, toDate]);

  console.log(dateRange, 'RENDER TIMELINE', items);
  return (
    <TimelineDispatcherContext.Provider value={dispatch}>
      <div ref={ref} className={classNames('timeline', className)}>
        <Controls dateRange={dateRange} />
        <div
          className="timeline__content"
          style={{ margin: `0 ${accountForArrowButtons}px` }}
        >
          {rows.map((x) => {
            return (
              <div key={x.id} className="timeline-row" style={x.style}>
                {x.name}
              </div>
            );
          })}
        </div>
      </div>
    </TimelineDispatcherContext.Provider>
  );
}

Timeline.displayName = 'Timeline';
Timeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string
    })
  ),
  onUpdate: PropTypes.func
};
export default Timeline;
