chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.message === 'getTicketTitle') {
    const titleSelector =
      '[data-testid="issue.views.issue-base.foundation.summary.heading"]';
    const title = document.querySelector(titleSelector)?.innerText;
    sendResponse(title);
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
