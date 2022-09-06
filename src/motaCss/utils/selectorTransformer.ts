export const selectorTransformer = (selector: string) => {
  return (
    selector
      .replace(/\|/g, '\\|')
      .replace(/,/g, '\\,')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/\?/g, '\\?')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/\//g, '\\/')
      .replace(/\.\w*:/g, value => value.replace(/:/g, '\\:'))
      .replace(/;/g, '\\;')
      .replace(/@/g, '\\@')
      .replace(/#/g, '\\#')
      .replace(/'/g, "\\'")
      .replace(/"/g, `\\"`)
      .replace(/%/g, `\\%`)
      .replace(/\+/g, `\\+`)
      .replace(/>/g, `\\>`)
      .replace(/!/g, `\\!`)
      .replace(/`/g, '\\`')
      .replace(/\.\d/g, value => '\\' + value)
      .replace(/\^/g, '\\^')
      // Fix pseudo nth-child, nth-last-child, nth-of-type, nth-last-of-type, lang...
      .replace(/(-child|-type|:lang)\\\([\w-+\\]*\\\)/g, value => {
        const valNumber = value.replace(/.*\\\(|\\\)/g, '').replace(/_|\\/g, ' ');
        return value.replace(/\\\(.*/g, `(${valNumber})`);
      })
  );
};
