import style from '@content/commentToggler/html/toggler.css';

export const styleInjector = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = style;
  document.head.appendChild(styleElement);
}