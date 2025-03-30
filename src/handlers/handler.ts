import { githubHandler } from 'handlers/github';
import { jiraHandler } from 'handlers/jira';

export const handlers = [jiraHandler, githubHandler];

export const getHandlerNameForUrl = (url: string) => {
  for (const handler of handlers) {
    const match = handler.match(url);
    if (match && match.length == 2) {
      return {
        name: handler.name,
        runner: handler.runner,
        issueKey: match[1],
      };
    }
  }
  console.log('URL did not match');
  return null;
};
