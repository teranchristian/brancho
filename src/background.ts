import { copyBranchNameToClipboard } from './core/copyBranch';
import { pushNotification } from './core/notification';
import {
  executeContentScript,
  getActiveTab,
  handleRuntimeError,
  sendMessage,
} from './core/utils';
import { getHandlerNameForUrl } from './handlers/handler';

const defaultJiraConfig = {
  issueCase: 'upper',
  titleCase: 'lower',
  includeTitle: true,
};

const JIRA_BRANCH_CONFIG_KEY = 'jiraBranchConfig';

const setDefaultConfig = () => {
  chrome.storage.sync.get([JIRA_BRANCH_CONFIG_KEY], (result) => {
    if (!result[JIRA_BRANCH_CONFIG_KEY]) {
      chrome.storage.sync.set(
        { [JIRA_BRANCH_CONFIG_KEY]: defaultJiraConfig },
        () => {
          console.log('Default configuration saved');
        }
      );
    }
  });
};

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
    const handlerName = getHandlerNameForUrl(url);
    if (!handlerName) {
      console.warn(`Brancho: No handler found for url: ${url}`);
      return;
    }

    executeContentScript(tabId, () => {
      handleRuntimeError(tabId);

      sendMessage(tabId, handlerName, (branchName: string | null) => {
        if (!branchName) {
          pushNotification('Error', 'Branch name not found');
          return;
        }
        copyBranchNameToClipboard(branchName, tabId);
      });
    });
  });
};

chrome.commands.onCommand.addListener((command: string) => {
  if (command === 'copy-branch-name') {
    commandCopyBranchName();
  }
});

// Listen for the install event
chrome.runtime.onInstalled.addListener(function (details) {
  console.log('-->', details.reason);
  if (['install', 'update'].includes(details.reason)) {
    console.log('eeeh');
    setDefaultConfig();
  }
});
