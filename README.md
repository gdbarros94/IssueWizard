# IssueWizard

A modern web application for managing GitHub issues with ease. Built with React and Material-UI, IssueWizard allows you to create, view, edit, and delete GitHub issues with full control over all fields.

## Features

- 🔐 **GitHub Authentication** - Secure token-based authentication
- 📁 **Repository Selection** - Choose from your GitHub repositories
- 📝 **Issue Management** - Create, view, edit, and delete issues
- 🚀 **Bulk Upload** - Upload multiple issues at once via JSON
- 🏷️ **Label Management** - Full control over issue labels
- 🎨 **Modern UI** - Clean interface built with Material-UI
- 📱 **Responsive Design** - Works on desktop and mobile

## Prerequisites

- Node.js (v14 or higher)
- GitHub Personal Access Token with `repo` scope

## Installation

1. Clone the repository:
```bash
git clone https://github.com/gdbarros94/IssueWizard.git
cd IssueWizard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Getting a GitHub Token

1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens/new)
2. Click "Generate new token" (classic)
3. Give it a descriptive name
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. Copy the token and use it in IssueWizard

## Usage

### Login
1. Open the app and enter your GitHub Personal Access Token
2. Click "Connect to GitHub"

### Select Repository
1. Choose a repository from the list on the left sidebar
2. The repository's issues will load automatically

### Create Single Issue
1. Click "New Issue" in the top navigation
2. Fill in the title, description, and labels
3. Click "Save Issue"

### Bulk Upload Issues
1. Click "Bulk Upload" in the top navigation
2. Prepare a JSON file with the following format:
```json
[
  {
    "title": "Issue title",
    "body": "Issue description",
    "labels": ["bug", "enhancement"]
  },
  {
    "title": "Another issue",
    "body": "Another description",
    "labels": ["documentation"]
  }
]
```
3. Select your JSON file
4. View the upload results

### Edit Issue
1. Click on an issue to view details
2. Click "Edit Issue" button
3. Modify the fields
4. Click "Save Issue"

### Delete/Close Issue
1. Click the delete icon next to any issue in the list
2. Confirm the action
3. The issue will be closed

## JSON Format for Bulk Upload

Each issue object can have the following fields:

- `title` (required): The issue title
- `body` (optional): The issue description/body
- `labels` (optional): Array of label names
- `assignees` (optional): Array of GitHub usernames

Example:
```json
[
  {
    "title": "Bug: Login page not working",
    "body": "Users cannot login when clicking the submit button",
    "labels": ["bug", "priority-high"],
    "assignees": ["username1"]
  }
]
```

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

## Technology Stack

- **React** - UI library
- **Material-UI** - Component library
- **React Router** - Navigation
- **GitHub REST API** - Backend integration

## Security

- Tokens are stored in localStorage
- All API calls use secure HTTPS
- Tokens are never logged or exposed
- Direct communication with GitHub API (no backend required)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
