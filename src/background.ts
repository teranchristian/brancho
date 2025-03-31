import { copyBranchNameToClipboard } from '@core/copyBranch';
import { pushNotification } from '@core/notification';
import {
  executeContentScript,
  getActiveTab,
  handleRuntimeError,
  sendMessageToContentScript,
} from '@core/utils';
import { getHandlerNameForUrl } from '@handlers/handler';
import { addToBranchoHistory, setDefaultConfig } from '@core/storage';
import { BranchoItem } from '@core/interface';

const commandCopyBranchName = () => {
  getActiveTab((url, tabId) => {
    const handler = getHandlerNameForUrl(url);
    if (!handler) {
      console.error(`[Brancho] No handler found for url: ${url}`);
      return;
    }

    executeContentScript(tabId, async () => {
      try {
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
        await copyBranchNameToClipboard(response.branchName, tabId)
        sendMessageToContentScript(tabId, 'branch-notification', response.branchName, (response) => {
          if (!response) {
            console.log('[brancho] unable to display copy branch notification')
          }
        })
      } catch (error) {
        console.log('An error occurred:', error);
      }
    });
  });
};

chrome.commands.onCommand.addListener((command: string) => {
  // Listen for the "copy-branch-name" shortcut command
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
