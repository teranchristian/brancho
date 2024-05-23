import {
  branchCopyToClipboard,
  createNotification,
  formatTicketTitle,
} from '../core/utils';

export const jiraHandler = {
  name: 'jira',
  match: (url: string) =>
    url.match(/.*\.(?:atlassian|jira).*?([A-Z]{2,20}-\d{1,7})/i),
  getTicketMessageName: 'getJiraTicketTitle',
  handleGetTicketTitle:
    (selectedIssue: string, tabId: number) => (ticketTitle: string) => {
      const cardTitle = formatTicketTitle(ticketTitle);
      if (!cardTitle) {
        createNotification('Error', 'Branch name not found');
        return;
      }

      const branchName = `${selectedIssue}-${cardTitle}`;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: branchCopyToClipboard,
        args: [branchName],
      });
    },
  type: 'createBranch',
};
