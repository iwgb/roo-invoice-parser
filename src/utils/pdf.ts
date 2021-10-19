import { arrayOf } from './array';

const pdf: typeof import('pdfjs-dist') = require('pdfjs-dist/legacy/build/pdf');

export type PdfData = Int8Array | Uint8Array | Uint8ClampedArray |
  Int16Array | Uint16Array |
  Int32Array | Uint32Array | Float32Array |
  Float64Array |
  string;

export const getPdfText = async (data: PdfData): Promise<string[]> => {
  const invoice = await pdf.getDocument({ data }).promise;

  const textLinesByPage = await Promise.all<string[]>(
    arrayOf(invoice.numPages).map(async (_page, i: number) => {
      const page = await invoice.getPage(i + 1);
      const textContent = await page.getTextContent();
      return textContent.items
        .slice(0, -1)
        .map((text) => (text as any).str);
    }),
  );

  return textLinesByPage.reduce((text: Array<string>, textOnPage: Array<string>) => [
    ...text,
    ...textOnPage,
  ], []);
};
