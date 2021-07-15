import { DateTime, Interval } from 'luxon';
import { Invoice } from '../types';
import { mondaysInInterval } from './datetime';
import { flattenInvoicesByWeek } from './stats';

export const groupInvoicesInMonthByWeek = (
  start: DateTime,
  invoices: Invoice[],
) => mondaysInInterval(Interval.fromDateTimes(start, start.endOf('month').endOf('week')))
  .map((monday) => ({
    monday,
    ...flattenInvoicesByWeek(monday, invoices),
  }));

export const groupInvoicesByMonth = (invoices: Invoice[]) => invoices.reduce((months, invoice) => {
  const lastMonth = months.slice(-1)[0];
  return (
    lastMonth !== undefined
    && lastMonth.start.hasSame(invoice.start.startOf('week'), 'month')
  )
    ? [
      ...months.slice(0, -1),
      {
        start: lastMonth.start,
        invoices: [
          ...lastMonth.invoices,
          invoice,
        ],
      },
    ]
    : [
      ...months,
      {
        start: invoice.start.startOf('month'),
        invoices: [invoice],
      },
    ];
}, [] as { start: DateTime, invoices: Invoice[] }[]);
