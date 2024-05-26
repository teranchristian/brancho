import { githubHandler } from './github';
import { jiraHandler } from './jira';

export const handlers = [jiraHandler, githubHandler];

export const getHandlerNameForUrl = (url: string) => {
  for (const handler of handlers) {
    const match = handler.match(url);
    if (match) {
      return {
        name: handler.name,
        runner: handler.runner,
      };
    }
  }
  console.log('URL did not match');
  return null;
};
