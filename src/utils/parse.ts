import chunk from 'lodash/chunk';
import { DateTime, DateTimeOptions, Info } from 'luxon';
import { Adjustment, Shift } from '../types';
import { getDateTime } from './datetime';
import { INVOICE_DATE_FORMAT } from '../constants/invoice';

export const getDataFromShiftTable = (
  text: string[],
  zone: string,
  locale: string,
  lineBefore: string,
  lineAfter: string,
): Omit<Shift, 'hours'>[] => {
  const weekdays = Info.weekdays('long', { locale })
    .map((weekday) => weekday.toLowerCase());

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

  return rawShifts.map(([
    // eslint-disable-next-line no-unused-vars
    _1, date, startTime, endTime, _2, ordersAndTotal,
  ]) => {
    const [orders, total] = ordersAndTotal.split(':');
    const start = getDateTime(date, startTime, { zone, locale });
    let end = getDateTime(date, endTime, { zone, locale });

    if (end < start) {
      end = end.plus({ days: 1 });
    }

    return {
      start,
      end,
      orders: Number.parseInt(orders, 10),
      pay: Number.parseFloat(total.trim().slice(1)),
    };
  });
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
      amount: Number.parseFloat(amount.slice(1)),
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
