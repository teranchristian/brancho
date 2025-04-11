import branchoIcon from '@content/commentToggler/img/brancho.svg';
import { CLASSNAMES } from './constants';

export const createToggleButton = () => {
  const btn = document.createElement('button');
  btn.className = CLASSNAMES.toggleBtn;
  btn.innerHTML = `
    <span class="${CLASSNAMES.toggleIcon}">${branchoIcon}</span>
    <span class="${CLASSNAMES.toggleArrow}">▼</span>
  `;
  return btn;
};
