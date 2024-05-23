export const githubHandler = {
  name: 'github',
  match: (url: string) =>
    url.match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+(?:\/.*)?/i),
  getTicketMessageName: 'getGitHubTicketTitle',
  handleGetTicketTitle: (branchName: string): string => {
    return branchName;
  },
};
