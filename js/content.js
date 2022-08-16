chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.message === 'getPageDOM') {
    sendResponse(document.all[0].outerHTML);
  }

  if (request.message === 'copyToClipboard') {
    copyToClipboard(request.textToCopy);
    sendResponse('ok');
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
    });
}
