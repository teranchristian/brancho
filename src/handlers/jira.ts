import { JIRA_BRANCH_CONFIG_KEY } from '../core/constant';
import { formatBranchName, sendMessage } from '../core/utils';

export const jiraHandler = {
  name: 'jira',
  match: (url: string) =>
    url.match(/.*\.(?:atlassian|jira).*?(?:[A-Z]{2,20}-\d{1,7})/i),
  runner: (tabId: number): Promise<string | null> => {
    return new Promise((resolve) => {
      sendMessage<JiraMessageResponse>(tabId, 'jira', (response) => {
        chrome.storage.sync.get([JIRA_BRANCH_CONFIG_KEY], (result) => {
          let branchConfig = result[
            JIRA_BRANCH_CONFIG_KEY
          ] as JiraConfig | null;
          if (!branchConfig || !response) {
            return resolve(null);
          }

          return resolve(
            formatBranchName(response.issue, response.title, branchConfig)
          );
        });
      });
    });
  },
};
