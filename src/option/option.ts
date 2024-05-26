const getHTMLElementById = (id: string) =>
  document.getElementById(id) as HTMLElement;

document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.getElementById('mainContent') as HTMLElement;
  const loading = document.getElementById('loadingMessage') as HTMLElement;

  const issueKeyCaseRadios = document.getElementsByName(
    'issueKeyCase'
  ) as NodeListOf<HTMLInputElement>;
  const issueSummaryCaseRadios = document.getElementsByName(
    'issueSummaryCase'
  ) as NodeListOf<HTMLInputElement>;
  const previewElement = document.getElementById('preview') as HTMLElement;
  const issueSummaryBtn = document.getElementById(
    'issueSummaryBtn'
  ) as HTMLElement;
  const issueKeyUpper = document.getElementById(
    'issueSummaryUpper'
  ) as HTMLInputElement;
  const issueKeyLower = document.getElementById(
    'issueSummaryLower'
  ) as HTMLInputElement;
  const saveBtn = document.getElementById('save') as HTMLElement;
  const loader = document.querySelector('.loader') as HTMLElement;

  let issueTitleSelected = false;
  let savedIssueSummaryCase: string | undefined = undefined;

  // Show the loading message and hide the main content
  loading.style.display = 'block';
  mainContent.classList.add('hidden');

  const JIRA_BRANCH_CONFIG_KEY = 'jiraBranchConfig';

  // Load the saved configuration
  chrome.storage.sync.get([JIRA_BRANCH_CONFIG_KEY], (result) => {
    if (!result[JIRA_BRANCH_CONFIG_KEY]) {
      console.log('No configuration found');
      return;
    }
    const config = result[JIRA_BRANCH_CONFIG_KEY];
    if (config.issueCase) {
      Array.from(issueKeyCaseRadios).forEach((radio) => {
        if (radio.value === config.issueCase) {
          radio.checked = true;
        }
      });
    }
    if (config.titleCase) {
      Array.from(issueSummaryCaseRadios).forEach((radio) => {
        if (radio.value === config.titleCase) {
          radio.checked = true;
        }
      });
    }

    if (config.includeTitle) {
      issueTitleSelected = config.includeTitle;
      issueSummaryBtn.classList.toggle('selected');
    }

    if (config.includeTitle) {
      issueSummaryBtn.classList.add('selected');
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
    let issueSummary = '-new-adcampaign-endpoint';

    const selectedIssueKeyCase = Array.from(issueKeyCaseRadios).find(
      (radio) => radio.checked
    )?.value;
    const selectedIssueSummaryCase = Array.from(issueSummaryCaseRadios).find(
      (radio) => radio.checked
    )?.value;

    if (selectedIssueKeyCase === 'upper') issueKey = issueKey.toUpperCase();
    if (selectedIssueKeyCase === 'lower') issueKey = issueKey.toLowerCase();
    if (selectedIssueSummaryCase === 'upper')
      issueSummary = issueSummary.toUpperCase();
    if (selectedIssueSummaryCase === 'lower')
      issueSummary = issueSummary.toLowerCase();

    if (!issueSummaryBtn.classList.contains('selected')) {
      issueSummary = '';
    }
    previewElement.textContent = `${issueKey}${issueSummary}`;
  };

  const toggleIssueTitleCaseOptions = (enable: boolean) => {
    if (!enable) {
      savedIssueSummaryCase = Array.from(issueSummaryCaseRadios).find(
        (radio) => radio.checked
      )?.value;
      issueKeyUpper.checked = false;
      issueKeyLower.checked = false;
    } else if (typeof savedIssueSummaryCase === 'string') {
      const radioToRestore = Array.from(issueSummaryCaseRadios).find(
        (radio) => radio.value === savedIssueSummaryCase
      );
      if (radioToRestore) radioToRestore.checked = true;
    }

    issueKeyUpper.disabled = !enable;
    issueKeyLower.disabled = !enable;
  };

  issueSummaryBtn.addEventListener('click', () => {
    issueTitleSelected = !issueTitleSelected;
    toggleIssueTitleCaseOptions(issueTitleSelected);

    issueSummaryBtn.classList.toggle('selected');
    updatePreview();
  });

  saveBtn.addEventListener('click', () => {
    const selectedIssueKeyCase = Array.from(issueKeyCaseRadios).find(
      (radio) => radio.checked
    )?.value;
    const selectedIssueSummaryCase = Array.from(issueSummaryCaseRadios).find(
      (radio) => radio.checked
    )?.value;

    const isIssueSummaryEnabled =
      issueSummaryBtn.classList.contains('selected');

    if (!selectedIssueKeyCase) {
      alert('Please select a case option for the issue key');
      return;
    }

    if (isIssueSummaryEnabled) {
      if (!selectedIssueSummaryCase) {
        alert('Please select a case option for the issue summary');
        return;
      }
    }

    const config = {
      issueCase: selectedIssueKeyCase,
      titleCase: selectedIssueSummaryCase,
      includeTitle: isIssueSummaryEnabled,
    };
    loader.classList.add('active');

    chrome.storage.sync.set({ [JIRA_BRANCH_CONFIG_KEY]: config }, function () {
      console.log('Configuration saved');
      setTimeout(() => {
        loader.classList.remove('active');
      }, 500);
    });
  });

  issueKeyCaseRadios.forEach((radio) =>
    radio.addEventListener('change', updatePreview)
  );
  issueSummaryCaseRadios.forEach((radio) =>
    radio.addEventListener('change', updatePreview)
  );

  updatePreview();
});
