import { DateTime } from 'luxon';
import {
  Invoice, Month, Period, SerializedInvoice, SerializedPeriod,
} from './types';
import { groupInvoicesByMonth, groupInvoicesInMonthByWeek } from './utils/invoice';

const castValueToDateTime = (value: string | DateTime) => (
  value instanceof DateTime
    ? value
    : DateTime.fromISO(value as string)
);

const castPeriodToDateTime = (object: Period | SerializedPeriod): Period => ({
  ...object,
  start: castValueToDateTime(object.start),
  end: castValueToDateTime(object.end),
});

const deserializeInvoices = (
  invoices: Invoice[] | SerializedInvoice[],
): Invoice[] => invoices.map((invoice) => ({
  ...invoice,
  ...castPeriodToDateTime(invoice),
  shifts: invoice.shifts.map((shift) => ({
    ...shift,
    ...castPeriodToDateTime(shift),
  })),
}));

const processInvoices = (
  inputInvoices: Invoice[] | SerializedInvoice[],
): Promise<Month[]> => new Promise((resolve, reject) => {
  try {
    resolve(groupInvoicesByMonth(deserializeInvoices(inputInvoices))
      .map(({ start, invoices }) => ({
        start,
        weeks: groupInvoicesInMonthByWeek(start, invoices),
      })));
  } catch (error) {
    reject(error);
  }
});

export default processInvoices;
