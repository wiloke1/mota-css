import { pseudo as pseudoMapping } from './data';

export const getPseudo = (className: string) => {
  const pseudos = className.match(/\|\w*/g);
  if (!pseudos) {
    return '';
  }

  return pseudos.reduce((str, pseudo) => {
    const _pseudo = pseudo.replace(/^\|/g, '') as keyof typeof pseudoMapping;
    const pseudoShorthand = pseudoMapping[_pseudo] || _pseudo;
    return `${str}:${pseudoShorthand}`;
  }, '');
};
