import enGb from './en-GB';
import { Adjustment, InvoiceComponentGetterProps, Shift } from '../parse';

interface InvoiceParser {
  getName: (props: InvoiceComponentGetterProps) => string,
  getPeriod: (props: InvoiceComponentGetterProps) => { start: string, end: string },
  getShifts: (props: InvoiceComponentGetterProps) => Shift[],
  getAdjustments: (props: InvoiceComponentGetterProps) => Adjustment[],
}

export interface Markets {
  'en-GB': InvoiceParser,
}

export default {
  'en-GB': enGb,
};
