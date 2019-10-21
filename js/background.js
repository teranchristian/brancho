const titleSelector = '[data-test-id=\"issue.views.issue-base.foundation.summary.heading\"]';

chrome.commands.onCommand.addListener(browserTab => {
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    if (tabs.length !== 1) {
      return;
    }
    const tab = tabs[0];
    const match = tab.url.match(/.*playgroundxyz\.atlassian\.net\/jira\/.*\?selectedIssue=(.*)/i);
    if (!match || !match[1]) {
      console.log('URL did not match');
      return;
    }
    const selectedIssue = match[1];

    chrome.tabs.executeScript(tab.id, {file: "js/content.js"}, () => {
      const lastErr = chrome.runtime.lastError;
      if (lastErr){
        console.log('tab: ' + tab.id + ' lastError: ' + JSON.stringify(lastErr));
      };
      // send a message to content script
      chrome.tabs.sendMessage(tab.id, "Background page", response => {
        const doc = htmlToDocument(response);
        const cardTitle = getCardTitle(doc);
        if (cardTitle != null) {
          const branchName = `${selectedIssue}-${cardTitle}`;
          copyToClipboard(branchName);
          createNotification("Branch name on clipboard", branchName);
        } else {
          createNotification("Error", "Branch name not found");
        }
      });
    });
  });
});


function getCardTitle(doc) {
  var titleElement = doc.querySelector("[data-test-id=\"issue.views.issue-base.foundation.summary.heading\"]");
  if (titleElement) {
    return titleElement.innerText
      .replace(/[^a-z0-9\-]/gi, '-')
      .replace(/(-)([\-]+)/gi, '$1')
      .toLowerCase()
      .trim();
  }
}

function createNotification(title, branchName) {
  var opt = {
    type: "basic",
    title: title,
    message: branchName,
    iconUrl: "img/b-icon-24.png"
  };
  chrome.notifications.create(null, opt, function (notificationId) {
    timer = setTimeout(function () {
      chrome.notifications.clear(notificationId);
    }, 3000);
  });
}

function copyToClipboard(branchName) {
  const input = document.createElement("input");
  input.style.position = "fixed";
  input.style.opacity = 0;
  input.value = branchName;
  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
};

function htmlToDocument(str) {
  var template = document.createElement("template");
  if (template.content) {
    template.innerHTML = str;
    return template.content;
  }
}
