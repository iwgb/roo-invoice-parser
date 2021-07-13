#!/usr/bin/env node
import yargs from 'yargs';
import fs from 'fs/promises';
import markets, { Markets } from './market/markets';
import { parseInvoice } from './parse';

const localeChoices = Object.keys(markets) as Array<keyof Markets>;

const { path, timezone, locale } = yargs
  .options({
    path: {
      alias: 'p',
      type: 'string',
      demandOption: true,
      describe: 'Invoice PDF file, or directory of invoice PDFs',
    },
    timezone: {
      alias: 't',
      type: 'string',
      describe: 'Main timezone (not DST) that the work was performed in',
      default: 'UTC',
    },
    locale: {
      alias: 'l',
      type: 'string',
      describe: 'Invoice locale',
      choices: localeChoices,
      default: localeChoices[0],
    },
  })
  .parseSync();

(async () => {
  const pathStat = await fs.lstat(path);
  const invoicePaths = pathStat.isDirectory()
    ? (
      (await fs.readdir(path, { withFileTypes: true }))
        .filter((dirent) => (
          dirent.isFile()
          && dirent.name.slice(0, 1) !== '.'
        ))
        .map(({ name }) => `${path}/${name}`)
    )
    : [path];
  const invoices = await Promise.all(invoicePaths.map(async (invoicePath) => parseInvoice(
    await fs.readFile(invoicePath),
    timezone,
    locale,
  )));
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(invoices.map((invoice) => ({
    ...invoice,
    start: invoice.start?.toISOString(),
    end: invoice.start?.toISOString(),
  }))));
})();
