import enGb from './en-GB';
import enBe from './en-BE';
import frFr from './fr-FR';
import enAu from './en-AU';
import {
  Adjustment, InvoiceComponentGetterProps, Period, Shift,
} from '../types';

export interface InvoiceParser {
  getName: (props: InvoiceComponentGetterProps) => string,
  getPeriod: (props: InvoiceComponentGetterProps) => Period,
  getShifts: (props: InvoiceComponentGetterProps) => Omit<Shift, 'hours'>[],
  getAdjustments: (props: InvoiceComponentGetterProps) => Adjustment[],
}

const UNITED_KINGDOM = 'en-GB';
const BELGIUM = 'en-BE';
const FRANCE = 'fr-FR';
const AUSTRALIA = 'en-AU';

export interface Markets {
  [UNITED_KINGDOM]: InvoiceParser,
  [BELGIUM]: InvoiceParser,
  [FRANCE]: InvoiceParser,
  [AUSTRALIA]: InvoiceParser,
}

export const defaultTimezones = {
  [UNITED_KINGDOM]: 'Europe/London',
  [BELGIUM]: 'Europe/Brussels',
  [FRANCE]: 'Europe/Paris',
  [AUSTRALIA]: 'Australia/Sydney',
};

export default {
  [UNITED_KINGDOM]: enGb,
  [BELGIUM]: enBe,
  [FRANCE]: frFr,
  [AUSTRALIA]: enAu,
};
