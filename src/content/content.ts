import { showNotification } from '@content/html/notification';
import { handleGitHub } from '@content/siteHandlers/github';
import { handleJira } from '@content/siteHandlers/jira';

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
