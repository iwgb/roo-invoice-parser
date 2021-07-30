import { sha256 as Sha256 } from 'sha.js';
import { SingleBar } from 'cli-progress';
import { DateTime } from 'luxon';
import sortBy from 'lodash/sortBy';
import { getPdfText, PdfData } from './utils/pdf';
import markets, { InvoiceParser, Markets, defaultTimezones } from './market/markets';
import { Adjustment, Invoice, Shift } from './types';
import { getShiftHours } from './utils/datetime';

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

const parseInvoice = async (
  data: PdfData,
  locale: keyof Markets,
  timezone: string | undefined = undefined,
  progress: SingleBar | null = null,
): Promise<Invoice> => {
  const text = await getPdfText(data);
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
    const args = { text, zone, locale };
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
    error = e.stack || `${e.name}: ${e.message}`;
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
    hash: error === '' ? hashInvoice(name, shifts, adjustments) : '',
  };
};

export default parseInvoice;
