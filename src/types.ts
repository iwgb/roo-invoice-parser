import { DateTime } from 'luxon';

export interface Period {
  start: DateTime,
  end: DateTime,
}

export interface SerializedPeriod {
  start: string,
  end: string,
}

export interface BaseShift {
  orders: number,
  pay: number,
  hours: number,
}

export interface Shift extends BaseShift, Period {}

export interface SerializedShift extends BaseShift, SerializedPeriod {}

export interface Adjustment {
  label: string,
  amount: number,
}

export interface BaseInvoice {
  name: string,
  adjustments: Adjustment[],
  error: string,
  hash: string,
}

export interface Invoice extends Period, BaseInvoice {
  shifts: Shift[],
}

export interface SerializedInvoice extends SerializedPeriod, BaseInvoice {
  shifts: SerializedShift[],
}

export interface InvoiceComponentGetterProps {
  text: string[],
  zone: string,
  locale: string,
}

export interface Totals {
  hours: number,
  orders: number,
  pay: number,
  adjustments: number,
}

export interface BaseWeek {
  adjustments: Adjustment[],
  totals: Totals,
}

export interface Week extends BaseWeek {
  monday: DateTime,
  shifts: Shift[],
}

export interface Month {
  start: DateTime,
  weeks: Week[],
}
