import { JIRA_BRANCH_CONFIG_KEY } from '../core/constant';
import { JiraConfig } from '../core/interface';

// saveConfig.ts
export function onSave(
  loader: HTMLElement,
  issueKeyCaseRadios: NodeListOf<HTMLInputElement>,
  issueTitleCaseRadios: NodeListOf<HTMLInputElement>,
  issueTitleLengthRadios: NodeListOf<HTMLInputElement>,
  issueTitleBtn: HTMLElement,
  getSelectedValueFromRadios: (
    radios: NodeListOf<HTMLInputElement>
  ) => string | undefined
) {
  loader.classList.add('active');

  const selectedIssueKeyCase = getSelectedValueFromRadios(issueKeyCaseRadios);
  const selectedIssueTitleCase =
    getSelectedValueFromRadios(issueTitleCaseRadios);
  const selectedIssueTitleLength = getSelectedValueFromRadios(
    issueTitleLengthRadios
  );

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
      alert('Please select a case option for the issue title');
      return;
    }
  }

  const config: JiraConfig = {
    keyCase: selectedIssueKeyCase,
    titleCase: selectedIssueTitleCase ?? 'lower',
    titleLength: selectedIssueTitleLength ?? 'full',
    includeTitle: isIssueTitleEnabled,
  };

  chrome.storage.sync.set({ [JIRA_BRANCH_CONFIG_KEY]: config }, () => {
    console.log('Configuration saved');
    // add extra delay to show the loader
    setTimeout(() => {
      loader.classList.remove('active');
    }, 300);
  });
}
