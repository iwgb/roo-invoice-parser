import { DateTime } from 'luxon';
import chunk from 'lodash/chunk';
import { getDateTime } from '../utils/datetime';
import { INVOICE_DATE_FORMAT } from '../constants/invoice';
import { InvoiceComponentGetterProps } from '../types';

const HEADER_END_FLAG = 'Total';
const SUMMARY_START_FLAG = 'Summary';
const ORDERS_TOTAL_SEPARATOR = ':';
const INVOICE_NAME_FLAG = 'Pay to';
const INVOICE_NAME_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_FLAG = 'Payment for Services Rendered';
const INVOICE_PERIOD_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_DATE_SEPARATOR = '-';
const INVOICE_ADJUSTMENT_EXCLUDED_LABELS = ['Drop Fees', 'Total'];

const getShifts = ({ text, zone }: InvoiceComponentGetterProps) => {
  const rawShifts = text
    .slice(
      text.indexOf(HEADER_END_FLAG) + 1,
      text.indexOf(SUMMARY_START_FLAG),
    )
    .reduce((shifts, shiftLine) => (
      shiftLine.includes('day')
        ? [
          ...shifts,
          [shiftLine],
        ]
        : [
          ...shifts.slice(0, -1),
          [
            ...shifts.slice(-1)[0],
            shiftLine,
          ],
        ]
    ), [] as string[][]);

  return rawShifts.map(([
    // eslint-disable-next-line no-unused-vars
    _1, date, startTime, endTime, _2, ordersAndTotal,
  ]) => {
    const [orders, total] = ordersAndTotal.split(ORDERS_TOTAL_SEPARATOR);
    const start = getDateTime(date, startTime, zone);
    let end = getDateTime(date, endTime, zone);

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

const getPeriod = ({ text, zone }: InvoiceComponentGetterProps) => {
  const [start, end] = (text
    .find((line) => line.includes(INVOICE_PERIOD_FLAG)) || '')
    .split(INVOICE_PERIOD_LABEL_SEPARATOR)[1]
    .split(INVOICE_PERIOD_DATE_SEPARATOR)
    .map((date) => DateTime.fromFormat(date.trim(), INVOICE_DATE_FORMAT, { zone }));
  return {
    start,
    end: end.endOf('day'),
  };
};

const getName = ({ text }: InvoiceComponentGetterProps) => (text
  .find((line) => line.includes(INVOICE_NAME_FLAG)) || '')
  .split(INVOICE_NAME_LABEL_SEPARATOR)[1]
  .trim();

const getAdjustments = ({ text }: InvoiceComponentGetterProps) => {
  const adjustments = chunk(text.slice(
    text.indexOf(SUMMARY_START_FLAG) + 1,
  ), 2);

  return adjustments
    .map(([label, amount]) => ({
      label,
      amount: Number.parseFloat(amount.slice(1)),
    }))
    .filter(({ label }) => !INVOICE_ADJUSTMENT_EXCLUDED_LABELS.includes(label));
};

export default {
  getName, getPeriod, getShifts, getAdjustments,
};
