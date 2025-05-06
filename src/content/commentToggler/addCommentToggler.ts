import { CLASSNAMES, SELECTORS } from './constants';
import { createToggleButton } from './createToggleButton';
import { toggleListeners } from './toggleListeners';

export const addCommentToggler = (commentElements: NodeListOf<Element>) => {
  commentElements.forEach(td => {
    if (td.classList.contains(CLASSNAMES.handled)) {
      return;
    }

    td.classList.add(CLASSNAMES.handled);

    const wrapper = document.createElement('div');
    wrapper.className = CLASSNAMES.wrapper;

    while (td.firstChild) {
      const child = td.firstChild as HTMLElement;
      child.classList?.add?.(CLASSNAMES.child);
      wrapper.appendChild(child);
    }

    const btn = createToggleButton();
    wrapper.appendChild(btn);
    td.appendChild(wrapper);

    const arrow = btn.querySelector(`.${CLASSNAMES.toggleArrow}`)!;
    btn.addEventListener('click', () => {
      td.classList.toggle(CLASSNAMES.collapsed);
      btn.classList.toggle(CLASSNAMES.collapsed);
      arrow.textContent = td.classList.contains(CLASSNAMES.collapsed) ? '►' : '▼';
    });
  });

  document.querySelectorAll(SELECTORS.diffTable).forEach(toggleListeners);
};
