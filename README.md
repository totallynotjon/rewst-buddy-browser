# Rewst Buddy Browser Extension

Companion extension for [Rewst Buddy VS Code Extension](https://marketplace.visualstudio.com/items?itemName=JBramley.rewst-buddy).

## Features

- **Automatic Session Transfer** - Captures your Rewst session and sends it to VS Code automatically
- **Open in VS Code** - Click the extension icon to open the current template/script in VS Code
- **Multi-Region Support** - Works with all Rewst regions (US, EU, Asia)

## Installation

### Chrome / Edge

1. Clone or download this repository
2. Open `chrome://extensions` (or `edge://extensions` for Edge)
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `build-chrome/` directory

### Firefox

1. Clone or download this repository
2. Open `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `manifest.json` from the `build-firefox/` directory

## Usage

1. Install the [Rewst Buddy VS Code Extension](https://marketplace.visualstudio.com/items?itemName=JBramley.rewst-buddy)
2. Enable the Server in Rewst Buddy extension settings
3. Navigate to any Rewst page - your session transfers automatically
4. Click the extension icon on a template/script page to open it in VS Code

## Related

- [Rewst Buddy VS Code Extension](https://marketplace.visualstudio.com/items?itemName=JBramley.rewst-buddy) - Required companion extension
