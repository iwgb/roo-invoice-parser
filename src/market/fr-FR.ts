import { InvoiceComponentGetterProps } from '../types';
import {
  getDataFromAdjustmentTable,
  getDataFromShiftTable,
  getPeriodFromHeader,
} from '../utils/parse';

const HEADER_END_FLAG = 'Total';
const SUMMARY_START_FLAG = 'sume';
const INVOICE_NAME_FLAG = 'Nom';
const INVOICE_NAME_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_FLAG = 'Prestations du';
const INVOICE_PERIOD_LABEL_SEPARATOR = 'du';
const INVOICE_PERIOD_DATE_SEPARATOR = 'au';
const INVOICE_ADJUSTMENT_EXCLUDED_LABELS = ['Commandes livrées', 'Total TTC'];

const getShifts = ({ text, zone, locale }: InvoiceComponentGetterProps) => getDataFromShiftTable(
  text,
  zone,
  locale,
  HEADER_END_FLAG,
  SUMMARY_START_FLAG,
);

const getPeriod = ({ text, zone, locale }: InvoiceComponentGetterProps) => getPeriodFromHeader(
  text,
  INVOICE_PERIOD_FLAG,
  INVOICE_PERIOD_LABEL_SEPARATOR,
  INVOICE_PERIOD_DATE_SEPARATOR,
  { zone, locale },
);

const getName = ({ text }: InvoiceComponentGetterProps) => (text
  .find((line) => line.includes(INVOICE_NAME_FLAG)) || '')
  .split(INVOICE_NAME_LABEL_SEPARATOR)[1]
  .trim();

const getAdjustments = ({ text }: InvoiceComponentGetterProps) => getDataFromAdjustmentTable(
  text,
  SUMMARY_START_FLAG,
  INVOICE_ADJUSTMENT_EXCLUDED_LABELS,
  1,
);

export default {
  getName, getPeriod, getShifts, getAdjustments,
};
