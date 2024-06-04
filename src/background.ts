import { jiraHandler } from './handlers/jira';
import { copyBranchNameToClipboard } from './core/copyBranch';
import { pushNotification } from './core/notification';
import {
  executeContentScript,
  getActiveTab,
  getDateNow,
  handleRuntimeError,
} from './core/utils';
import { getHandlerNameForUrl } from './handlers/handler';
import { addToBranchoHistory, setDefaultConfig } from './core/storage';
import { BranchoItem } from './core/interface';

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
      const response = await handler.runner(tabId, handler.issueKey);
      if (!response) {
        pushNotification('Error', 'Branch name not found');
        return;
      }
      const item: BranchoItem = {
        issueKey: handler.issueKey,
        title: response.title,
        branchName: response.branchName,
        date: new Date().toString(),
        type: handler.name,
        author: response.author,
        url,
      };
      addToBranchoHistory(item);
      copyBranchNameToClipboard(response.branchName, tabId);
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
