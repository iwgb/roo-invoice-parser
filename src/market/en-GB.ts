import parser from './en';
import { GBP } from '../constants/currency';

const COMPANY_NAME = 'Roofoods Limited';

export default {
  ...parser,
  currency: GBP,
  flags: { with: [COMPANY_NAME] },
};
