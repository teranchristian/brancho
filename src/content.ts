const handleJiraTicketTitle = (sendResponse: any, branchConfig: JiraConfig) => {
  const basedSelector = 'issue.views.issue-base.foundation';
  const titleSelector = `[data-testid="${basedSelector}.summary.heading"]`;
  const issueSelector = `[data-testid="${basedSelector}.breadcrumbs.current-issue.item"] > span`;

  const spanElement = document.querySelector(issueSelector) as HTMLSpanElement;
  const divElement = document.querySelector(titleSelector) as HTMLDivElement;

  const issue = spanElement?.innerText;
  let title = divElement?.innerText;
  if (!issue || !title) {
    sendResponse(null);
    return;
  }
  title = title
    .replace(/\[.*?\]\s*\|\s*/, '') // remove components from title "[<COMPONENTS>] |"
    .replace(/[^a-z0-9\-]/gi, '-') // replace non-alphanumeric characters with "-"
    .replace(/-+/g, '-') // remove multiple "-"
    .replace(/^-|-$/g, '') // remove "-" at the start or end
    .toLowerCase()
    .trim();

  const formatBranchName = (
    number: string,
    title: string,
    config: JiraConfig
  ) => {
    const applyCase = (text: string, caseOption: string) =>
      caseOption === 'upper' ? text.toUpperCase() : text.toLowerCase();
    const formattedNumber = applyCase(number, config.issueCase);

    if (config.includeTitle) {
      const formattedTitle = applyCase(title, config.titleCase);
      return `${formattedNumber}-${formattedTitle}`;
    }

    return formattedNumber;
  };

  sendResponse(formatBranchName(issue, title, branchConfig));
};

const handleGitHubTicketTitle = (sendResponse: any): void => {
  const branchSelector = 'clipboard-copy[aria-label="Copy"]';
  const branchName = document
    .querySelector(branchSelector)
    ?.getAttribute('value');
  sendResponse(branchName);
};

const handlers: {
  [key: string]: (sendResponse: any, branchConfig: JiraConfig) => void;
} = {
  jira: handleJiraTicketTitle,
  github: handleGitHubTicketTitle,
};

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (handlers[request.message]) {
    handlers[request.message](sendResponse, request.branchConfig);
    return;
  }
  sendResponse(null);
});
