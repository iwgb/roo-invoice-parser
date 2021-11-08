import { sha256 as Sha256 } from 'sha.js';
import { SingleBar } from 'cli-progress';
import { DateTime } from 'luxon';
import sortBy from 'lodash/sortBy';
import { getPdfText, PdfData } from './utils/pdf';
import markets, { Markets, defaultTimezones } from './market/markets';
import {
  Adjustment, Invoice, InvoiceParser, Shift,
} from './types';
import { getShiftHours } from './utils/datetime';
import { clean } from './utils/array';

const hashInvoice = (
  name: string,
  shifts: Shift[],
  adjustments: Adjustment[],
): string => new Sha256()
  .update(JSON.stringify({
    name,
    shifts,
    adjustments,
  }))
  .digest('hex');

const detectLocale = (text: string[]): keyof Markets | undefined => {
  const [locale] = (Object.entries(markets) as [keyof Markets, InvoiceParser][])
    .find(([_locale, { flags }]) => (
      flags.with.every((flag) => text
        .some((line) => line.includes(flag)))
      && (flags.not || []).every((flag) => text
        .every((line) => !line.includes(flag))))) || [];
  return locale;
};

export const parseInvoiceText = async (
  text: string[],
  knownLocale: keyof Markets | undefined = undefined,
  timezone: string | undefined = undefined,
  progress: SingleBar | null = null,
) => {
  const locale = knownLocale || detectLocale(text);

  if (locale === undefined) {
    throw new Error('No known market detected');
  }

  const zone = timezone || defaultTimezones[locale];

  let shifts: Shift[] = [];
  let adjustments: Adjustment[] = [];
  let period = {
    start: DateTime.now(),
    end: DateTime.now(),
  };
  let name = '';
  let error = '';

  const parser = markets[locale] as InvoiceParser;

  try {
    const args = { text, zone };
    const [
      parsedName, parsedPeriod, parsedShifts, parsedAdjustments,
    ] = await Promise.all([
      parser.getName(args),
      parser.getPeriod(args),
      parser.getShifts(args),
      parser.getAdjustments(args),
    ]);
    name = parsedName;
    period = parsedPeriod;
    shifts = sortBy(parsedShifts.map<Shift>((shift) => ({
      ...shift,
      hours: getShiftHours(shift.start, shift.end),
    })), (shift) => shift.start.toMillis());
    adjustments = sortBy(parsedAdjustments, ['label']);
  } catch (e) {
    const { stack, name: errorName, message } = e as Error;
    error = stack || `${errorName}: ${message}`;
  }

  if (progress) {
    progress.increment();
  }

  return {
    name,
    ...period,
    shifts,
    adjustments,
    error,
    currency: parser.currency,
    locale,
    hash: error === '' ? hashInvoice(name, shifts, adjustments) : '',
  };
};

const parseInvoicePdf = async (
  data: PdfData,
  knownLocale: keyof Markets | undefined = undefined,
  timezone: string | undefined = undefined,
  progress: SingleBar | null = null,
): Promise<Invoice> => {
  const text = await getPdfText(data);
  return parseInvoiceText(clean(text), knownLocale, timezone, progress);
};

export default parseInvoicePdf;
