import { JiraMessageResponse, RunnerResponse } from '../core/interface';
import { getBranchConfig } from '../core/storage';
import { formatBranchName, sendMessage } from '../core/utils';

export const jiraHandler = {
  name: 'jira',
  match: (url: string) =>
    url.match(/.*\.(?:atlassian|jira).*?([A-Z]{2,20}-\d{1,7})/i),
  runner: (tabId: number, issueKey: string): Promise<RunnerResponse | null> => {
    return new Promise((resolve) => {
      sendMessage<JiraMessageResponse>(tabId, 'jira', (response) => {
        getBranchConfig().then((branchConfig) => {
          if (!branchConfig || !response) {
            return resolve(null);
          }
          const branchName = formatBranchName(
            issueKey,
            response.title,
            branchConfig
          );
          return resolve({
            issueKey,
            title: response.title,
            author: response.author,
            branchName,
          });
        });
      });
    });
  },
};
