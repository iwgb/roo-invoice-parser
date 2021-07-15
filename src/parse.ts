import hash from 'object-hash';
import { SingleBar } from 'cli-progress';
import { DateTime } from 'luxon';
import { getPdfText, PdfData } from './utils/pdf';
import markets, { Markets } from './market/markets';
import { Adjustment, Invoice, Shift } from './types';
import { getShiftHours } from './utils/datetime';

const hashInvoice = (
  name: string,
  shifts: Shift[],
): string => hash({
  name,
  shifts: shifts.map((shift) => ({
    ...shift,
    start: shift.start.toISO(),
    end: shift.end.toISO(),
  })),
});

const parseInvoice = async (
  data: PdfData,
  zone: string,
  locale: keyof Markets,
  progress: SingleBar | null = null,
): Promise<Invoice> => {
  const text = await getPdfText(data);

  let shifts: Shift[] = [];
  let adjustments: Adjustment[] = [];
  let period = {
    start: DateTime.now(),
    end: DateTime.now(),
  };
  let name = '';
  let error = '';

  const parser = markets[locale];

  try {
    const args = { text, zone };
    const [
      parsedName, parsedPeriod, parsedAdjustments, parsedShifts,
    ] = await Promise.all([
      parser.getName(args),
      parser.getPeriod(args),
      parser.getAdjustments(args),
      parser.getShifts(args),
    ]);
    name = parsedName;
    period = parsedPeriod;
    adjustments = parsedAdjustments;
    shifts = parsedShifts.map((shift) => ({
      ...shift,
      hours: getShiftHours(shift.start, shift.end),
    }));
  } catch (e) {
    error = `${e.name}: ${e.message}`;
  }

  if (progress) {
    progress.increment();
  }

  return {
    ...period,
    shifts,
    adjustments,
    error,
    hash: hashInvoice(name, shifts),
  };
};

export default parseInvoice;
