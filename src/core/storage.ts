import { JIRA_BRANCH_CONFIG_KEY, DEFAULT_JIRA_CONFIG } from './constant';
import { JiraConfig as JiraBranchConfig } from './interface';

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
      let branchConfig = result[JIRA_BRANCH_CONFIG_KEY] as JiraBranchConfig | null;
      resolve(branchConfig);
    });
  });
};
