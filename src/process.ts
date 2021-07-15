import { Invoice, Month } from './types';
import { groupInvoicesByMonth, groupInvoicesInMonthByWeek } from './utils/invoice';

const processInvoices = (
  inputInvoices: Invoice[],
): Promise<Month[]> => new Promise((resolve, reject) => {
  try {
    resolve(groupInvoicesByMonth(inputInvoices)
      .map(({ start, invoices }) => ({
        start,
        weeks: groupInvoicesInMonthByWeek(start, invoices),
      })));
  } catch (error) {
    reject(error);
  }
});

export default processInvoices;
