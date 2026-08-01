/**
 * The events the widget emits. The strings match the host app's existing
 * analytics vocabulary so no dashboard changes when the widget moves out; the
 * package defines them itself rather than importing the app's full event list,
 * of which these four are the only ones it fires.
 */
export const WIDGET_EVENTS = {
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  CLAIM: 'claim',
  MIGRATE: 'migrate'
} as const
