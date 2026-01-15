# Rewst Buddy Browser Extension

A dual Chrome/Firefox browser extension that captures Rewst session data and sends it to VS Code.

## Features

- Captures current tab URL from `*.rewst.io` domains
- Extracts authentication cookies (`appSession`, `euAppSession`, and any cookie ending in `appSession`)
- Sends data to VS Code extension via `vscode://JBramley.rewst-buddy/open?data=...` protocol
- Single TypeScript codebase with dual Chrome/Firefox builds
- Fast esbuild-based build system

## Development Setup

### Prerequisites

- Node.js (via nvm)
- npm

### Installation

```bash
npm install
```

## Build System

This project uses **esbuild** for fast, efficient bundling of TypeScript code. The build script (`scripts/build.ts`) handles:

- TypeScript compilation and bundling
- Browser-specific manifest generation
- Icon asset management
- HTML file copying

## Build Commands

### Development (Watch Mode)
```bash
npm run dev:chrome    # Auto-rebuild for Chrome on file changes
npm run dev:firefox   # Auto-rebuild for Firefox on file changes
```

### Production Builds
```bash
npm run build:chrome  # Build for Chrome
npm run build:firefox # Build for Firefox
npm run build         # Build both browsers
```

### Type Checking
```bash
npm run typecheck     # Run TypeScript type checking
```

## Loading the Extension

### Chrome

1. Run `npm run build:chrome` (or use the "Watch Chrome" task)
2. Open `chrome://extensions`
3. Enable "Developer mode" (toggle in top-right)
4. Click "Load unpacked"
5. Select the `build-chrome/` directory

### Firefox

1. Run `npm run build:firefox` (or use the "Watch Firefox" task)
2. Open `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Navigate to `build-firefox/` and select `manifest.json`

## Usage

1. Navigate to a Rewst domain (e.g., `app.rewst.io`)
2. Click the Rewst Buddy extension icon
3. Click "Send to VS Code"
4. The extension will:
   - Extract the current URL
   - Filter and capture authentication cookies
   - Open VS Code with the data via the protocol URL

## Project Structure

```
rewst-buddy-web/
├── src/
│   ├── background.ts        # Background service worker
│   ├── popup/
│   │   ├── index.html      # Popup UI
│   │   └── index.ts        # Popup logic
├── manifest-chrome.json     # Chrome manifest (Manifest V3)
├── manifest-firefox.json    # Firefox manifest
├── vite.config.ts          # Vite build configuration
├── tsconfig.json           # TypeScript configuration
├── build-chrome/           # Chrome build output (gitignored)
└── build-firefox/          # Firefox build output (gitignored)
```

## Configuration

### Permissions

- `activeTab` - Access current tab info
- `cookies` - Read cookies from Rewst domains
- `tabs` - Create new tabs for VS Code protocol

### Host Permissions

- `https://*.rewst.io/*` - All Rewst subdomains

### Cookie Filtering

The extension captures cookies matching:
- Exact: `appSession`
- Exact: `euAppSession`
- Pattern: Any cookie name ending in `appSession`

### VS Code Integration

Data is sent to: `vscode://JBramley.rewst-buddy/open?data=<encoded>`

Payload format:
```json
{
  "url": "https://app.rewst.io/...",
  "cookies": [
    {
      "name": "appSession",
      "value": "...",
      "domain": ".rewst.io",
      "path": "/",
      "secure": true,
      "httpOnly": true,
      "sameSite": "lax",
      "expirationDate": 1234567890
    }
  ],
  "tabId": 123,
  "title": "Page Title",
  "timestamp": "2025-12-20T..."
}
```

## Next Steps

- [ ] Add error handling and user feedback in popup
- [ ] Consider adding content script if DOM parsing is needed
- [ ] Test with actual VS Code extension integration
- [ ] Add packaging scripts for Chrome Web Store / Firefox Add-ons

## Troubleshooting

### TypeScript Errors

Run type checking: `npm run typecheck`

### Build Failures

Check that all dependencies are installed: `npm install`

### Extension Not Loading

1. Verify the build completed successfully
2. Check browser console for errors
3. Ensure manifest.json exists in build directory
