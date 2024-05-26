export const sendMessage = <T>(
  tabId: number,
  message: string,
  callback: (res: T | null) => void
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

export const formatBranchName = (
  number: string,
  title: string,
  config: JiraConfig
) => {
  const applyCase = (text: string, caseOption: string) =>
    caseOption === 'upper' ? text.toUpperCase() : text.toLowerCase();
  const formattedNumber = applyCase(number, config.issueCase);

  if (config.includeTitle) {
    const titleBranchFormat = title
      .replace(/\[.*?\]\s*\|\s*/, '') // remove components from title "[<COMPONENTS>] |"
      .replace(/[^a-z0-9\-]/gi, '-') // replace non-alphanumeric characters with "-"
      .replace(/-+/g, '-') // remove multiple "-"
      .replace(/^-|-$/g, '') // remove "-" at the start or end
      .toLowerCase()
      .trim();

    const formattedTitle = applyCase(titleBranchFormat, config.titleCase);
    return `${formattedNumber}-${formattedTitle}`;
  }

  return formattedNumber;
};
