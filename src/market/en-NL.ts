import genericEnglishParser from './en';
import { EUR } from '../constants/currency';

const COMPANY_NAME = 'Deliveroo Netherlands BV';
const DUTCH_COURIER_LABEL = 'Leverancier';

export default {
  ...genericEnglishParser,
  currency: EUR,
  flags: {
    with: [COMPANY_NAME],
    not: [DUTCH_COURIER_LABEL],
  },
};
