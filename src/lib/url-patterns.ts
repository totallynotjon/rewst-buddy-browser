import { REWST_DOMAINS, orgPattern, templatePattern, scriptPattern } from './config';

export interface TemplateInfo {
  orgId: string;
  templateId: string;
}

export function isRewstDomain(hostname: string): boolean {
  const result = REWST_DOMAINS.some(domain => hostname.endsWith(domain));
  console.log(`[Rewst Buddy] isRewstDomain("${hostname}") = ${result} (checking against: ${REWST_DOMAINS.join(', ')})`);
  return result;
}

export function extractOrgId(url: string): string | null {
  console.log(`[Rewst Buddy] extractOrgId called with: ${url}`);
  try {
    const urlObj = new URL(url);
    console.log(`[Rewst Buddy]   hostname: ${urlObj.hostname}, pathname: ${urlObj.pathname}`);

    if (!isRewstDomain(urlObj.hostname)) {
      console.log(`[Rewst Buddy]   -> Not a Rewst domain, returning null`);
      return null;
    }

    const match = orgPattern.match(urlObj.pathname);
    console.log(`[Rewst Buddy]   -> Pattern match result:`, match);

    const orgId = match?.orgId || null;
    console.log(`[Rewst Buddy]   -> Extracted orgId: ${orgId}`);
    return orgId;
  } catch (e) {
    console.error(`[Rewst Buddy]   -> Error parsing URL:`, e);
    return null;
  }
}

export function extractTemplateInfo(url: string): TemplateInfo | null {
  console.log(`[Rewst Buddy] extractTemplateInfo called with: ${url}`);
  try {
    const urlObj = new URL(url);

    if (!isRewstDomain(urlObj.hostname)) {
      return null;
    }

    // Try templates pattern first
    let match = templatePattern.match(urlObj.pathname);
    if (match?.orgId && match?.templateId) {
      console.log(`[Rewst Buddy]   -> Matched template:`, match);
      return { orgId: match.orgId, templateId: match.templateId };
    }

    // Try scripts pattern
    match = scriptPattern.match(urlObj.pathname);
    if (match?.orgId && match?.templateId) {
      console.log(`[Rewst Buddy]   -> Matched script:`, match);
      return { orgId: match.orgId, templateId: match.templateId };
    }

    console.log(`[Rewst Buddy]   -> No template/script match`);
    return null;
  } catch (e) {
    console.error(`[Rewst Buddy]   -> Error parsing URL:`, e);
    return null;
  }
}
