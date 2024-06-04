import { GithubMessageResponse, RunnerResponse } from '../core/interface';
import { sendMessage } from '../core/utils';

export const githubHandler = {
  name: 'github',
  match: (url: string) =>
    url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/(\d+)(?:\/.*)?/i),
  runner: (tabId: number, issueKey: string): Promise<RunnerResponse | null> => {
    return new Promise((resolve) => {
      sendMessage<GithubMessageResponse>(tabId, 'github', (response) => {
        if (!response) {
          return resolve(null);
        }
        const branchName = response.branchName;
        const title = response.title;
        const author = response.author;
        return resolve({
          issueKey,
          title,
          author,
          branchName,
        });
      });
    });
  },
};
