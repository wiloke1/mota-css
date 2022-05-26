export const handleValueHasContent = (value: string) => {
  // check content: (This is a content); -> content: 'This is a content';
  return /content:\s+\(.*\)/g.test(value) ? value.replace(/\(|\)/g, `'`) : value;
};

export const getStyle = (prop: string, value: string) => {
  const result = `{ ${prop}: ${value} }`;
  return handleValueHasContent(result);
};
