import enGb from './en-GB';
import enBe from './en-BE';
import frFr from './fr-FR';
import {
  Adjustment, InvoiceComponentGetterProps, Period, Shift,
} from '../types';

export interface InvoiceParser {
  getName: (props: InvoiceComponentGetterProps) => string,
  getPeriod: (props: InvoiceComponentGetterProps) => Period,
  getShifts: (props: InvoiceComponentGetterProps) => Omit<Shift, 'hours'>[],
  getAdjustments: (props: InvoiceComponentGetterProps) => Adjustment[],
}

export interface Markets {
  'en-GB': InvoiceParser,
  'en-BE': InvoiceParser,
  'fr-FR': InvoiceParser,
}

export default {
  'en-GB': enGb,
  'en-BE': enBe,
  'fr-FR': frFr,
};
