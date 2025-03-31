import { JiraMessageResponse, RunnerResponse } from '@core/interface';
import { getBranchConfig } from '@core/storage';
import { formatBranchName, sendMessageToContentScript } from '@core/utils';
import { JIRA_REGEX } from '@core/constant';

export const jiraHandler = {
  name: 'jira',
  match: (url: string) =>
    url.match(JIRA_REGEX),
  runner: async (tabId: number, issueKey: string): Promise<RunnerResponse | null> => {
    const response = await new Promise<JiraMessageResponse | null>((resolve) => {
      sendMessageToContentScript<JiraMessageResponse>(tabId, 'scraping', 'jira', (response) => {
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