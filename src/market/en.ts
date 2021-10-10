import { InvoiceComponentGetterProps, InvoiceParser } from '../types';
import {
  getDataFromAdjustmentTable,
  getDataFromShiftTable, getNameFromHeader,
  getPeriodFromHeader,
} from '../utils/parse';

const HEADER_END_FLAG = 'Total';
const SUMMARY_START_FLAG = 'Summary';
const INVOICE_NAME_FLAG = 'Pay to';
const INVOICE_PERIOD_FLAG = 'Services Rendered';
const INVOICE_PERIOD_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_DATE_SEPARATOR = '-';
const INVOICE_ADJUSTMENT_EXCLUDED_LABELS = ['Drop Fees', 'Total', 'Total without tax'];

const getShifts = ({ text, zone }: InvoiceComponentGetterProps) => getDataFromShiftTable(
  text,
  zone,
  'en-GB',
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

const getName = ({ text }: InvoiceComponentGetterProps) => getNameFromHeader(
  text,
  INVOICE_NAME_FLAG,
);

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
