#`roo-invoice-parser`
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

```js
import { parseInvoice } from 'roo-invoice-parser';

const invoice = await parseInvoice(pdfData, timezone, locale);

console.log(invoice);
```

```json
[
    {
        "start": "2021-07-13T00:00:00.000Z",
        "end": "2021-07-15T00:00:00.000Z",
        "shifts": [
            {
                "start": "2021-07-13T19:00:00.000Z",
                "end": "2021-07-13T21:09:00.000Z",
                "orders": 5,
                "pay": 22.43
            },
            {
                "start": "2021-07-14T17:59:00.000Z",
                "end": "2021-07-14T21:05:00.000Z",
                "orders": 4,
                "pay": 20.68
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

| Parameter  | Default   | Description                                                                                                                                |
|------------|-----------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `pdfData`  | Required  | The PDF data, as a raw string or [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) |
| `timezone` | `'UTC'`   | The timezone that the work was performed in. The parser will interpret timestamps on the PDF as being in this timezone.                    |
| `locale`   | `'en-GB'` | The market locale of the invoice. The parser only supports certain market locales - see below.                                             |

## CLI
```
rooparse -p /path/to/pdf -t UTC -l en-GB
```
| Flag            | Default   | Description                                                                                                             |
|-----------------|-----------|-------------------------------------------------------------------------------------------------------------------------|
| `-p --path`     | Required  | Path to an invoice PDF, or a directory of invoice PDFs                                                                  |
| `-t --timezone` | `'UTC'`   | The timezone that the work was performed in. The parser will interpret timestamps on the PDF as being in this timezone. |
| `-l --locale`   | `'en-GB'` | The market locale of the invoice. The parser only supports certain market locales - see below.                          |

## Markets
Currently supported markets:
* en-GB

We're always expanding the markets the parser works in. If you'd like to add support for a new market, raise a PR and we'll get in touch so you can securely provide us with your test data.

## Licensing
You're free to use this software for your own non-commercial purposes, as a member of the rider community or otherwise. For more details, see the license in LICENSE.