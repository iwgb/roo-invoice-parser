import enGb from './en-GB';
import enBe from './en-BE';
import frFr from './fr-FR';
import enAu from './en-AU';
import enIe from './en-IE';
import {
  Adjustment, InvoiceComponentGetterProps, Period, Shift,
} from '../types';

export interface InvoiceParser {
  getName: (props: InvoiceComponentGetterProps) => string,
  getPeriod: (props: InvoiceComponentGetterProps) => Period,
  getShifts: (props: InvoiceComponentGetterProps) => Omit<Shift, 'hours'>[],
  getAdjustments: (props: InvoiceComponentGetterProps) => Adjustment[],
  currency: string,
  flag: string,
}

const UNITED_KINGDOM = 'en-GB';
const BELGIUM = 'en-BE';
const FRANCE = 'fr-FR';
const AUSTRALIA = 'en-AU';
const IRELAND = 'en-IE';

export interface Markets {
  [UNITED_KINGDOM]: InvoiceParser,
  [BELGIUM]: InvoiceParser,
  [FRANCE]: InvoiceParser,
  [AUSTRALIA]: InvoiceParser,
  [IRELAND]: InvoiceParser,
}

export const defaultTimezones = {
  [UNITED_KINGDOM]: 'Europe/London',
  [BELGIUM]: 'Europe/Brussels',
  [FRANCE]: 'Europe/Paris',
  [AUSTRALIA]: 'Australia/Sydney',
  [IRELAND]: 'Europe/Dublin',
};

export default {
  [UNITED_KINGDOM]: enGb,
  [BELGIUM]: enBe,
  [FRANCE]: frFr,
  [AUSTRALIA]: enAu,
  [IRELAND]: enIe,
};
