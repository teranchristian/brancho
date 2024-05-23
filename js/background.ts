import {
  createNotification,
  executeContentScript,
  getActiveTab,
  handleRuntimeError,
  sendMessage,
} from './core/utils';
import { getHandlerForUrl } from './handlers/handler';

chrome.runtime.onMessage.addListener((request) => {
  const { type } = request;
  switch (type) {
    case 'branchCopied':
      createNotification('Branch name on clipboard', request.branchName);
      break;
    case 'clipboardError':
      createNotification('Error', 'Document is not focused');
      break;
    default:
      console.warn(`Unhandled request type: ${type}`);
  }
});

const handleCommandCopyBranchName = () => {
  getActiveTab((url, tabId) => {
    const result = getHandlerForUrl(url, tabId);
    if (!result) {
      console.warn(`Brancho: No handler found for url: ${url}`);
      return;
    }

    const { handler, ticketGetMessageName } = result;
    executeContentScript(tabId, () => {
      handleRuntimeError(tabId);
      sendMessage(tabId, ticketGetMessageName, handler);
    });
  });
};

chrome.commands.onCommand.addListener((command: string) => {
  if (command === 'copy-branch-name') {
    handleCommandCopyBranchName();
  }
});
