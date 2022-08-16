import * as cheerio from 'cheerio';

const titleSelector =
  '[data-test-id="issue.views.issue-base.foundation.summary.heading"]';

chrome.commands.onCommand.addListener((command) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length !== 1) {
      return;
    }
    const tab = tabs[0];
    const match = tab.url.match(/.*\.atlassian.*?([A-Z]{2,20}-\d{1,7})/i);
    if (!match || !match[1]) {
      console.log('URL did not match');
      return;
    }
    const selectedIssue = match[1];

    chrome.scripting.executeScript(
      { target: { tabId: tab.id }, files: ['content.js'] },
      () => {
        const lastErr = chrome.runtime.lastError;
        if (lastErr) {
          console.log(
            'tab: ' + tab.id + ' lastError: ' + JSON.stringify(lastErr)
          );
        }

        chrome.tabs.sendMessage(
          tab.id,
          { message: 'getPageDOM' },
          (response) => {
            if (!response) {
              console.log('error');
              return;
            }
            const $ = cheerio.load(response);
            const cardTitle = getCardTitle($);
            if (cardTitle != null) {
              const branchName = `${selectedIssue}-${cardTitle}`;
              console.log('sending..');
              chrome.tabs.sendMessage(
                tab.id,
                {
                  message: 'copyToClipboard',
                  textToCopy: branchName,
                },
                (response) => {
                  console.log('DONE!', response);
                }
              );
              createNotification('Branch name on clipboard', branchName);
            } else {
              createNotification('Error', 'Branch name not found');
            }
          }
        );
      }
    );
  });
});

function getCardTitle($) {
  var titleElement = $(titleSelector).text();
  if (titleElement) {
    return (
      titleElement
        .replace(/[^a-z0-9\-]/gi, '-')
        .replace(/(-)([\-]+)/gi, '$1')
        // remove multuples "-"
        .replace(/-+/g, '-')
        //remove last character if it is a "-"
        .replace(/-$/, '')
        .replace(/^-/, '')
        .toLowerCase()
        .trim()
    );
  }
}

function createNotification(title, branchName) {
  var opt = {
    type: 'basic',
    title: title,
    message: branchName,
    iconUrl: 'img/b-icon-24.png',
  };
  chrome.notifications.create(null, opt, function (notificationId) {
    setTimeout(function () {
      chrome.notifications.clear(notificationId);
    }, 3000);
  });
}
