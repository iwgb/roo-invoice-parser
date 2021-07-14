import moment from 'moment-timezone';
import { chunk } from 'lodash';
import { getDateTime } from '../utils/datetime';
import { INVOICE_DATE_FORMAT } from '../constants/invoice';
import { InvoiceComponentGetterProps } from '../parse';

const HEADER_END_FLAG = 'Total';
const SUMMARY_START_FLAG = 'Summary';
const ORDERS_TOTAL_SEPARATOR = ':';
const INVOICE_NAME_FLAG = 'Pay to';
const INVOICE_NAME_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_FLAG = 'Payment for Services Rendered';
const INVOICE_PERIOD_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_DATE_SEPARATOR = '-';
const INVOICE_ADJUSTMENT_EXCLUDED_LABELS = ['Drop Fees', 'Total'];

const getShifts = ({ text, timezone }: InvoiceComponentGetterProps) => {
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
    const start = getDateTime(date, startTime, timezone);
    let end = getDateTime(date, endTime, timezone);

    if (end.isBefore(start)) {
      end = end.add(1, 'day');
    }

    return {
      start: start.toISOString(true),
      end: end.toISOString(true),
      orders: Number.parseInt(orders, 10),
      pay: Number.parseFloat(total.trim().slice(1)),
    };
  });
};

const getPeriod = ({ text, timezone }: InvoiceComponentGetterProps) => {
  const [start, end] = (text
    .find((line) => line.includes(INVOICE_PERIOD_FLAG)) || '')
    .split(INVOICE_PERIOD_LABEL_SEPARATOR)[1]
    .split(INVOICE_PERIOD_DATE_SEPARATOR)
    .map((date) => moment.tz(date.trim(), INVOICE_DATE_FORMAT, timezone));
  return {
    start: start.toISOString(true),
    end: end.endOf('day').toISOString(true),
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
