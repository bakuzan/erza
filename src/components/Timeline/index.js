import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { useReducer, useEffect, useState } from 'react';

import Tooltip from 'meiko/Tooltip';
import ZoomControls from './ZoomControls';

import { useDimensions } from 'hooks/useDimensions';
import Controls from './Controls';
import timelineReducer, { initialState } from './reducer';
import { ARROW_BUTTON_SIZE, zoom } from './utils/consts';
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

function Timeline({ className, items, onUpdate, children, ...props }) {
  const [ref, { width }] = useDimensions();
  const [state, dispatch] = useReducer(timelineReducer, initialState());
  const [zoomLevel, setZoomLevel] = useState(zoom.DEFAULT);

  const sizing = getTimelineSizes(width, zoomLevel);

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

  return (
    <TimelineDispatcherContext.Provider value={dispatch}>
      <div ref={ref} className={classNames('timeline', className)}>
        <ZoomControls level={zoomLevel} setLevel={setZoomLevel} />
        <Controls width={sizing.timelineSpace} dateRange={dateRange} />
        <div className="timeline__scroll-wrapper">
          <div className="timeline__content" style={accountForArrowButtons}>
            {rows.map((x) => {
              const displayText = `${x.name} - ${x.days} day(s)`;

              return (
                <Tooltip
                  delay={250}
                  text={displayText}
                  usePosition
                  key={x.id}
                  className="timeline-row"
                  style={x.style}
                >
                  {children({ ...x, displayText })}
                </Tooltip>
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
  children: PropTypes.func.isRequired,
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
