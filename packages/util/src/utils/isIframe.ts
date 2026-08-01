/**
 * True when the page is rendered inside an iframe — a Safe App, a Ledger Live
 * embed, or a block explorer. The wallet layer uses this to prefer a direct
 * connector over opening a modal that the host frame may block.
 */
export function isIframe(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  if (window !== window.top || window.top !== window.self || (document?.location?.ancestorOrigins || []).length !== 0) {
    return true
  }
  return false
}
