import { InvoiceComponentGetterProps } from '../types';
import {
  getDataFromAdjustmentTable,
  getDataFromShiftTable,
  getPeriodFromHeader,
} from '../utils/parse';
import { InvoiceParser } from './markets';

const HEADER_END_FLAG = 'Total';
const SUMMARY_START_FLAG = 'Summary';
const INVOICE_NAME_FLAG = 'Pay to';
const INVOICE_NAME_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_FLAG = 'Services Rendered';
const INVOICE_PERIOD_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_DATE_SEPARATOR = '-';
const INVOICE_ADJUSTMENT_EXCLUDED_LABELS = ['Drop Fees', 'Total'];

const getShifts = ({ text, zone, locale }: InvoiceComponentGetterProps) => getDataFromShiftTable(
  text,
  zone,
  locale,
  HEADER_END_FLAG,
  SUMMARY_START_FLAG,
);

const getPeriod = ({ text, zone }: InvoiceComponentGetterProps) => getPeriodFromHeader(
  text,
  INVOICE_PERIOD_FLAG,
  INVOICE_PERIOD_LABEL_SEPARATOR,
  INVOICE_PERIOD_DATE_SEPARATOR,
  { zone },
);

const getName = ({ text }: InvoiceComponentGetterProps) => (text
  .find((line) => line.includes(INVOICE_NAME_FLAG)) || '')
  .split(INVOICE_NAME_LABEL_SEPARATOR)[1]
  .trim();

const getAdjustments = ({ text }: InvoiceComponentGetterProps) => getDataFromAdjustmentTable(
  text,
  SUMMARY_START_FLAG,
  INVOICE_ADJUSTMENT_EXCLUDED_LABELS,
);

export default {
  getName,
  getPeriod,
  getShifts,
  getAdjustments,
} as Omit<InvoiceParser, 'currency' | 'flag'>;
