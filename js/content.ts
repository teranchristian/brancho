chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.message === 'getJiraTicketTitle') {
    const titleSelector =
      '[data-testid="issue.views.issue-base.foundation.summary.heading"]';
    // @ts-ignore:next-line
    const title = document.querySelector(titleSelector)?.innerText;
    sendResponse(title);
  }

  if (request.message === 'getGitHubTicketTitle') {
    const clipboardCopySelector = 'clipboard-copy[aria-label="Copy"]';
    const clipboardCopyElement = document.querySelector(clipboardCopySelector);
    if (!clipboardCopyElement) {
      sendResponse(null);
      return;
    }
    const branchName = clipboardCopyElement.getAttribute('value');
    console.log(branchName);
    sendResponse(branchName);
  }
});
