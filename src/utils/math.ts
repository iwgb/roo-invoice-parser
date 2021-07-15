// eslint-disable-next-line import/prefer-default-export
export const round = (n: number, dp: number = 2) => Math
  .round((n + Number.EPSILON) * (10 ** dp)) / (10 ** dp);
