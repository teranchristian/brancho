const handleJiraTicketTitle = (sendResponse: any) => {
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
  sendResponse({
    issue,
    title,
  });
};

const handleGitHubTicketTitle = (sendResponse: any): void => {
  const branchSelector = 'clipboard-copy[aria-label="Copy"]';
  const branchName =
    document.querySelector(branchSelector)?.getAttribute('value') ?? null;
  sendResponse({ branchName });
};

const handlers: {
  [key: string]: (sendResponse: any) => void;
} = {
  jira: handleJiraTicketTitle,
  github: handleGitHubTicketTitle,
};

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (handlers[request.message]) {
    handlers[request.message](sendResponse);
    return;
  }
  sendResponse(null);
});
