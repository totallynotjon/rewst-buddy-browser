import { browserAPI } from './browser-api';
import { VSCODE_SERVER_URL } from './config';
import { extractOrgId, extractTemplateInfo } from './url-patterns';
import { sendSessionForOrg } from './cookies';

export function setupTabListener(): void {
  browserAPI.tabs.onUpdated.addListener((
    tabId: number,
    changeInfo: { status?: string; url?: string },
    tab: chrome.tabs.Tab
  ) => {
    console.log(`[Rewst Buddy] tabs.onUpdated event:`, {
      tabId,
      status: changeInfo.status,
      url: changeInfo.url || tab.url || '(none)',
      title: tab.title,
    });

    if (changeInfo.status !== 'complete') {
      console.log(`[Rewst Buddy]   -> Skipping: status is "${changeInfo.status}", not "complete"`);
      return;
    }

    if (!tab.url) {
      console.log(`[Rewst Buddy]   -> Skipping: no tab URL`);
      return;
    }

    console.log(`[Rewst Buddy]   -> Processing completed navigation to: ${tab.url}`);

    const orgId = extractOrgId(tab.url);
    if (!orgId) {
      console.log(`[Rewst Buddy]   -> No orgId extracted, skipping`);
      return;
    }

    console.log(`[Rewst Buddy]   -> Found orgId: ${orgId}`);
    sendSessionForOrg(tab.url, orgId);
  });
}

export function setupMessageListener(): void {
  browserAPI.runtime.onMessage.addListener((
    request: any,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) => {
    console.log('[Rewst Buddy] Message received:', request);

    if (request.action === 'open') {
      browserAPI.tabs.query({ active: true, currentWindow: true }, async (tabs: chrome.tabs.Tab[]) => {
        const tab = tabs[0];

        if (!tab.url) {
          console.log('[Rewst Buddy] No URL found for active tab');
          sendResponse({ success: false, error: 'No URL found' });
          return;
        }

        const templateInfo = extractTemplateInfo(tab.url);
        if (!templateInfo) {
          console.log('[Rewst Buddy] URL does not match template/script pattern');
          sendResponse({ success: false, error: 'Not a template or script page' });
          return;
        }

        const payload = {
          action: 'openTemplate',
          orgId: templateInfo.orgId,
          templateId: templateInfo.templateId,
        };

        console.log('[Rewst Buddy] Sending openTemplate request:', payload);

        try {
          const response = await fetch(VSCODE_SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          console.log('[Rewst Buddy] Server response:', result);
          sendResponse({ success: true, result });
        } catch (error) {
          console.error('[Rewst Buddy] Error sending to server:', error);
          sendResponse({ success: false, error: 'VS Code server not running' });
        }
      });

      return true; // Keep channel open for async response
    }
  });
}
