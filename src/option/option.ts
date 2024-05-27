import {
  JIRA_BRANCH_CONFIG_KEY,
  JIRA_TITLE_SHORT_WORD_LIMIT,
} from '../core/constant';
import { JiraConfig, JiraTitleLengthType } from '../core/interface';

const getHTMLElementById = (id: string) =>
  document.getElementById(id) as HTMLElement;

const getRadioValue = (name: string) =>
  Array.from(
    document.getElementsByName(name) as NodeListOf<HTMLInputElement>
  ).find((radio) => radio.checked)?.value;

const toggleClass = (
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

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('mainContent') as HTMLElement;
  const loading = document.getElementById('loadingMessage') as HTMLElement;

  const issueKeyCaseRadios = document.getElementsByName(
    'issueKeyCase'
  ) as NodeListOf<HTMLInputElement>;

  const previewElement = document.getElementById('preview') as HTMLElement;
  const issueTitleBtn = document.getElementById('issueTitleBtn') as HTMLElement;

  // issue title options
  const issueTitleCaseRadios = document.getElementsByName(
    'issueTitleCase'
  ) as NodeListOf<HTMLInputElement>;

  const issueTitleUpper = document.getElementById(
    'issueTitleUpper'
  ) as HTMLInputElement;
  const issueTitleLower = document.getElementById(
    'issueTitleLower'
  ) as HTMLInputElement;

  const issueTitleLengthRadios = document.getElementsByName(
    'issueTitleLength'
  ) as NodeListOf<HTMLInputElement>;

  const issueTitleFull = document.getElementById(
    'issueTitleFull'
  ) as HTMLInputElement;
  const issueTitleShort = document.getElementById(
    'issueTitleShort'
  ) as HTMLInputElement;
  // -------

  const saveBtn = document.getElementById('save') as HTMLElement;
  const loader = document.querySelector('.loader') as HTMLElement;

  let issueTitleSelected = false;
  let savedIssueTitleCase: string | undefined = undefined;
  let savedIssueTitleLength: string | undefined = undefined;

  // Show the loading message and hide the main content
  loading.style.display = 'block';
  mainContent.classList.add('hidden');

  // Load the saved configuration
  chrome.storage.sync.get([JIRA_BRANCH_CONFIG_KEY], (result) => {
    if (!result[JIRA_BRANCH_CONFIG_KEY]) {
      console.log('No configuration found');
      return;
    }
    const config = result[JIRA_BRANCH_CONFIG_KEY] as JiraConfig;
    if (config.keyCase) {
      Array.from(issueKeyCaseRadios).forEach((radio) => {
        if (radio.value === config.keyCase) {
          radio.checked = true;
        }
      });
    }
    if (config.titleCase) {
      Array.from(issueTitleCaseRadios).forEach((radio) => {
        if (radio.value === config.titleCase) {
          radio.checked = true;
        }
      });

      Array.from(issueTitleLengthRadios).forEach((radio) => {
        if (radio.value === config.titleLength) {
          radio.checked = true;
        }
      });
    }

    if (config.includeTitle) {
      issueTitleSelected = config.includeTitle;
      issueTitleBtn.classList.toggle('selected');
    }

    if (config.includeTitle) {
      issueTitleBtn.classList.add('selected');
    } else {
      toggleIssueTitleCaseOptions(false);
    }
    // Hide the loading message and show the main content once data is loaded
    loading.style.display = 'none';
    mainContent.classList.remove('hidden');
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
    if (!enable) {
      savedIssueTitleCase = Array.from(issueTitleCaseRadios).find(
        (radio) => radio.checked
      )?.value;
      issueTitleUpper.checked = false;
      issueTitleLower.checked = false;
    } else if (typeof savedIssueTitleCase === 'string') {
      const radioToRestore = Array.from(issueTitleCaseRadios).find(
        (radio) => radio.value === savedIssueTitleCase
      );
      if (radioToRestore) radioToRestore.checked = true;
    }

    issueTitleUpper.disabled = !enable;
    issueTitleLower.disabled = !enable;
  };

  const toggleIssueTitleLengthOptions = (enable: boolean) => {
    if (!enable) {
      savedIssueTitleLength = Array.from(issueTitleLengthRadios).find(
        (radio) => radio.checked
      )?.value;
      issueTitleFull.checked = false;
      issueTitleShort.checked = false;
    } else if (typeof savedIssueTitleLength === 'string') {
      const radioToRestore = Array.from(issueTitleLengthRadios).find(
        (radio) => radio.value === savedIssueTitleLength
      );
      if (radioToRestore) radioToRestore.checked = true;
    }

    issueTitleFull.disabled = !enable;
    issueTitleShort.disabled = !enable;
  };

  issueTitleBtn.addEventListener('click', () => {
    issueTitleSelected = !issueTitleSelected;
    toggleIssueTitleCaseOptions(issueTitleSelected);
    toggleIssueTitleLengthOptions(issueTitleSelected);

    issueTitleBtn.classList.toggle('selected');
    updatePreview();
  });

  saveBtn.addEventListener('click', () => {
    // display loader
    loader.classList.add('active');

    const selectedIssueKeyCase = Array.from(issueKeyCaseRadios).find(
      (radio) => radio.checked
    )?.value;
    const selectedIssueTitleCase = Array.from(issueTitleCaseRadios).find(
      (radio) => radio.checked
    )?.value;
    const selectedIssueTitleLength = Array.from(issueTitleLengthRadios).find(
      (radio) => radio.checked
    )?.value;

    const isIssueTitleEnabled = issueTitleBtn.classList.contains('selected');

    if (!selectedIssueKeyCase) {
      alert('Please select a case option for the issue key');
      return;
    }

    if (isIssueTitleEnabled) {
      if (!selectedIssueTitleCase) {
        alert('Please select a case option for the issue title');
        return;
      }

      if (!selectedIssueTitleLength) {
        alert('Please select a length option for the issue title');
        return;
      }
    }

    const config: JiraConfig = {
      keyCase: selectedIssueKeyCase,
      titleCase: selectedIssueTitleCase ?? 'lower',
      titleLength: selectedIssueTitleLength ?? 'full',
      includeTitle: isIssueTitleEnabled,
    };

    chrome.storage.sync.set({ [JIRA_BRANCH_CONFIG_KEY]: config }, function () {
      console.log('Configuration saved');
      // add extra delay to show the loader
      setTimeout(() => {
        loader.classList.remove('active');
      }, 300);
    });
  });

  issueKeyCaseRadios.forEach((radio) =>
    radio.addEventListener('change', updatePreview)
  );
  issueTitleCaseRadios.forEach((radio) =>
    radio.addEventListener('change', updatePreview)
  );

  issueTitleLengthRadios.forEach((radio) =>
    radio.addEventListener('change', updatePreview)
  );

  updatePreview();
});
