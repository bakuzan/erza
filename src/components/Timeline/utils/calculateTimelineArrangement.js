import daysDifferenceBetweenDatesInclusive from './daysDifferenceBetweenDatesInclusive';

function getMaxDate(...ds) {
  return Math.max(...ds.map((x) => new Date(x)));
}

function calculateEntryWidth(
  daySize,
  [fromDate, toDate],
  [entryStart, entryEnd]
) {
  const today = new Date();
  const start = getMaxDate(fromDate, entryStart);
  const finish = entryEnd || toDate;
  const days = daysDifferenceBetweenDatesInclusive(start, finish);
  return {
    days: daysDifferenceBetweenDatesInclusive(entryStart, entryEnd || today),
    width: days * daySize
  };
}

export default function calculateTimelineArrangement(
  width,
  [fromDate, toDate],
  items
) {
  const numOfDays = daysDifferenceBetweenDatesInclusive(fromDate, toDate);
  const daySize = width / numOfDays;

  const rows = items
    .filter((x) => {
      const validStartDate = new Date(toDate) >= new Date(x.startDate);
      const validEndDate =
        x.endDate === null || new Date(fromDate) <= new Date(x.endDate);

      // Protect against entries not in the range
      return validStartDate && validEndDate;
    })
    .reduce((p, x) => {
      const { days: entryDays, width: entryWidth } = calculateEntryWidth(
        daySize,
        [fromDate, toDate],
        [x.startDate, x.endDate]
      );
      const leftOffset = daysDifferenceBetweenDatesInclusive(
        fromDate,
        x.startDate,
        false
      );
      const marginLeft = leftOffset * daySize;

      return [
        ...p,
        {
          ...x,
          days: entryDays,
          style: {
            width: entryWidth,
            marginLeft: Math.max(marginLeft, 0),
            borderLeftColor: marginLeft < 0 ? 'transparent' : undefined,
            borderRightColor:
              !x.endDate || x.endDate > toDate ? 'transparent' : undefined
          }
        }
      ];
    }, []);

  console.groupCollapsed('Calculated rows');
  console.log('DateRange > ', fromDate, toDate);
  console.log('Num of Days > ', numOfDays);
  console.log('Size of Day (px) > ', daySize);
  console.log(
    'Rows with sizes > ',
    rows.map(({ name, style }) => ({ name, style }))
  );
  console.groupEnd();

  return rows;
}
