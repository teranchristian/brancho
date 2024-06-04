const handleJiraTicketTitle = (sendResponse: any) => {
  const basedSelector = 'issue.views.issue-base.foundation';
  const titleSelector = `[data-testid="${basedSelector}.summary.heading"]`;

  const divElement = document.querySelector(titleSelector) as HTMLDivElement;

  let title = divElement?.innerText;
  if (!title) {
    sendResponse(null);
    return;
  }
  sendResponse({
    title,
  });
};

const handleGitHubTicketTitle = (sendResponse: any): void => {
  const branchSelector = 'clipboard-copy[aria-label="Copy"]';
  const titleSelector = '.js-issue-title.markdown-title';
  const branchName =
    document.querySelector(branchSelector)?.getAttribute('value') ?? null;

  const title = document.querySelector(titleSelector)?.textContent ?? null;
  sendResponse({ branchName, title });
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
