import { InvoiceComponentGetterProps, InvoiceParser } from '../types';
import {
  getDataFromAdjustmentTable,
  getDataFromShiftTable,
  getPeriodFromHeader,
} from '../utils/parse';
import { EUR } from '../constants/currency';

const HEADER_END_FLAG = 'Total';
const SUMMARY_START_FLAG = 'sume';
const INVOICE_NAME_FLAG = 'Nom';
const INVOICE_NAME_LABEL_SEPARATOR = ':';
const INVOICE_PERIOD_FLAG = 'Prestations du';
const INVOICE_PERIOD_LABEL_SEPARATOR = 'du';
const INVOICE_PERIOD_DATE_SEPARATOR = 'au';
const INVOICE_ADJUSTMENT_EXCLUDED_LABELS = ['Commandes livrées', 'Total TTC'];
const COMPANY_NAME = 'Deliveroo France SAS';

const getShifts = ({ text, zone }: InvoiceComponentGetterProps) => getDataFromShiftTable(
  text,
  zone,
  'fr-FR',
  HEADER_END_FLAG,
  SUMMARY_START_FLAG,
);

const getPeriod = ({ text, zone }: InvoiceComponentGetterProps) => getPeriodFromHeader(
  text,
  INVOICE_PERIOD_FLAG,
  INVOICE_PERIOD_LABEL_SEPARATOR,
  INVOICE_PERIOD_DATE_SEPARATOR,
  { zone, locale: 'fr-FR' },
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
  getName,
  getPeriod,
  getShifts,
  getAdjustments,
  currency: EUR,
  flags: { with: [COMPANY_NAME] },
} as InvoiceParser;
