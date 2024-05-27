export const copyBranchNameToClipboard = (
  branchName: string,
  tabId: number
) => {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    args: [branchName],
    func: (text: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          chrome.runtime.sendMessage({
            type: 'branchCopied',
            branchName: text,
          });
        })
        .catch((error) => {
          chrome.runtime.sendMessage({
            type: 'clipboardError',
          });
          console.error('Clipboard write failed', error.message);
        });
    },
  });
};
