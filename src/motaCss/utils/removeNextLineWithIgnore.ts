export const removeNextLineWithIgnore = (value: string) => {
  return value.replace(/@mota-css-ignore.*\n.*/g, '');
};
