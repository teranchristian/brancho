import { jiraHandler } from './handlers/jira';
import { copyBranchNameToClipboard } from './core/copyBranch';
import { pushNotification } from './core/notification';
import {
  executeContentScript,
  getActiveTab,
  handleRuntimeError,
} from './core/utils';
import { getHandlerNameForUrl } from './handlers/handler';
import { setDefaultConfig } from './core/storage';

chrome.runtime.onMessage.addListener((request) => {
  const { type } = request;
  switch (type) {
    case 'branchCopied':
      pushNotification('Branch name on clipboard', request.branchName);
      break;
    case 'clipboardError':
      pushNotification('Error', 'Document is not focused');
      break;
    default:
      console.warn(`Unhandled request type: ${type}`);
  }
});

const commandCopyBranchName = () => {
  getActiveTab((url, tabId) => {
    const handler = getHandlerNameForUrl(url);
    if (!handler) {
      console.warn(`Brancho: No handler found for url: ${url}`);
      return;
    }

    executeContentScript(tabId, async () => {
      handleRuntimeError(tabId);
      const branchName = await handler.runner(tabId);
      if (!branchName) {
        pushNotification('Error', 'Branch name not found');
        return;
      }
      copyBranchNameToClipboard(branchName, tabId);
    });
  });
};

chrome.commands.onCommand.addListener((command: string) => {
  if (command === 'copy-branch-name') {
    commandCopyBranchName();
  }
});

// Listen for the install/update event
chrome.runtime.onInstalled.addListener(function (details) {
  if (['install', 'update'].includes(details.reason)) {
    setDefaultConfig();
  }
});
