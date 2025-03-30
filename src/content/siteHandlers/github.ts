export const handleGitHub = (sendResponse: any): void => {
  const branchSelector = 'clipboard-copy[aria-label="Copy"]';
  const titleSelector = '.js-issue-title.markdown-title';
  const authorSelector = '[data-hovercard-type="user"]';

  const branchName =
    document.querySelector(branchSelector)?.getAttribute('value') ?? null;
  const author = document.querySelector(authorSelector)?.textContent ?? null;
  const title = document.querySelector(titleSelector)?.textContent ?? null;

  if (!branchName || !title || !author) {
    console.warn('unable to find branch/title/author');
    sendResponse(null);
    return;
  }

  sendResponse({ branchName, title, author });
};