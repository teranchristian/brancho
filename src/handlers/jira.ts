import { JiraMessageResponse, RunnerResponse } from '../core/interface';
import { getBranchConfig } from '../core/storage';
import { formatBranchName, sendMessage } from '../core/utils';

export const jiraHandler = {
  name: 'jira',
  match: (url: string) =>
    url.match(/.*\.(?:atlassian|jira).*?[?&]selectedIssue=([A-Z][A-Z0-9]+-\d+)/i),
  runner: async (tabId: number, issueKey: string): Promise<RunnerResponse | null> => {
    const response = await new Promise<JiraMessageResponse | null>((resolve) => {
      sendMessage<JiraMessageResponse>(tabId, 'jira', (response) => {
        resolve(response || null);
      });
    });

    if (!response) {
      console.error('No response received from content script.');
      return null;
    }

    const branchConfig = await getBranchConfig();
    if (!branchConfig) {
      console.error('No branch configuration found.');
      return null;
    }

    const branchName = formatBranchName(issueKey, response.title, branchConfig);
    return {
      issueKey,
      title: response.title,
      author: response.author,
      branchName,
    };
  },
};