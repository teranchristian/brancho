export const copyBranchNameToClipboard = (
  branchName: string,
  tabId?: number
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    if (!tabId) {
      navigator.clipboard.writeText(branchName).then(() => {
        resolve()
      }).catch((error) => {
        reject(`Failed to write to clipboard: ${error.message}`);
      });;
      return
    }

    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        args: [branchName],
        func: (text: string) => {
          if (!document.hasFocus()) {
            const errorMessage = `[Brancho] error: document is not focused`
            console.error(errorMessage)
            return false;
          }

          return navigator.clipboard
            .writeText(text)
            .then(() => { return true })
            .catch((e) => {
              console.error(`[brancho] clipboard write field error:${e.message}`)
              return false;
            })
        },
      },
      (results) => {
        if (chrome.runtime.lastError) {
          reject(`[brancho] Failed to execute script: ${chrome.runtime.lastError.message}`);
        }

        if (results && results.length > 0 && results[0].result === true) {
          resolve();
          return
        }
        reject(`[Brancho] Clipboard write was unsuccessful.`);
      }
    )
  });
};