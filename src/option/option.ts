import {
  JIRA_BRANCH_CONFIG_KEY,
  JIRA_TITLE_SHORT_WORD_LIMIT,
} from '../core/constant';
import { JiraConfig, JiraTitleLengthType } from '../core/interface';
import {
  getHTMLElementById,
  getHTMLElementByName,
  toggleClass,
  setRadioValue,
  getSelectedValueFromRadios,
  changeCase,
  formatTitle,
  addChangeEvent,
  toggleRadioOptions,
} from './helper';
import { onSave } from './saveConfig';

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = getHTMLElementById('mainContent');
  const loading = getHTMLElementById('loadingMessage');
  const previewElement = getHTMLElementById('preview');
  const issueTitleBtn = getHTMLElementById('issueTitleBtn');

  const issueKeyCaseRadios = getHTMLElementByName('issueKeyCase');

  // issue title options
  const issueTitleCaseRadios = getHTMLElementByName('issueTitleCase');

  const issueTitleUpper = getHTMLElementById(
    'issueTitleUpper'
  ) as HTMLInputElement;
  const issueTitleLower = getHTMLElementById(
    'issueTitleLower'
  ) as HTMLInputElement;

  const issueTitleLengthRadios = document.getElementsByName(
    'issueTitleLength'
  ) as NodeListOf<HTMLInputElement>;

  const issueTitleFull = getHTMLElementById(
    'issueTitleFull'
  ) as HTMLInputElement;
  const issueTitleShort = getHTMLElementById(
    'issueTitleShort'
  ) as HTMLInputElement;
  // -------

  const saveBtn = document.getElementById('save') as HTMLElement;
  const loader = document.querySelector('.loader') as HTMLElement;

  let issueTitleSelected = false;
  let savedIssueTitleCase: string | undefined = undefined;
  let savedIssueTitleLength: string | undefined = undefined;

  // Show the loading message and hide the main content
  toggleClass(loading, 'block', true);
  toggleClass(mainContent, 'hidden', true);

  // Load the saved configuration
  chrome.storage.sync.get([JIRA_BRANCH_CONFIG_KEY], (result) => {
    if (!result[JIRA_BRANCH_CONFIG_KEY]) {
      console.log('No configuration found');
      return;
    }
    const config = result[JIRA_BRANCH_CONFIG_KEY] as JiraConfig;
    if (config.keyCase) {
      setRadioValue(issueKeyCaseRadios, config.keyCase);
    }

    if (config.titleCase) {
      setRadioValue(issueTitleCaseRadios, config.titleCase);
      setRadioValue(issueTitleLengthRadios, config.titleLength);
    }

    issueTitleSelected = config.includeTitle;
    toggleClass(issueTitleBtn, 'selected', config.includeTitle);

    // Disable the issue title options if the issue title is no enable
    if (!config.includeTitle) {
      toggleIssueTitleCaseOptions(false);
      toggleIssueTitleLengthOptions(false);
    }

    // Hide the loading message and show the main content once data is loaded
    toggleClass(loading, 'none', false);
    toggleClass(mainContent, 'hidden', false);
    updatePreview();
  });

  const updatePreview = () => {
    let issueKey = 'ABC-3504';
    let delimiter = '-';
    let issueTitle = 'foo-bar-tico-baz-pants-quz-ufo';

    const selectedIssueKeyCase = Array.from(issueKeyCaseRadios).find(
      (radio) => radio.checked
    )?.value;
    const selectedIssueTitleCase = Array.from(issueTitleCaseRadios).find(
      (radio) => radio.checked
    )?.value;

    const selectedIssueTitleLength = Array.from(issueTitleLengthRadios).find(
      (radio) => radio.checked
    )?.value;

    if (selectedIssueKeyCase === 'upper') issueKey = issueKey.toUpperCase();
    if (selectedIssueKeyCase === 'lower') issueKey = issueKey.toLowerCase();

    if (selectedIssueTitleCase === 'upper')
      issueTitle = issueTitle.toUpperCase();
    if (selectedIssueTitleCase === 'lower')
      issueTitle = issueTitle.toLowerCase();

    if (selectedIssueTitleLength === JiraTitleLengthType.SHORT) {
      issueTitle = issueTitle
        .split('-')
        .slice(0, JIRA_TITLE_SHORT_WORD_LIMIT)
        .join('-');
    }
    if (selectedIssueTitleLength === 'full') {
      issueTitle = issueTitle;
    }

    if (!issueTitleBtn.classList.contains('selected')) {
      delimiter = '';
      issueTitle = '';
    }
    previewElement.textContent = `${issueKey}${delimiter}${issueTitle}`;
  };

  const toggleIssueTitleCaseOptions = (enable: boolean) => {
    savedIssueTitleCase = toggleRadioOptions(
      enable,
      issueTitleCaseRadios,
      savedIssueTitleCase,
      issueTitleUpper,
      issueTitleLower
    );
  };

  const toggleIssueTitleLengthOptions = (enable: boolean) => {
    savedIssueTitleLength = toggleRadioOptions(
      enable,
      issueTitleLengthRadios,
      savedIssueTitleLength,
      issueTitleFull,
      issueTitleShort
    );
  };

  issueTitleBtn.addEventListener('click', () => {
    issueTitleSelected = !issueTitleSelected;
    toggleIssueTitleCaseOptions(issueTitleSelected);
    toggleIssueTitleLengthOptions(issueTitleSelected);

    issueTitleBtn.classList.toggle('selected');
    updatePreview();
  });

  saveBtn.addEventListener('click', () => {
    onSave(
      loader,
      issueKeyCaseRadios,
      issueTitleCaseRadios,
      issueTitleLengthRadios,
      issueTitleBtn,
      getSelectedValueFromRadios
    );
  });
  addChangeEvent(issueKeyCaseRadios, updatePreview);
  addChangeEvent(issueTitleCaseRadios, updatePreview);
  addChangeEvent(issueTitleLengthRadios, updatePreview);

  updatePreview();
});
