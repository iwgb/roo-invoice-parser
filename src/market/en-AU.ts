import { DateTime } from 'luxon';
import genericEnglishParser from './en';
import { InvoiceComponentGetterProps, InvoiceParser } from '../types';
import { INVOICE_DATE_FORMAT } from '../constants/invoice';
import { AUD } from '../constants/currency';
import { getNameFromHeader } from '../utils/parse';

const INVOICE_PERIOD_FLAG = 'Bill for services supplied during:';
const INVOICE_PERIOD_DATE_SEPARATOR = '-';
const INVOICE_NAME_FLAG = 'Supplier:';
const COMPANY_NAME = 'Deliveroo Australia Pty Ltd';

const getPeriod = ({ text, zone }: InvoiceComponentGetterProps) => {
  const [start, end] = text[text.indexOf(INVOICE_PERIOD_FLAG) + 1]
    .split(INVOICE_PERIOD_DATE_SEPARATOR)
    .map((date) => DateTime.fromFormat(date.trim(), INVOICE_DATE_FORMAT, { zone }));

  return {
    start,
    end: end.endOf('day'),
  };
};

const getName = ({ text }: InvoiceComponentGetterProps) => getNameFromHeader(
  text,
  INVOICE_NAME_FLAG,
  1,
);

export default {
  ...genericEnglishParser,
  getName,
  getPeriod,
  currency: AUD,
  flags: { with: [COMPANY_NAME] },
} as InvoiceParser;
