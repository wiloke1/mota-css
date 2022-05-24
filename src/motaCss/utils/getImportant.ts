export const getImportant = (className: string) => {
  return /!/g.test(className) ? ' !important' : '';
};
