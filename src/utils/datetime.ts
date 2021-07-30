import { DateTime, DateTimeOptions, Interval } from 'luxon';
import { INVOICE_DATE_FORMAT, INVOICE_TIME_FORMAT } from '../constants/invoice';
import { round } from './math';

export const getDateTime = (
  date: string,
  time: string,
  opts: DateTimeOptions,
): DateTime => DateTime
  .fromFormat(
    `${date} ${time}`,
    `${INVOICE_DATE_FORMAT} ${INVOICE_TIME_FORMAT}`,
    opts,
  );

export const dayArrayFromInterval = (interval: Interval) => {
  let day = interval.start.startOf('day');
  let dayArray: DateTime[] = [];
  while (day < interval.end) {
    dayArray = [...dayArray, day];
    day = day.plus({ days: 1 });
  }
  return dayArray;
};

const MONDAY = 1;

export const mondaysInInterval = (interval: Interval) => dayArrayFromInterval(interval)
  .reduce((mondays, day) => {
    if (
      mondays.length === 0
      && day.weekday !== MONDAY
    ) {
      return [];
    }
    if (day.weekday === MONDAY) {
      return [
        ...mondays,
        day,
      ];
    }
    return mondays;
  }, [] as DateTime[]);

export const getShiftHours = (start: DateTime, end: DateTime) => round(
  Interval
    .fromDateTimes(start, end)
    .length('hours'),
);
