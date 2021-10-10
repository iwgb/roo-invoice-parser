import enGb from './en-GB';
import enBe from './en-BE';
import enNl from './en-NL';
import frFr from './fr-FR';
import enAu from './en-AU';
import enIe from './en-IE';
import nlNl from './nl-NL';
import { InvoiceParser } from '../types';

const UNITED_KINGDOM = 'en-GB';
const BELGIUM = 'en-BE';
const FRANCE = 'fr-FR';
const AUSTRALIA = 'en-AU';
const IRELAND = 'en-IE';
const NETHERLANDS_ENGLISH = 'en-NL';
const NETHERLANDS_DUTCH = 'nl-NL';

export interface Markets {
  [UNITED_KINGDOM]: InvoiceParser,
  [BELGIUM]: InvoiceParser,
  [FRANCE]: InvoiceParser,
  [AUSTRALIA]: InvoiceParser,
  [IRELAND]: InvoiceParser,
  [NETHERLANDS_ENGLISH]: InvoiceParser,
  [NETHERLANDS_DUTCH]: InvoiceParser,
}

export const defaultTimezones = {
  [UNITED_KINGDOM]: 'Europe/London',
  [BELGIUM]: 'Europe/Brussels',
  [FRANCE]: 'Europe/Paris',
  [AUSTRALIA]: 'Australia/Sydney',
  [IRELAND]: 'Europe/Dublin',
  [NETHERLANDS_ENGLISH]: 'Europe/Amsterdam',
  [NETHERLANDS_DUTCH]: 'Europe/Amsterdam',
};

export default {
  [UNITED_KINGDOM]: enGb,
  [BELGIUM]: enBe,
  [FRANCE]: frFr,
  [AUSTRALIA]: enAu,
  [IRELAND]: enIe,
  [NETHERLANDS_ENGLISH]: enNl,
  [NETHERLANDS_DUTCH]: nlNl,
} as Markets;
