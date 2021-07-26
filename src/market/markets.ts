import enGb from './en-GB';
import {
  Adjustment, InvoiceComponentGetterProps, Period, Shift,
} from '../types';

export interface InvoiceParser {
  getName: (props: InvoiceComponentGetterProps) => string,
  getPeriod: (props: InvoiceComponentGetterProps) => Period,
  getShifts: (props: InvoiceComponentGetterProps) => Shift[],
  getAdjustments: (props: InvoiceComponentGetterProps) => Adjustment[],
}

export interface Markets {
  'en-GB': InvoiceParser,
}

export default {
  'en-GB': enGb,
};
