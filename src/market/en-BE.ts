import { DateTime } from 'luxon';
import { InvoiceComponentGetterProps, InvoiceParser } from '../types';
import { INVOICE_DATE_FORMAT } from '../constants/invoice';
import { getDataFromAdjustmentTable, getDataFromShiftTable } from '../utils/parse';
import { EUR } from '../constants/currency';

const SUPPLIER_FLAG = 'Supplier:';
const INVOICE_PERIOD_FLAG = 'Services provided';
const INVOICE_PERIOD_SEPARATOR = '-';
const HEADER_END_FLAG = 'Total';
const SUMMARY_START_FLAG = 'Summary';
const INVOICE_ADJUSTMENT_EXCLUDED_LABELS = ['Drop Fees', 'Total'];
const COMPANY_NAME = 'Deliveroo Belgium sprl';

const getShifts = ({ text, zone }: InvoiceComponentGetterProps) => getDataFromShiftTable(
  text,
  zone,
  'en-GB',
  HEADER_END_FLAG,
  SUMMARY_START_FLAG,
);

const getPeriod = ({ text, zone }: InvoiceComponentGetterProps) => {
  const [start, end] = (text
    .find((line) => line.includes(INVOICE_PERIOD_FLAG)) || '')
    .split(INVOICE_PERIOD_SEPARATOR)
    .slice(1)
    .map((date) => DateTime.fromFormat(date.trim(), INVOICE_DATE_FORMAT, { zone }));
  return {
    start,
    end: end.endOf('day'),
  };
};

const getName = ({
  text,
}: InvoiceComponentGetterProps) => text[text.indexOf(SUPPLIER_FLAG) + 1];

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
  currency: EUR,
  flags: { with: [COMPANY_NAME] },
} as InvoiceParser;
