export interface JiraConfig {
  keyCase: string;
  titleCase: string;
  titleLength: string;
  includeTitle: boolean;
}

export interface JiraMessageResponse {
  title: string;
}

export interface BranchoItem {
  issueKey: string;
  title: string;
  branchName: string;
  date: string;
  type: string;
  url: string;
}
export interface RunnerResponse {
  issueKey: string;
  title: string;
  branchName: string;
}

export interface GithubMessageResponse {
  title: string;
  branchName: string;
}

export enum JiraTitleLengthType {
  FULL = 'full',
  SHORT = 'short',
}
