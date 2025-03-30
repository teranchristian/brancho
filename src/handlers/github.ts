import { GithubMessageResponse, RunnerResponse } from 'core/interface';
import { sendMessageToContentScript } from 'core/utils';
import { GITHUB_REGEX } from 'core/constant';

export const githubHandler = {
  name: 'github',
  match: (url: string) =>
    url.match(GITHUB_REGEX),
  runner: (tabId: number, issueKey: string): Promise<RunnerResponse | null> => {
    return new Promise((resolve) => {
      sendMessageToContentScript<GithubMessageResponse>(tabId, 'scraping', 'github', (response) => {
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
