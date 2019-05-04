import { daysDifferenceBetweenDates } from 'utils';

function getMaxDate(...ds) {
  return Math.max(...ds.map((x) => new Date(x)));
}

function calculateEntryWidth(
  daySize,
  [fromDate, toDate],
  [entryStart, entryEnd]
) {
  const start = getMaxDate(fromDate, entryStart);
  const finish = entryEnd || toDate;
  const days = daysDifferenceBetweenDates(start, finish);
  return days * daySize;
}

export default function calculateTimelineArrangement(
  width,
  [fromDate, toDate],
  items
) {
  const numOfDays = daysDifferenceBetweenDates(fromDate, toDate);
  const daySize = width / numOfDays;

  const rows = items
    .filter((x) => {
      const validStartDate = new Date(toDate) > new Date(x.startDate);
      const validEndDate =
        x.endDate === null || new Date(fromDate) < new Date(x.endDate);

      // Protect against entries not in the range
      return validStartDate && validEndDate;
    })
    .reduce((p, x) => {
      const entryWidth = calculateEntryWidth(
        daySize,
        [fromDate, toDate],
        [x.startDate, x.endDate]
      );
      const leftOffset = daysDifferenceBetweenDates(fromDate, x.startDate);
      const marginLeft = leftOffset * daySize;

      return [
        ...p,
        {
          ...x,
          style: {
            width: entryWidth === width ? entryWidth + 0.6 : entryWidth,
            marginLeft: Math.max(marginLeft, -0.6)
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
