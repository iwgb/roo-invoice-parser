import { DateTime } from 'luxon';
import {
  Adjustment, Invoice, Shift, Totals,
} from '../types';
import { flattenByObjectKey } from './array';
import { round } from './math';

const NOT_FOUND = -1;

const flattenAdjustments = (adjustments: Adjustment[]) => adjustments
  .reduce((adjustmentsList, adjustment) => {
    const existingAdjustmentIndex = adjustmentsList
      .findIndex(({ label }) => label === adjustment.label);
    return existingAdjustmentIndex === NOT_FOUND
      ? [
        ...adjustmentsList,
        adjustment,
      ]
      : [
        ...adjustmentsList.slice(0, existingAdjustmentIndex),
        ...adjustmentsList.slice(existingAdjustmentIndex + 1),
        {
          label: adjustmentsList[existingAdjustmentIndex].label,
          amount: adjustmentsList[existingAdjustmentIndex].amount + adjustment.amount,
        },
      ];
  }, [] as Adjustment[]);

const getTotals = (shifts: Shift[], adjustments: Adjustment[] = []): Totals => {
  const shiftTotals = shifts.reduce((runningTotals, shift) => ({
    hours: runningTotals.hours + (shift.hours || 0),
    orders: runningTotals.orders + shift.orders,
    pay: runningTotals.pay + shift.pay,
  }), {
    hours: 0,
    orders: 0,
    pay: 0,
  });
  return {
    hours: round(shiftTotals.hours),
    orders: shiftTotals.orders,
    pay: round(shiftTotals.pay),
    adjustments: adjustments.reduce((total, { amount }) => total + amount, 0),
  };
};

// eslint-disable-next-line import/prefer-default-export
export const flattenInvoicesByWeek = (startOfWeek: DateTime, allInvoices: Invoice[]) => {
  const endOfWeek = startOfWeek.endOf('week');
  const invoices = allInvoices
    .filter(({ start }) => start.hasSame(startOfWeek, 'week'))
    .map<Invoice>((invoice) => ({
      ...invoice,
      shifts: invoice.shifts.map((shift) => ({
        ...shift,
        start: shift.start < startOfWeek
          ? startOfWeek
          : shift.start,
        end: shift.end > endOfWeek
          ? endOfWeek
          : shift.end,
      })),
    }));
  const shifts = flattenByObjectKey<Invoice, Shift>(invoices, (invoice) => invoice.shifts);
  const adjustments = flattenAdjustments(
    flattenByObjectKey<Invoice, Adjustment>(invoices, (invoice) => invoice.adjustments),
  );
  const totals = getTotals(shifts, adjustments);
  return {
    shifts,
    adjustments,
    totals,
  };
};
