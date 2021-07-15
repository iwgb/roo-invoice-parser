#!/usr/bin/env node
/* eslint-disable no-console */
import yargs from 'yargs';
import fs from 'fs/promises';
import cliProgress from 'cli-progress';
import markets, { Markets } from './market/markets';
import { parseInvoice } from './parse';
import { processInvoices } from './process';
import {
  invoiceSerializer,
  monthSerializer,
} from './utils/serializable';

const localeChoices = Object.keys(markets) as Array<keyof Markets>;

const {
  path, timezone, locale, output, weeks,
} = yargs
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
    output: {
      alias: 'o',
      type: 'string',
      describe: 'An output file. If omitted, output is sent to stdout',
      default: '',
    },
    weeks: {
      alias: 'w',
      type: 'boolean',
      describe: 'Process the output into months and working weeks',
      default: false,
    },
  })
  .parseSync();

const progress = new cliProgress.Bar({ clearOnComplete: true }, cliProgress.Presets.shades_classic);

(async () => {
  const pathStat = await fs.lstat(path);
  const invoicePaths = pathStat.isDirectory()
    ? (
      (await fs.readdir(path, { withFileTypes: true }))
        .filter((dirent) => (
          dirent.isFile()
          && dirent.name.split('.').slice(-1)[0].toLowerCase() === 'pdf'
        ))
        .map(({ name }) => `${path}/${name}`)
    )
    : [path];

  if (output) {
    progress.start(invoicePaths.length, 0);
  }

  const invoices = await Promise.all(invoicePaths.map(async (invoicePath) => parseInvoice(
    await fs.readFile(invoicePath),
    timezone,
    locale,
    output ? progress : null,
  )));

  const result = weeks
    ? monthSerializer.toSerializable(await processInvoices(invoices))
    : invoiceSerializer.toSerializable(invoices);

  if (output) {
    progress.stop();
    await fs.writeFile(output, JSON.stringify(result));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
})();
