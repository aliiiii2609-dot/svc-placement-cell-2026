/// <reference types="vite/client" />

/**
 * Shared, host-agnostic form submission for the Placement Cell forms.
 *
 * One honest path, used by every form:
 *
 *  1. If `VITE_FORM_ENDPOINT` is set, POST the payload as JSON. On an HTTP
 *     2xx response the submission is genuinely received — the site owner can
 *     point this at Formspree, an Apps Script webhook, or a serverless
 *     function with zero code change.
 *  2. If the endpoint is not configured, or the request throws/returns a
 *     non-2xx status, fall back to opening a pre-filled mailto to the cell.
 *     This does NOT navigate the SPA away — it opens the mail client in a
 *     new context and leaves the page intact.
 *
 * The returned channel lets the caller show honest copy: only `endpoint`
 * means "received by our team"; `mailto` means "we opened your mail client".
 */

export const PLACEMENT_EMAIL = 'placement@svc.ac.in';

export type SubmitChannel = 'endpoint' | 'mailto';

export interface SubmitOptions {
  /** Structured payload POSTed as JSON when an endpoint is configured. */
  payload: Record<string, unknown>;
  /** Subject line for the mailto fallback. */
  subject: string;
  /** Plain-text body for the mailto fallback. */
  body: string;
}

/** Build a `mailto:` URL to the placement cell from a subject and body. */
export function buildMailto(subject: string, body: string): string {
  return `mailto:${PLACEMENT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}

/** Open a mailto without navigating the single-page app away. */
export function openMailto(subject: string, body: string): void {
  const url = buildMailto(subject, body);
  // window.open keeps the SPA on the page; if a popup blocker interferes we
  // fall back to an <a> click, which also does not replace the SPA route.
  const opened = window.open(url, '_blank');
  if (!opened) {
    const a = document.createElement('a');
    a.href = url;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

/**
 * Submit a form via the configured endpoint, falling back to a mailto.
 *
 * Resolves with the channel that actually handled the submission so callers
 * can render honest acknowledgement copy.
 */
export async function submitForm(options: SubmitOptions): Promise<SubmitChannel> {
  const endpoint = import.meta.env.VITE_FORM_ENDPOINT as string | undefined;

  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options.payload),
      });
      if (res.ok) return 'endpoint';
    } catch {
      // Network error or CORS failure — fall through to the mailto path.
    }
  }

  openMailto(options.subject, options.body);
  return 'mailto';
}
