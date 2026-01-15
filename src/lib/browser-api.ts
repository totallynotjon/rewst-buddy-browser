// Browser API polyfill for cross-browser compatibility (Chrome/Firefox)
export const browserAPI = (chrome as any)?.browser || chrome;
