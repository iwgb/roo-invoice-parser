import parser from './en';
import { EUR } from '../constants/currency';
import { InvoiceComponentGetterProps } from '../types';

const INVOICE_NAME_FLAG = 'Contractor';
const INVOICE_NAME_LABEL_SEPARATOR = ':';
const COMPANY_NAME = 'Deliveroo Ireland Limited';

const getName = ({ text }: InvoiceComponentGetterProps) => (text
  .find((line) => line.includes(INVOICE_NAME_FLAG)) || '')
  .split(INVOICE_NAME_LABEL_SEPARATOR)[1]
  .trim();

export default {
  ...parser,
  getName,
  currency: EUR,
  flag: COMPANY_NAME,
};
