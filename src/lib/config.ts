import UrlPattern from 'url-pattern';

export const REWST_DOMAINS = ['rewst.io', 'rewst.asia', 'rewst.eu', 'localhost'];
export const VSCODE_SERVER_URL = 'http://127.0.0.1:27121';
export const EXPIRY_MS = 12 * 60 * 60 * 1000; // 12 hours

// URL pattern for org routes: /organizations/:orgId/...
export const orgPattern = new UrlPattern('/organizations/:orgId(/*)');

// URL patterns for templates and scripts
export const templatePattern = new UrlPattern('/organizations/:orgId/templates/:templateId(/*)');
export const scriptPattern = new UrlPattern('/organizations/:orgId/scripts/:templateId(/*)');
