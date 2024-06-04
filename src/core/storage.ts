import {
  JIRA_BRANCH_CONFIG_KEY,
  DEFAULT_JIRA_CONFIG,
  BRANCHO_HISTORY_KEY,
} from './constant';
import { BranchoItem, JiraConfig as JiraBranchConfig } from './interface';

export const setDefaultConfig = () => {
  chrome.storage.sync.get([JIRA_BRANCH_CONFIG_KEY], (result) => {
    if (!result[JIRA_BRANCH_CONFIG_KEY]) {
      chrome.storage.sync.set(
        { [JIRA_BRANCH_CONFIG_KEY]: DEFAULT_JIRA_CONFIG },
        () => {
          console.log('Default configuration saved');
        }
      );
    }
  });
};

export const getBranchConfig = (): Promise<JiraBranchConfig | null> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([JIRA_BRANCH_CONFIG_KEY], (result) => {
      let branchConfig = result[
        JIRA_BRANCH_CONFIG_KEY
      ] as JiraBranchConfig | null;
      resolve(branchConfig);
    });
  });
};

export const addToBranchoHistory = (newBrancho: BranchoItem) => {
  chrome.storage.sync.get([BRANCHO_HISTORY_KEY], (result) => {
    let branchoHistory = result[BRANCHO_HISTORY_KEY] as
      | BranchoItem[]
      | undefined;
    if (!branchoHistory) {
      branchoHistory = [];
    }
    const updatedHistory = branchoHistory.filter(
      (item) => item.issueKey !== newBrancho.issueKey
    );
    updatedHistory.unshift(newBrancho);

    const newHistory = updatedHistory.slice(0, 10);
    chrome.storage.sync.set({
      [BRANCHO_HISTORY_KEY]: newHistory,
    });
  });
};

export const getBranchoHistory = (): Promise<BranchoItem[]> => {
  return new Promise((resolve) => {
    chrome.storage.sync.get([BRANCHO_HISTORY_KEY], (result) => {
      let branchoHistory = result[BRANCHO_HISTORY_KEY] as BranchoItem[];
      resolve(branchoHistory || []);
    });
  });
};
