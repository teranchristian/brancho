import { showNotification } from './html/notification';
import { handleGitHub } from './siteHandlers/github';
import { handleJira } from './siteHandlers/jira';

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
