export const getStyle = (prop: string, value: string) => {
  const result = `{ ${prop}: ${value} }`;
  // check content: (This is a content); -> content: 'This is a content';
  if (/content:\s+\(.*\)/g.test(result)) {
    return result.replace(/\(|\)/g, `'`);
  }
  return result;
};
