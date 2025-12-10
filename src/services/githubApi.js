const GITHUB_API_BASE = 'https://api.github.com';

class GitHubAPI {
  constructor() {
    this.token = localStorage.getItem('github_token') || '';
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('github_token', token);
  }

  getToken() {
    return this.token;
  }

  clearToken() {
    this.token = '';
    localStorage.removeItem('github_token');
  }

  async fetchWithAuth(url, options = {}) {
    const headers = {
      'Authorization': `Bearer ${this.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'GitHub API request failed');
    }

    return response.json();
  }

  // Get authenticated user
  async getAuthenticatedUser() {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/user`);
  }

  // Get user repositories
  async getUserRepositories() {
    const response = await this.fetchWithAuth(`${GITHUB_API_BASE}/user/repos?per_page=100&sort=updated`);
    return response;
  }

  // Get issues from a repository
  async getRepositoryIssues(owner, repo, state = 'all') {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues?state=${state}&per_page=100`);
  }

  // Get a single issue
  async getIssue(owner, repo, issueNumber) {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`);
  }

  // Create an issue
  async createIssue(owner, repo, issueData) {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`, {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  }

  // Update an issue
  async updateIssue(owner, repo, issueNumber, issueData) {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`, {
      method: 'PATCH',
      body: JSON.stringify(issueData),
    });
  }

  // Close an issue
  async closeIssue(owner, repo, issueNumber) {
    return this.updateIssue(owner, repo, issueNumber, { state: 'closed' });
  }

  // Delete an issue (GitHub doesn't support direct deletion, but we can close it)
  // Note: Only organization admins can delete issues via API, so we'll close them instead
  async deleteIssue(owner, repo, issueNumber) {
    return this.closeIssue(owner, repo, issueNumber);
  }

  // Create multiple issues in bulk
  async createIssuesBulk(owner, repo, issues) {
    const results = [];
    for (const issue of issues) {
      try {
        const result = await this.createIssue(owner, repo, issue);
        results.push({ success: true, issue: result });
      } catch (error) {
        results.push({ success: false, error: error.message, issueData: issue });
      }
    }
    return results;
  }

  // Get repository labels
  async getRepositoryLabels(owner, repo) {
    return this.fetchWithAuth(`${GITHUB_API_BASE}/repos/${owner}/${repo}/labels?per_page=100`);
  }

  // Validate token by trying to fetch user data
  async validateToken() {
    try {
      await this.getAuthenticatedUser();
      return true;
    } catch (error) {
      return false;
    }
  }
}

const githubApiInstance = new GitHubAPI();
export default githubApiInstance;
