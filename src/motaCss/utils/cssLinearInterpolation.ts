export const cssLinearInterpolation = (value: Record<number, number>) => {
  const keys = Object.keys(value);
  const values = Object.values(value);
  if (keys.length !== 2) {
    throw new Error('cssLinearInterpolation() value must be exactly 2 values');
  }
  // The slope
  const m = (values[1] - values[0]) / (Number(keys[1]) - Number(keys[0]));
  // The y-intercept
  let b = values[0] - m * Number(keys[0]);
  // Determine if the sign should be positive or negative
  let sign = '+';

  if (b < 0) {
    sign = '-';
    b = Math.abs(b);
  }

  return `${m * 100}vw ${sign} ${b}px`;
};
