import { githubHandler } from './github';
import { jiraHandler } from './jira';

export const handlers = [jiraHandler, githubHandler];

export const getHandlerForUrl = (url: string, tabId: number) => {
  for (const handler of handlers) {
    const match = handler.match(url);
    if (match) {
      let handlerFunction;
      if (handler.type === 'createBranch' && match[1]) {
        // @ts-ignore:next-line
        handlerFunction = handler.handleGetTicketTitle(match[1], tabId);
      } else if (handler.type === 'copyBranch') {
        // @ts-ignore:next-line
        handlerFunction = handler.handleGetTicketTitle(tabId);
      } else {
        continue;
      }
      return {
        handler: handlerFunction,
        ticketGetMessageName: handler.getTicketMessageName,
      };
    }
  }
  console.log('URL did not match');
  return null;
};
