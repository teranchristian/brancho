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
