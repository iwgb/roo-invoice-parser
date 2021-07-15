import { DateTime } from 'luxon';
import {
  BaseInvoice, BaseShift, BaseWeek, Invoice, Month, Shift, Week,
} from '../types';

interface SerializablePeriod {
  start: string,
  end: string,
}

interface SerializableShift extends BaseShift, SerializablePeriod {}

interface SerializableInvoice extends BaseInvoice, SerializablePeriod {
  shifts: SerializableShift[],
}

interface SerializableWeek extends BaseWeek {
  monday: string,
  shifts: SerializableShift[],
}

interface SerializableMonth {
  start: string,
  weeks: SerializableWeek[],
}

const shiftSerializer = {
  toDateTime: (shift: SerializableShift): Shift => {
    const start = DateTime.fromISO(shift.start);
    const end = DateTime.fromISO(shift.end);
    return {
      ...shift,
      start,
      end,
    };
  },
  toSerializable: (shift: Shift): SerializableShift => ({
    ...shift,
    start: shift.start.toISO(),
    end: shift.end.toISO(),
  }),
};

export const invoiceSerializer = {
  toDateTime: (invoices: SerializableInvoice[]) => invoices
    .map<Invoice>((invoice) => ({
      ...invoice,
      start: DateTime.fromISO(invoice.start),
      end: DateTime.fromISO(invoice.end),
      shifts: invoice.shifts.map<Shift>(shiftSerializer.toDateTime),
    })),
  toSerializable: (invoices: Invoice[]) => invoices
    .map<SerializableInvoice>((invoice) => ({
      ...invoice,
      start: invoice.start.toISO(),
      end: invoice.end.toISO(),
      shifts: invoice.shifts.map(shiftSerializer.toSerializable),
    })),
};

const weekSerializer = {
  toSerializable: (week: Week): SerializableWeek => ({
    ...week,
    monday: week.monday.toISO(),
    shifts: week.shifts.map(shiftSerializer.toSerializable),
  }),
};

export const monthSerializer = {
  toSerializable: (months: Month[]) => months
    .map<SerializableMonth>((month) => ({
      start: month.start.toISO(),
      weeks: month.weeks.map(weekSerializer.toSerializable),
    })),
};
