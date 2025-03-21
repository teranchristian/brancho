
# Brancho

Brancho is a Chrome extension that generates branch names from Jira or GitHub issues and copies them to the clipboard. It also maintains a history of generated branch names for easy access.

## Features

- Generate branch names from Jira or GitHub issues.
- Customize branch name format (case, length, and inclusion of title).
- Copy branch names to the clipboard with a single click.
- View and search branch name history.
- Configurable options for branch name formatting.
- Display a confirmation notification when a branch name is successfully copied to the clipboard.
  - **Note**: If the notification does not work, ensure that notifications are enabled in your browser settings.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/teranchristian/brancho.git
   cd brancho
   ```

2. Install dependencies:
    npm install

3. Build the project:
  npm run build

4. Load the extension in Chrome:

  - Open chrome://extensions/ in your browser.
  - Enable "Developer mode" (toggle in the top-right corner).
  - Click "Load unpacked" and select the dist folder.

## Usage

1. Open a Jira or GitHub issue page.
2. Use the keyboard shortcut (Ctrl+Shift+X on Windows or Command+Shift+X on macOS) to copy the branch name to the clipboard.
3. Access the branch name history by clicking on the extension icon.

## Configuration

You can configure the branch name format in the options page:

1. Click on the extension icon and select "Options."
2. Customize the following settings:
3. Issue Key Case: Uppercase or lowercase.
4. Issue Title Case: Uppercase or lowercase.
5. Issue Title Length: Full or short (first 5 words).
6. Include Title: Whether to include the issue title in the branch name.

## Development

Start Development Server
To start the development server with hot reloading:

`npm run start`

### File Structure
```
  src/
  ├── background.ts       # Background script for handling commands and events
  ├── content.ts          # Content script for extracting issue details
  ├── core/               # Core utilities and shared logic
  ├── handlers/           # Handlers for Jira and GitHub
  ├── option/             # Options page for configuration
  ├── popup/              # Popup page for branch history
```

### Dependencies
  - Fuse.js for fuzzy searching branch history.
  - TypeScript for type safety.
  - Webpack for bundling.