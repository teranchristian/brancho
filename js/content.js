chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.message === 'getJiraTicketTitle') {
    const titleSelector =
      '[data-testid="issue.views.issue-base.foundation.summary.heading"]';
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

function copyToClipboard(branchName) {
  navigator.permissions
    .query({
      name: 'clipboard-write',
    })
    .then((result) => {
      if (result.state == 'granted') {
        navigator.clipboard.writeText(branchName).then(
          () => {
            console.log('Branch copied to clipboard', branchName);
          },
          () => {
            console.log('Error: Unable to copy branch');
          }
        );
      } else {
        console.log('Error: ', result);
      }
    })
    .catch((error) => {
      // couldn't query the permission
      console.error(error);
    });
}
