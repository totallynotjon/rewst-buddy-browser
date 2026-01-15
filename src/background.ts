import { REWST_DOMAINS, VSCODE_SERVER_URL, EXPIRY_MS } from './lib/config';
import { setupTabListener, setupMessageListener } from './lib/listeners';

// Initialize listeners
setupTabListener();
setupMessageListener();

// Startup logging
console.log('[Rewst Buddy] ==========================================');
console.log('[Rewst Buddy] Background script loaded');
console.log('[Rewst Buddy] Configuration:');
console.log(`[Rewst Buddy]   Domains: ${REWST_DOMAINS.join(', ')}`);
console.log(`[Rewst Buddy]   VSCode Server: ${VSCODE_SERVER_URL}`);
console.log(`[Rewst Buddy]   Cache expiry: ${EXPIRY_MS / 1000 / 60 / 60} hours`);
console.log('[Rewst Buddy] ==========================================');

export { };
