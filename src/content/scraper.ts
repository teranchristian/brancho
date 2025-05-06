import { showNotification } from '@content/scraper/html/notification';
import { handleGitHub } from '@content/scraper/siteHandlers/github';
import { handleJira } from '@content/scraper/siteHandlers/jira';

const handlers: {
  [key: string]: (sendResponse: any) => void;
} = {
  jira: handleJira,
  github: handleGitHub,
};

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.type === 'branch-notification') {
    showNotification(request.message)
    sendResponse(true)
    return;
  }

  if (handlers[request.message]) {
    handlers[request.message](sendResponse);
    return;
  }
  sendResponse(null);
});
