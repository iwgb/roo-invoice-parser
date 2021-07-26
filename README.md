# `roo-invoice-parser`

A parser for food delivery courier invoices.

## We are the IWGB
We're a new and dynamic independent trade union. From our roots representing migrant workers, we’ve evolved to taking on the bosses of the so-called gig economy and government regulators, representing under-unionised and under-represented workforces.

[iwgb.org.uk](https://iwgb.org.uk) · [Donate](https://iwgb.org.uk/donate)

## Install
In an NPM project
```
npm i @iwgb/roo-invoice-parser
```

Globally on your device
```
npm i @g @iwgb/roo-invoice-parser
```

## Usage

### Parsing
Returns data as parsed from the invoice. The invoice hash is calculated from the name on the invoice and the shifts billed.
```js
import { parseInvoice } from 'roo-invoice-parser';

const invoice = await parseInvoice(pdfData, timezone, locale);

console.log(invoice);
```

```json
[
    {
        "name": "Sample Text",
        "start": "2021-07-13T00:00:00.000+01:00",
        "end": "2021-07-14T23:59:59.999+01:00",
        "shifts": [
            {
                "start": "2021-07-13T19:00:00.000+01:00",
                "end": "2021-07-13T21:09:00.000+01:00",
                "orders": 5,
                "pay": 22.43
            }
        ],
        "adjustments": [
            {
                "label": "Tips",
                "amount": 3
            },
            {
                "label": "Transaction fee",
                "amount": -0.5
            }
        ],
        "error": "",
        "hash": "d805386e7dd4b8888a6ed1362a9e05e7976899dd"
    }
]
```

Timestamps are returned as instances of the Luxon DateTime (the package is a peer dependency).

| Parameter  | Default   | Description                                                                                                                                                                                                |
|------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `pdfData`  | Required  | The PDF data, as a raw string or [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)                                                                 |
| `timezone` | `'UTC'`   | The [identifier](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for the timezone that the work was performed in. The parser will interpret timestamps on the PDF as being in this timezone. |
| `locale`   | `'en-GB'` | The market locale of the invoice. The parser only supports certain market locales - see below.                                                                                                             |

### Processing
Group invoice data by week and month.

Provide invoice data in the format above, as returned by the parser. Timestamps should be ISO strings, or instances of the Luxon DateTime.

```js
import { processInvoices } from 'roo-invoice-parser';

const data = await processInvoices(invoices);

console.log(data);
```

```json
[
  {
    "start": "2020-07-01T00:00:00.000+01:00",
    "weeks": [
      {
        "monday": "2020-07-19T00:00:00.000+01:00",
        "shifts": [
          {
            "start": "2020-07-20T15:52:00.000+01:00",
            "end": "2020-07-20T19:02:00.000+01:00",
            "orders": 7,
            "pay": 33.21,
            "hours": 3.17
          }
        ],
        "adjustments": [
          {
            "label": "Tips",
            "amount": 4
          }
        ],
        "totals": {
          "hours": 3.17,
          "orders": 7,
          "pay": 33.21,
          "adjustments": 4
        }
      }
    ]
  }
]
```

## CLI
```
rooparse -p /path/to/pdf -t Europe/London -l en-GB
```
| Flag            | Default   | Description                                                                                                                                                                                                |
|-----------------|-----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `-p --path`     | Required  | Path to an invoice PDF, or a directory of invoice PDFs                                                                                                                                                     |
| `-t --timezone` | `'UTC'`   | The [identifier](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) for the timezone that the work was performed in. The parser will interpret timestamps on the PDF as being in this timezone. |
| `-l --locale`   | `'en-GB'` | The market locale of the invoice. The parser only supports certain market locales - see below.                                                                                                             |
| `-o --output`   |           | If given, writes to the specified file (otherwise, to stdout).                                                                                                                                             |
| `-w --weeks`    |           | If given, formats the output in weeks (see *processing* above)                                                                                                                                             |

## Markets
Currently supported markets:
* en-GB

We're always expanding the markets the parser works in. If you'd like to add support for a new market, raise a PR and we'll get in touch so you can securely provide us with your test data.

## Licensing
You're free to use this software for your own non-commercial purposes, as a member of the rider community or otherwise. If you share the work, you must do so in the same manner, give appropriate credit and indicate your changes (if any). For more details, see the license in LICENSE.

>This summary is not a license and has no legal value. You should carefully review all of the terms and conditions of the actual license before using the licensed material.

If this doesn't suit your requirements, get in touch with us.
