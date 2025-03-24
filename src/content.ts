const handleJiraTicketTitle = (sendResponse: any) => {
  const basedSelector = 'issue.views.issue-base.foundation';
  const titleSelector = `[data-testid="${basedSelector}.summary.heading"]`;
  const authorSelector = `[data-testid="issue.views.field.user.assignee"]  span > span`;

  const titleElement = document.querySelector(titleSelector) as HTMLDivElement;
  const authorElement = document.querySelector(
    authorSelector
  ) as HTMLSpanElement;

  let title = titleElement?.innerText;
  let author = authorElement?.innerText;
  if (!title || !author) {
    console.warn('unable to find title/author')
    sendResponse(null);
    return;
  }
  sendResponse({
    title,
    author,
  });
};

const handleGitHubTicketTitle = (sendResponse: any): void => {
  const branchSelector = 'clipboard-copy[aria-label="Copy"]';
  const titleSelector = '.js-issue-title.markdown-title';
  const authorSelector = '[data-hovercard-type="user"]';
  const branchName =
    document.querySelector(branchSelector)?.getAttribute('value') ?? null;
  const author = document.querySelector(authorSelector)?.textContent ?? null;
  const title = document.querySelector(titleSelector)?.textContent ?? null;

  if (!branchName || !title || !author) {
    console.warn('unable to find branch/title/author')
    sendResponse(null);
    return;
  }
  sendResponse({ branchName, title, author });
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
