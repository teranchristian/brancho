import { JIRA_TITLE_SHORT_WORD_LIMIT } from '../core/constant';
import { JiraTitleLengthType } from '../core/interface';

export const getHTMLElementById = (id: string) =>
  document.getElementById(id) as HTMLElement;

export const getHTMLElementByName = (name: string) =>
  document.getElementsByName(name) as NodeListOf<HTMLInputElement>;

export const toggleClass = (
  element: HTMLElement,
  className: string,
  condition: boolean
) => {
  if (condition) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
};

export const getSelectedValueFromRadios = (
  radios: NodeListOf<HTMLInputElement>
) => Array.from(radios).find((radio) => radio.checked)?.value;

export const formatTitle = (title: string, lengthType: string) => {
  if (lengthType === JiraTitleLengthType.SHORT) {
    return title.split('-').slice(0, JIRA_TITLE_SHORT_WORD_LIMIT).join('-');
  }
  return title;
};

export const changeCase = (str: string, caseType: string) => {
  if (caseType === 'upper') return str.toUpperCase();
  if (caseType === 'lower') return str.toLowerCase();
  return str;
};

export const setRadioValue = (
  radios: NodeListOf<HTMLInputElement>,
  value: string
) => {
  Array.from(radios).forEach((radio) => {
    radio.checked = radio.value === value;
  });
};

export const addChangeEvent = (
  radios: NodeListOf<HTMLInputElement>,
  callback: () => void
) => {
  radios.forEach((radio) => radio.addEventListener('change', callback));
};

export const toggleRadioOptions = (
  enable: boolean,
  radios: NodeListOf<HTMLInputElement>,
  savedValue: string | undefined,
  radio1: HTMLInputElement,
  radio2: HTMLInputElement
) => {
  let savedRadioValue;
  if (!enable) {
    savedRadioValue = Array.from(radios).find((radio) => radio.checked)?.value;
    radio1.checked = false;
    radio2.checked = false;
  } else if (typeof savedValue === 'string') {
    const radioToRestore = Array.from(radios).find(
      (radio) => radio.value === savedValue
    );
    if (radioToRestore) radioToRestore.checked = true;
  }

  radio1.disabled = !enable;
  radio2.disabled = !enable;
  return savedRadioValue;
};
