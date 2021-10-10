import fs from 'fs';
import asyncFs from 'fs/promises';
import path from 'path';
import { parseInvoiceText } from '../dist/parse';

const markets = fs.readdirSync(path.resolve(__dirname, './market/'));

markets.forEach((market) => {
  const marketName = market.split('.')[0];
  it(`should correctly parse ${marketName}`, async () => {
    const marketData = JSON.parse(await asyncFs.readFile(path.resolve(__dirname, './market/', market), 'utf-8'));
    expect(await parseInvoiceText(marketData))
      .toMatchSnapshot(marketName);
  });
});
