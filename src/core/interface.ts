export interface JiraConfig {
  keyCase: string;
  titleCase: string;
  titleLength: string;
  includeTitle: boolean;
}

export interface JiraMessageResponse {
  issue: string;
  title: string;
}

export interface GithubMessageResponse {
  branchName: string;
}

export enum JiraTitleLengthType {
  FULL = 'full',
  SHORT = 'short',
}
