export const createNotification = (title: string, message: string) => {
  chrome.notifications.create(
    'Brancho',
    {
      type: 'basic',
      title: title,
      message: message,
      iconUrl: 'img/b-icon-24.png',
    },
    (notificationId) => {
      setTimeout(() => {
        chrome.notifications.clear(notificationId);
      }, 3000);
    }
  );
};

export const formatTicketTitle = (title: string) => {
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

export const sendMessage = (
  tabId: number,
  message: string,
  callback: (res: string) => void
) => {
  chrome.tabs.sendMessage(tabId, { message }, (response) => {
    if (response) {
      callback(response);
    }
  });
};

export const branchCopyToClipboard = (text: string) => {
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

export const getActiveTab = (
  callback: (url: string, tabId: number) => void
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 1) {
      const { url, id: tabId } = tabs[0];
      if (url && tabId) {
        callback(url, tabId);
      }
    }
  });
};

export const executeContentScript = (tabId: number, callback: () => void) => {
  chrome.scripting.executeScript(
    { target: { tabId }, files: ['content.js'] },
    callback
  );
};

export const handleRuntimeError = (tabId: number) => {
  const lastErr = chrome.runtime.lastError;
  if (lastErr) {
    console.log('tab: ' + tabId + ' lastError: ' + JSON.stringify(lastErr));
  }
};
