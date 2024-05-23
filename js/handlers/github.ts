import { branchCopyToClipboard } from '../core/utils';

export const githubHandler = {
  name: 'github',
  match: (url: string) =>
    url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+(?:\/.*)?/i),
  getTicketMessageName: 'getGitHubTicketTitle',
  handleGetTicketTitle: (tabId: number) => (branchName: string) => {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: branchCopyToClipboard,
      args: [branchName],
    });
  },
  type: 'copyBranch',
};
