const handlers = [
  {
    name: 'jira',
    match: (url) =>
      url.match(/.*\.(?:atlassian|jira).*?([A-Z]{2,20}-\d{1,7})/i),
    getTicketMessageName: 'getJiraTicketTitle',
    handleGetTicketTitle: (selectedIssue, tabId) => (ticketTitle) => {
      const cardTitle = formatTicketTitle(ticketTitle);
      if (!cardTitle) {
        createNotification('Error', 'Branch name not found');
        return;
      }

      const branchName = `${selectedIssue}-${cardTitle}`;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: branchCopyToClipboard,
        args: [branchName],
      });
    },
    type: 'createBranch',
  },
  {
    name: 'github',
    match: (url) =>
      url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+(?:\/.*)?/i),
    getTicketMessageName: 'getGitHubTicketTitle',
    handleGetTicketTitle: (tabId) => (branchName) => {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: branchCopyToClipboard,
        args: [branchName],
      });
    },
    type: 'copyBranch',
  },
];

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type == 'branchCopied') {
    createNotification('Branch name on clipboard', request.branchName);
  }
  if (request.type == 'clipboardError') {
    createNotification('Error', 'Document is not focused');
  }
});

const createNotification = (title, branchName) => {
  var opt = {
    type: 'basic',
    title: title,
    message: branchName,
    iconUrl: 'img/b-icon-24.png',
  };
  chrome.notifications.create(null, opt, function (notificationId) {
    setTimeout(() => {
      chrome.notifications.clear(notificationId);
    }, 3000);
  });
};

const branchCopyToClipboard = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      chrome.runtime.sendMessage({ type: 'branchCopied', branchName: text });
    })
    .catch((error) => {
      chrome.runtime.sendMessage({
        type: 'clipboardError',
      });
      console.error('Clipboard write failed', error.message);
    });
};

const getActiveTab = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 1) {
      callback(tabs[0]);
    }
  });
};

const executeScript = (tabId, callback) => {
  chrome.scripting.executeScript(
    { target: { tabId }, files: ['content.js'] },
    callback
  );
};

function handleRuntimeError(tabId) {
  const lastErr = chrome.runtime.lastError;
  if (lastErr) {
    console.log('tab: ' + tabId + ' lastError: ' + JSON.stringify(lastErr));
  }
}

const sendMessage = (tabId, message, callback) => {
  chrome.tabs.sendMessage(tabId, { message }, callback);
};

const getHandlerForUrl = (url, tabId) => {
  for (const handler of handlers) {
    const match = handler.match(url);
    if (handler.type === 'createBranch' && match && match[1]) {
      return {
        handler: handler.handleGetTicketTitle(match[1], tabId),
        ticketGetMessageName: handler.getTicketMessageName,
      };
    }
    if (handler.type === 'copyBranch' && match) {
      return {
        handler: handler.handleGetTicketTitle(tabId),
        ticketGetMessageName: handler.getTicketMessageName,
      };
    }
  }
  console.log('URL did not match');
  return null;
};

const handleCommand = (command) => {
  getActiveTab((tab) => {
    const result = getHandlerForUrl(tab.url, tab.id);
    if (!result) {
      return;
    }

    const { handler, ticketGetMessageName } = result;
    if (!handler || !ticketGetMessageName) {
      createNotification('Error', 'Page not supported');
      return;
    }

    executeScript(tab.id, () => {
      handleRuntimeError(tab.id);
      sendMessage(tab.id, ticketGetMessageName, (res) => {
        if (!res) {
          return;
        }
        handler(res);
      });
    });
  });
};

const formatTicketTitle = (title) => {
  return (
    title
      // remove components from title "[<COMPONENTS>] |"
      .replace(/\[.*?\]\s*\|\s*/, '')
      .replace(/[^a-z0-9\-]/gi, '-')
      .replace(/(-)([\-]+)/gi, '$1')
      // remove multuples "-"
      .replace(/-+/g, '-')
      //remove last character if it is a "-"
      .replace(/-$/, '')
      //remove first character if it is a "-"
      .replace(/^-/, '')
      .toLowerCase()
      .trim()
  );
};

chrome.commands.onCommand.addListener(handleCommand);
