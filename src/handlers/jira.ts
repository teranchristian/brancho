export const jiraHandler = {
  name: 'jira',
  match: (url: string) =>
    url.match(/.*\.(?:atlassian|jira).*?(?:[A-Z]{2,20}-\d{1,7})/i),
};
