// Shared session ID — persisted in memory for the lifetime of the tab
// No localStorage (blocked in sandboxed iframes)
if (!(window as any).__NV_SESSION__) {
  (window as any).__NV_SESSION__ = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export const SESSION_ID: string = (window as any).__NV_SESSION__;
