import { JiraConfig } from './interface';

export const DEFAULT_JIRA_CONFIG: JiraConfig = {
  keyCase: 'upper',
  titleCase: 'lower',
  titleLength: 'full',
  includeTitle: true,
};

export const JIRA_TITLE_SHORT_WORD_LIMIT = 5;

export const HISTORY_LIMIT = 20;

export const JIRA_BRANCH_CONFIG_KEY = 'jiraBranchConfig';
export const BRANCHO_HISTORY_KEY = 'branchoHistory';
