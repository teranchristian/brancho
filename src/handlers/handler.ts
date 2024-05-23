import { githubHandler } from './github';
import { jiraHandler } from './jira';

export const handlers = [jiraHandler, githubHandler];

export const getHandlerForUrl = (url: string, tabId: number) => {
  for (const handler of handlers) {
    const match = handler.match(url);
    if (match) {
      return {
        handler: handler.handleGetTicketTitle,
        ticketGetMessageName: handler.getTicketMessageName,
      };
    }
  }
  console.log('URL did not match');
  return null;
};
