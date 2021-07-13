import { Moment } from 'moment';
import hash from 'object-hash';
import { getPdfText, PdfData } from './utils/pdf';
import markets, { Markets } from './market/markets';

export interface Shift {
  start: Moment,
  end: Moment,
  orders: number,
  pay: number,
}

export interface Adjustment {
  label: string,
  amount: number,
}

export interface Invoice {
  start: Moment | null,
  end: Moment | null,
  shifts: Shift[],
  adjustments: Adjustment[],
  error: string,
  hash: string,
}

export interface InvoiceComponentGetterProps {
  text: string[],
  timezone: string,
}

const hashInvoice = (
  name: string,
  shifts: Shift[],
): string => hash({
  name,
  shifts: shifts.map((shift) => ({
    ...shift,
    start: shift.start.toISOString(),
    end: shift.end.toISOString(),
  })),
});

export const parseInvoice = async (
  data: PdfData,
  timezone: string,
  locale: keyof Markets,
): Promise<Invoice> => {
  const text = await getPdfText(data);

  let shifts: Shift[] = [];
  let adjustments: Adjustment[] = [];
  let period: {
    start: Moment | null,
    end: Moment | null,
  } = {
    start: null,
    end: null,
  };
  let name = '';
  let error = '';

  const parser = markets[locale];

  try {
    const args = { text, timezone };
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
    shifts = parsedShifts;
    adjustments = parsedAdjustments;
  } catch (e) {
    error = `${e.name}: ${e.message}`;
  }

  return {
    ...period,
    shifts,
    adjustments,
    error,
    hash: hashInvoice(name, shifts),
  };
};
