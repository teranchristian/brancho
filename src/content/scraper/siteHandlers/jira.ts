export const handleJira = (sendResponse: any): void => {
  const basedSelector = 'issue.views.issue-base.foundation';
  const titleSelector = `[data-testid="${basedSelector}.summary.heading"]`;
  const authorSelector = `[data-testid="issue.views.field.user.assignee"]  span > span`;

  const titleElement = document.querySelector(titleSelector) as HTMLDivElement;
  const authorElement = document.querySelector(
    authorSelector
  ) as HTMLSpanElement;

  const title = titleElement?.innerText;
  const author = authorElement?.innerText;

  if (!title) {
    console.log('[brancho] unable to find title');
    sendResponse(null);
    return;
  }

  sendResponse({
    title,
    author,
  });
};