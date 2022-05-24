import { getCSSLanguageService, TextDocument } from 'vscode-css-languageservice';

const cssToTextDocument = (text: string): TextDocument => {
  return TextDocument.create('untitled://untitled', 'css', 1, text);
};

export function cssValidator(css: string) {
  const cssLS = getCSSLanguageService();
  const document = cssToTextDocument(css);
  const stylesheet = cssLS.parseStylesheet(document);
  const diagnostics = cssLS.doValidation(document, stylesheet);
  return diagnostics;
}
