import { GithubMessageResponse } from '../core/interface';
import { sendMessage } from '../core/utils';

export const githubHandler = {
  name: 'github',
  match: (url: string) =>
    url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+(?:\/.*)?/i),
  runner: (tabId: number): Promise<string | null> => {
    return new Promise((resolve) => {
      sendMessage<GithubMessageResponse>(tabId, 'github', (response) => {
        return resolve(response?.branchName ?? null);
      });
    });
  },
};
