export const selectorTransformer = (selector: string) => {
  return selector
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
    .replace(/\^/g, '\\^');
};
