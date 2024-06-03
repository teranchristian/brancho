import { GithubMessageResponse, RunnerResponse } from '../core/interface';
import { sendMessage } from '../core/utils';

export const githubHandler = {
  name: 'github',
  match: (url: string) =>
    url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/(\d+)(?:\/.*)?/i),
  runner: (tabId: number, issueKey: string): Promise<RunnerResponse | null> => {
    return new Promise((resolve) => {
      sendMessage<GithubMessageResponse>(tabId, 'github', (response) => {
        const branchName = response?.branchName;
        const title = response?.title;
        if (!branchName || !title) {
          return resolve(null);
        }
        return resolve({
          issueKey,
          title,
          branchName,
        });
      });
    });
  },
};
