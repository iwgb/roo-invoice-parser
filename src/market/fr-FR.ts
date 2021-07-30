import { DateTime } from 'luxon';
import { INVOICE_DATE_FORMAT } from '../constants/invoice';
import { InvoiceComponentGetterProps } from '../types';
import { getDataFromAdjustmentTable, getDataFromShiftTable } from '../utils/parse';

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

const getPeriod = ({ text, zone, locale }: InvoiceComponentGetterProps) => {
  const [start, end] = (text
    .find((line) => line.includes(INVOICE_PERIOD_FLAG)) || '')
    .split(INVOICE_PERIOD_LABEL_SEPARATOR)[1]
    .split(INVOICE_PERIOD_DATE_SEPARATOR)
    .map((date) => DateTime.fromFormat(date.trim(), INVOICE_DATE_FORMAT, { zone, locale }));
  return {
    start,
    end: end.endOf('day'),
  };
};

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
