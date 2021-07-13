import { Moment } from 'moment';
import moment from 'moment-timezone';
import { INVOICE_DATE_FORMAT, INVOICE_TIME_FORMAT } from '../constants/invoice';

// eslint-disable-next-line import/prefer-default-export
export const getDateTime = (date: string, time: string, location: string): Moment => moment.tz(
  `${date} ${time}`,
  `${INVOICE_DATE_FORMAT} ${INVOICE_TIME_FORMAT}`,
  location,
);
