export interface JiraConfig {
  keyCase: string;
  titleCase: string;
  titleLength: string;
  includeTitle: boolean;
}

export interface JiraMessageResponse {
  title: string;
  author: string;
}

export interface BranchoItem {
  issueKey: string;
  title: string;
  branchName: string;
  date: string;
  type: string;
  author: string;
  url: string;
}
export interface RunnerResponse {
  issueKey: string;
  title: string;
  author: string;
  branchName: string;
}

export interface GithubMessageResponse {
  title: string;
  author: string;
  branchName: string;
}

export enum JiraTitleLengthType {
  FULL = 'full',
  SHORT = 'short',
}
