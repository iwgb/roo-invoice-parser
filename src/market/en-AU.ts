import { DateTime } from 'luxon';
import { InvoiceComponentGetterProps } from '../types';
import {
  getDataFromAdjustmentTable, getDataFromShiftTable,
} from '../utils/parse';
import { INVOICE_DATE_FORMAT } from '../constants/invoice';

const SUMMARY_START_FLAG = 'Summary';
const HEADER_END_FLAG = 'Total';
const INVOICE_PERIOD_FLAG = 'Bill for services supplied during:';
const INVOICE_PERIOD_DATE_SEPARATOR = '-';
const INVOICE_ADJUSTMENT_EXCLUDED_LABELS = ['Drop Fees', 'Total'];
const INVOICE_NAME_FLAG = 'Supplier:';
const INVOICE_NAME_LABEL_SEPARATOR = ':';

const getShifts = ({ text, zone, locale }: InvoiceComponentGetterProps) => getDataFromShiftTable(
  text,
  zone,
  locale,
  HEADER_END_FLAG,
  SUMMARY_START_FLAG,
);

const getPeriod = ({ text, zone }: InvoiceComponentGetterProps) => {
  const [start, end] = text[text.indexOf(INVOICE_PERIOD_FLAG) + 1]
    .split(INVOICE_PERIOD_DATE_SEPARATOR)
    .map((date) => DateTime.fromFormat(date.trim(), INVOICE_DATE_FORMAT, { zone }));

  return {
    start,
    end: end.endOf('day'),
  };
};

const getName = ({ text }: InvoiceComponentGetterProps) => text[text.indexOf(INVOICE_NAME_FLAG) + 1]
  .split(INVOICE_NAME_LABEL_SEPARATOR)[1]
  .trim();

const getAdjustments = ({ text }: InvoiceComponentGetterProps) => getDataFromAdjustmentTable(
  text,
  SUMMARY_START_FLAG,
  INVOICE_ADJUSTMENT_EXCLUDED_LABELS,
);

export default {
  getName, getPeriod, getShifts, getAdjustments,
};
