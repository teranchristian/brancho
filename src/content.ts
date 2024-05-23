chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.message === 'getJiraTicketTitle') {
    const titleSelector =
      '[data-testid="issue.views.issue-base.foundation.summary.heading"]';
    const divElement = document.querySelector(titleSelector) as HTMLDivElement;

    const issueSelector =
      '[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"] > span';
    const spanElement = document.querySelector(
      issueSelector
    ) as HTMLSpanElement;

    const issue = spanElement?.innerText;
    const title = divElement?.innerText;

    const brachName = `${issue}-${title}`;
    sendResponse(brachName);
  }

  if (request.message === 'getGitHubTicketTitle') {
    const clipboardCopySelector = 'clipboard-copy[aria-label="Copy"]';
    const clipboardCopyElement = document.querySelector(clipboardCopySelector);
    if (!clipboardCopyElement) {
      sendResponse(null);
      return;
    }
    const branchName = clipboardCopyElement.getAttribute('value');
    sendResponse(branchName);
  }
});
