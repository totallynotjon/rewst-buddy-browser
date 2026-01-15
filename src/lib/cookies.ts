import { browserAPI } from './browser-api';
import { VSCODE_SERVER_URL } from './config';

export async function sendSessionForOrg(url: string, orgId: string): Promise<void> {
  console.log(`[Rewst Buddy] ========== SENDING SESSION ==========`);
  console.log(`[Rewst Buddy] URL: ${url}`);
  console.log(`[Rewst Buddy] OrgId: ${orgId}`);
  console.log(`[Rewst Buddy] Target server: ${VSCODE_SERVER_URL}`);

  try {
    console.log(`[Rewst Buddy] Fetching cookies for URL: ${url}`);
    const cookies: chrome.cookies.Cookie[] = await new Promise((resolve) => {
      browserAPI.cookies.getAll({ url }, resolve);
    });

    console.log(`[Rewst Buddy] Total cookies found: ${cookies.length}`);
    console.log(`[Rewst Buddy] All cookies:`, cookies.map(c => ({ name: c.name, domain: c.domain })));

    const sessionCookies = cookies.filter(c =>
      c.name.toLowerCase().includes('session')
    );

    console.log(`[Rewst Buddy] Session cookies found: ${sessionCookies.length}`);
    console.log(`[Rewst Buddy] Session cookie names:`, sessionCookies.map(c => c.name));

    if (sessionCookies.length === 0) {
      console.log('[Rewst Buddy] No session cookies found - aborting send');
      return;
    }

    const cookieString = sessionCookies
      .map(c => `${c.name}=${c.value}`)
      .join('; ');

    const payload = { action: 'addSession', cookies: cookieString };
    console.log(`[Rewst Buddy] Sending payload:`, { action: payload.action, cookiesLength: cookieString.length });

    const response = await fetch(VSCODE_SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log(`[Rewst Buddy] Response status: ${response.status} ${response.statusText}`);

    const result = await response.json();
    console.log('[Rewst Buddy] VSCode response:', result);

  } catch (error) {
    console.error('[Rewst Buddy] Error sending to VSCode server:', error);
    console.log('[Rewst Buddy] VSCode server may not be running');
  }
  console.log(`[Rewst Buddy] ======================================`);
}
