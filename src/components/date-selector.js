import classNames from 'classnames';
import React from 'react';

import { DateSelector as MDateSelector } from 'meiko';

const DateSelector = ({ className, ...props }) => (
  <MDateSelector
    {...props}
    className={classNames(className, 'erza-date-selector')}
    calendarClassName="erza-calendar"
  />
);

export default DateSelector;
