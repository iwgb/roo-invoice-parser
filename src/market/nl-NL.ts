import { EUR } from '../constants/currency';
import { InvoiceComponentGetterProps } from '../types';
import {
  getDataFromAdjustmentTable,
  getDataFromShiftTable,
  getNameFromHeader,
  getPeriodFromHeader,
} from '../utils/parse';

const COMPANY_NAME = 'Deliveroo Netherlands BV';
const DUTCH_COURIER_LABEL = 'Leverancier';
const INVOICE_NAME_FLAG = 'Te betalen aan';
const INVOICE_PERIOD_FLAG = 'Diensten gelevered in de periode';
const SUMMARY_START_FLAG = 'Samenvatting';
const ADJUSTMENTS_EXCLUDED_LABELS = ['Totaal', 'Betaling per bestelling', 'Totaal excl. BTW'];
const HEADER_END_FLAG = 'vergoeding';
const ADJUSTMENTS_START_FLAG = 'Fee Adjustments';
const ADDITIONAL_LINE_START_FLAGS = ['wednesda'];

const getShifts = ({ text, zone }: InvoiceComponentGetterProps) => getDataFromShiftTable(
  text,
  zone,
  'en-GB',
  HEADER_END_FLAG,
  ADJUSTMENTS_START_FLAG,
  ADDITIONAL_LINE_START_FLAGS,
);

const getPeriod = ({ text, zone }: InvoiceComponentGetterProps) => getPeriodFromHeader(
  text,
  INVOICE_PERIOD_FLAG,
  ':',
  '-',
  { zone, locale: 'en-GB' },
);

const getName = ({ text }: InvoiceComponentGetterProps) => getNameFromHeader(
  text,
  INVOICE_NAME_FLAG,
);

const getAdjustments = ({ text }: InvoiceComponentGetterProps) => getDataFromAdjustmentTable(
  text,
  SUMMARY_START_FLAG,
  ADJUSTMENTS_EXCLUDED_LABELS,
);

export default {
  getShifts,
  getPeriod,
  getName,
  getAdjustments,
  currency: EUR,
  flags: { with: [COMPANY_NAME, DUTCH_COURIER_LABEL] },
};
