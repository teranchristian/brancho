chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.type == 'branchCopied') {
    createNotification('Branch name on clipboard', request.branchName);
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
  try {
    navigator.clipboard.writeText(text);
    chrome.runtime.sendMessage({ type: 'branchCopied', branchName: text });
  } catch (error) {}
};

const getActiveTab = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length !== 1) {
      return;
    }
    callback(tabs[0]);
  });
};

const getIssueFromUrl = (url) => {
  const match = url.match(/.*\.(?:atlassian|jira).*?([A-Z]{2,20}-\d{1,7})/i);
  if (!match || !match[1]) {
    console.log('URL did not match');
    return null;
  }
  return match[1];
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

const handleGetTicketTitle = (selectedIssue, tabId) => {
  return (ticketTitle) => {
    if (!ticketTitle) {
      console.log('error');
      return;
    }

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
  };
};

const handleCommand = (command) => {
  getActiveTab((tab) => {
    const selectedIssue = getIssueFromUrl(tab.url);
    if (!selectedIssue) {
      return;
    }

    executeScript(tab.id, () => {
      handleRuntimeError(tab.id);
      sendMessage(
        tab.id,
        'getTicketTitle',
        handleGetTicketTitle(selectedIssue, tab.id)
      );
    });
  });
};

function formatTicketTitle(title) {
  // remove components from title "[<COMPONENTS>] |"
  title = title.replace(/\[.*?\]\s*\|\s*/, '');

  return (
    title
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
}

chrome.commands.onCommand.addListener(handleCommand);
