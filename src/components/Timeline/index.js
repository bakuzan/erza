import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useReducer, useEffect } from 'react';

import { useDimensions } from 'hooks/useDimensions';
import Controls from './Controls';
import timelineReducer, { initialState } from './reducer';
import { ARROW_BUTTON_SIZE } from './utils/consts';
import { TimelineDispatcherContext } from './utils/context';
import getTimelineSizes from './utils/getTimelineSizes';
import calculateTimelineArrangement from './utils/calculateTimelineArrangement';
import getDateRange from './utils/getDateRange';

import './Timeline.scss';

const SCROLLBAR_WIDTH = 20;
const accountForArrowButtons = {
  marginLeft: `${ARROW_BUTTON_SIZE}px`,
  marginRight: `${ARROW_BUTTON_SIZE - SCROLLBAR_WIDTH}px`
};

function Timeline({ className, items, onUpdate, ...props }) {
  const [ref, { width }] = useDimensions();
  const [state, dispatch] = useReducer(timelineReducer, initialState());

  const sizing = getTimelineSizes(width);

  const dateRange = getDateRange(state.viewDate, sizing.parts);
  const [fromDate, toDate] = dateRange;
  const rows = calculateTimelineArrangement(
    sizing.timelineSpace,
    dateRange,
    items
  );

  useEffect(() => {
    if (onUpdate && fromDate && toDate) {
      onUpdate([fromDate, toDate]);
    }
  }, [onUpdate, fromDate, toDate]);

  console.log(dateRange, 'RENDER TIMELINE', items);
  return (
    <TimelineDispatcherContext.Provider value={dispatch}>
      <div ref={ref} className={classNames('timeline', className)}>
        <Controls width={sizing.timelineSpace} dateRange={dateRange} />
        <div className="timeline__scroll-wrapper">
          <div className="timeline__content" style={accountForArrowButtons}>
            {rows.map((x) => {
              // TODO replace title with tooltip component! (Need to write)
              return (
                <div
                  key={x.id}
                  className="timeline-row"
                  title={x.name}
                  style={x.style}
                >
                  {x.name}
                </div>
              );
            })}
          </div>
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
