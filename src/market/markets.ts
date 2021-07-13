import enGb from './en-GB';
import { Invoice, InvoiceComponentGetterProps } from '../parse';

type InvoiceParser = (props: InvoiceComponentGetterProps) => Invoice;

export interface Markets {
  'en-GB': InvoiceParser,
}

export default {
  'en-GB': enGb,
};
