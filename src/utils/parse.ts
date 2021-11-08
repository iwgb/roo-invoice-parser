import chunk from 'lodash/chunk';
import { DateTime, DateTimeOptions, Info } from 'luxon';
import { Adjustment, Shift } from '../types';
import { getDateTime } from './datetime';
import { INVOICE_DATE_FORMAT } from '../constants/invoice';

const INVOICE_TIME_REGEX = /^\d\d:\d\d$/;
const INVOICE_DATE_REGEX = /\d{1,2} \w+ \d{4}/;

const getDataFromShiftLine = (shiftLine: string[], opts: DateTimeOptions) => {
  const dataStartIndex = shiftLine.findIndex((item) => INVOICE_TIME_REGEX.test(item));
  const dateMatches = shiftLine
    .slice(0, dataStartIndex)
    .join(' ')
    .match(INVOICE_DATE_REGEX);
  const date = dateMatches === null
    ? ''
    : dateMatches[0];

  const [startTime, endTime, _hours, ordersAndTotal] = shiftLine.slice(dataStartIndex);
  const [orders, total] = ordersAndTotal.split(':');

  const start = getDateTime(date, startTime, opts);
  let end = getDateTime(date, endTime, opts);

  if (end < start) {
    end = end.plus({ days: 1 });
  }

  return {
    start,
    end,
    orders: Number.parseInt(orders, 10),
    pay: Math.round(Number.parseFloat(total.trim().slice(1)) * 100),
  };
};

export const getDataFromShiftTable = (
  text: string[],
  zone: string,
  locale: string,
  lineBefore: string,
  lineAfter: string,
  additionalLineStartFlags: string[] = [],
): Omit<Shift, 'hours'>[] => {
  const weekdays = [
    ...Info.weekdays('long', { locale })
      .map((weekday) => weekday.toLowerCase()),
    ...additionalLineStartFlags,
  ];

  const rawShifts = text
    .slice(
      text.indexOf(lineBefore) + 1,
      text.indexOf(lineAfter),
    )
    .reduce((shifts, shiftLine) => {
      const lastShift = shifts.slice(-1)[0] || [];
      const isNewRow = weekdays.includes(shiftLine.toLowerCase());

      if (isNewRow) {
        return [
          ...shifts,
          [shiftLine],
        ];
      }

      if (lastShift.length > 0) {
        return [
          ...shifts.slice(0, -1),
          [
            ...lastShift,
            shiftLine,
          ],
        ];
      }

      return shifts;
    }, [] as string[][]);

  return rawShifts
    .map((shiftLine) => getDataFromShiftLine(shiftLine, { zone, locale }));
};

export const getDataFromAdjustmentTable = (
  text: string[],
  lineBefore: string,
  excludedLabels: string[],
  lineBeforeOffset: number = 0,
): Adjustment[] => {
  const adjustments = chunk(text.slice(
    text.indexOf(lineBefore) + 1 + lineBeforeOffset,
  ), 2);

  return adjustments
    .map(([label, amount = '']) => ({
      label,
      amount: Math.round(Number.parseFloat(amount.slice(1)) * 100),
    }))
    .filter(({ label, amount }) => (
      !excludedLabels.includes(label)
      && !Number.isNaN(amount)
    ));
};

export const getPeriodFromHeader = (
  text: string[],
  lineLabel: string,
  labelSeparator: string,
  dateSeparator: string,
  dateTimeOpts: DateTimeOptions,
) => {
  const [start, end] = (text
    .find((line) => line.includes(lineLabel)) || '')
    .split(labelSeparator)[1]
    .split(dateSeparator)
    .map((date) => DateTime.fromFormat(date.trim(), INVOICE_DATE_FORMAT, dateTimeOpts));
  return {
    start,
    end: end.endOf('day'),
  };
};

export const getNameFromHeader = (text: string[], flag: string, offset: number = 0): string => {
  const flagIndex = text.findIndex((line) => line.includes(flag));
  const nameIndexOffset = text
    .slice(flagIndex + offset)
    .findIndex((line) => line.trim() !== '');
  return text[flagIndex + offset + nameIndexOffset].split(':')[1]
    .trim();
};
