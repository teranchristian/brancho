interface JiraConfig {
  issueCase: string;
  titleCase: string;
  includeTitle: boolean;
}

interface JiraMessageResponse {
  issue: string;
  title: string;
}

interface GithubMessageResponse {
  branchName: string | null;
}
