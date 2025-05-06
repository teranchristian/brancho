import { CLASSNAMES, SELECTORS } from './constants';

export const toggleListeners = (table: Element) => {
  if (table.classList.contains(CLASSNAMES.listenersAttached)) {
    return;
  }

  const toggleVisibility = (e: Event, visible: boolean) => {
    const target = (e.target as HTMLElement).closest(SELECTORS.targetCell);
    if (!target) {
      return;
    }

    table.querySelectorAll<HTMLElement>(SELECTORS.toggleBtn)
      .forEach(btn => (btn.style.visibility = visible ? 'visible' : 'hidden'));
  };

  table.addEventListener('mouseover', e => toggleVisibility(e, true));
  table.addEventListener('mouseout', e => toggleVisibility(e, false));
  table.classList.add(CLASSNAMES.listenersAttached);
};
