import genericEnglishParser from './en';
import { EUR } from '../constants/currency';
import { InvoiceComponentGetterProps } from '../types';
import { getNameFromHeader } from '../utils/parse';

const INVOICE_NAME_FLAG = 'Contractor';
const COMPANY_NAME = 'Deliveroo Ireland Limited';

const getName = ({ text }: InvoiceComponentGetterProps) => getNameFromHeader(
  text,
  INVOICE_NAME_FLAG,
);

export default {
  ...genericEnglishParser,
  getName,
  currency: EUR,
  flags: { with: [COMPANY_NAME] },
};
