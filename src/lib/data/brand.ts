/**
 * Brandfetch CDN URL builder.
 *
 * The cell's PR & Outreach desk supplied a Brandfetch client ID that grants
 * access to the public Brand Logo CDN. Logos are fetched at runtime by
 * passing the firm's domain. No build-time fetch required.
 *
 * Reference: https://docs.brandfetch.com/logo-cdn
 *
 * Usage:
 *   <img src={brandLogoUrl('bcg.com')} alt="BCG logo" />
 *
 * If a brand doesn't have a logo on Brandfetch (rare for the firms in our
 * recruiter list, possible for very small Indian boutique firms), the
 * <img> onError handler in each consumer falls back to a brand-color disc
 * with the firm's initials.
 */

const BRANDFETCH_CLIENT_ID = '1idafPpqHDN5N8SWSzM';

const CDN_ORIGIN = 'https://cdn.brandfetch.io';

/**
 * Build the CDN URL for a brand's logo, identified by their primary domain.
 *
 * @param domain  Bare domain like "bcg.com" — no protocol, no path.
 * @param options Optional rendering hints.
 */
export function brandLogoUrl(
  domain: string,
  options: {
    /** Logo type. 'logo' is the standard brand logo, 'symbol' is the icon-only mark. */
    type?: 'logo' | 'symbol' | 'icon';
    /** Theme. 'light' returns a logo intended for use on light surfaces. */
    theme?: 'light' | 'dark';
    /** Fallback strategy if Brandfetch has no record. */
    fallback?: 'transparent' | 'brand' | '404';
  } = {},
): string {
  if (!domain) return '';
  const clean = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const params = new URLSearchParams({ c: BRANDFETCH_CLIENT_ID });
  if (options.type) params.set('type', options.type);
  if (options.theme) params.set('theme', options.theme);
  if (options.fallback) params.set('fallback', options.fallback);
  return `${CDN_ORIGIN}/${clean}?${params.toString()}`;
}

/**
 * Build the icon URL (square brand icon, good for circular tiles).
 */
export function brandIconUrl(domain: string): string {
  return brandLogoUrl(domain, { type: 'icon' });
}

/**
 * Generic ticker logo lookup, useful for listed companies whose primary
 * presence is on a stock exchange (e.g. Tesla → TSLA). Same Brandfetch CDN.
 */
export function brandTickerLogoUrl(ticker: string): string {
  if (!ticker) return '';
  const params = new URLSearchParams({ c: BRANDFETCH_CLIENT_ID });
  return `${CDN_ORIGIN}/ticker/${ticker}?${params.toString()}`;
}
