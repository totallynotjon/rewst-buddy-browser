// Browser API polyfill for cross-browser compatibility
const browserAPI = (chrome as any)?.browser || chrome;

// Listen for messages from popup
browserAPI.runtime.onMessage.addListener((request: any, sender: chrome.runtime.MessageSender) => {
  console.log("request");
  
  if (request.action === 'getTabData') {
    // Query for the active tab
    browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
      const tab = tabs[0];

      if (!tab.url) {
        console.error('No URL found for active tab');
        return;
      }

      // Get all cookies for the current tab's URL
      browserAPI.cookies.getAll({ url: tab.url }, (cookies: chrome.cookies.Cookie[]) => {
        // Filter for relevant authentication cookies
        const relevantCookies = cookies.filter(
          (c: chrome.cookies.Cookie) =>
            c.name === "appSession" ||
            c.name === "euAppSession" ||
            c.name.endsWith("ppSession")
        );

        // Prepare data payload for VS Code
        const vscodeData = {
          url: tab.url,
          cookies: relevantCookies.map((c: chrome.cookies.Cookie) => ({
            name: c.name,
            value: c.value,
            domain: c.domain,
            path: c.path,
            secure: c.secure,
            httpOnly: c.httpOnly,
            sameSite: c.sameSite,
            expirationDate: c.expirationDate,
          })),
          tabId: tab.id,
          title: tab.title,
          timestamp: new Date().toISOString(),
        };

        // Generate VS Code protocol URL
        const encodedData = encodeURIComponent(JSON.stringify(vscodeData));
        const vscodeUrl = `vscode://JBramley.rewst-buddy/open?data=${encodedData}`;

        // Open VS Code with the data
        browserAPI.tabs.create({ url: vscodeUrl }, () => {
          console.log('Sent data to VS Code:', vscodeData);
        });
      });
    });

    return true; // Keep the message channel open for async response
  }
});

console.log('Rewst Buddy background script loaded');

// Export to make this a module (prevents global scope pollution)
export {};

