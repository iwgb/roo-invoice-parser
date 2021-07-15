// eslint-disable-next-line import/prefer-default-export
export const arrayOf = (n: number): undefined[] => new Array(n).fill(undefined);

export const flattenByObjectKey = <I, J>(list: I[], getArrayValue: (item: I) => J[]) => list
  .reduce((flattened, item) => [
    ...flattened,
    ...getArrayValue(item),
  ], [] as J[]);
