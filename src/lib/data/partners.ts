import type { Recruiter } from '@/types';

/**
 * Recruiter partners.
 *
 * Sourced from the cell's official placement records for cycles 2024-25 and
 * 2025-26, deduplicated. The list is the real set of firms that engaged with
 * the cell across these cycles.
 *
 * Logos are loaded from the Brandfetch CDN via the `domain` field at runtime:
 *   https://cdn.brandfetch.io/{domain}?c={BRANDFETCH_CLIENT_ID}
 * See src/lib/data/brand.ts for the URL builder.
 *
 * Confidentiality:
 *   The Recruiter type has NO ctc field and NO offerCount field. Aggregate
 *   cycle stats live in stats.ts. Per-firm outcomes are never published.
 */

export const recruiters: Recruiter[] = [
  // Audit & Assurance
  { slug: 'deloitte', name: 'Deloitte', sector: 'Audit & Assurance', domain: 'deloitte.com', brandColor: '#86bc25', featured: true },
  { slug: 'ey', name: 'EY', sector: 'Audit & Assurance', domain: 'ey.com', brandColor: '#ffe600', featured: true },
  { slug: 'kpmg', name: 'KPMG', sector: 'Audit & Assurance', domain: 'kpmg.com', brandColor: '#00338d', featured: true },
  { slug: 'pwc', name: 'PwC', sector: 'Audit & Assurance', domain: 'pwc.com', brandColor: '#dc6900', featured: true },
  { slug: 'grant-thornton', name: 'Grant Thornton Bharat', sector: 'Audit & Assurance', domain: 'grantthornton.in', brandColor: '#5e2750', featured: true },
  { slug: 'sw-india', name: 'SW India', sector: 'Audit & Assurance', domain: 'swindia.com', brandColor: '#1a4d8c' },
  { slug: 'bobby-parikh-associates', name: 'Bobby Parikh Associates', sector: 'Audit & Assurance', domain: 'bobbyparikh.com', brandColor: '#b85c38' },

  // Consulting & Strategy
  { slug: 'bcg', name: 'BCG', sector: 'Consulting & Strategy', domain: 'bcg.com', brandColor: '#1f4e3d', featured: true },
  { slug: 'bain', name: 'Bain Capability Network', sector: 'Consulting & Strategy', domain: 'bain.com', brandColor: '#cc0000', featured: true },
  { slug: 'accenture', name: 'Accenture', sector: 'Consulting & Strategy', domain: 'accenture.com', brandColor: '#a100ff', featured: true },
  { slug: 'alea-consulting', name: 'Alea Consulting', sector: 'Consulting & Strategy', domain: 'aleaconsulting.com', brandColor: '#3a4e6d' },
  { slug: 'glg', name: 'Gerson Lehrman Group', sector: 'Consulting & Strategy', domain: 'glginsights.com', brandColor: '#0d2545', featured: true },
  { slug: 'inflection-point', name: 'Inflection Point', sector: 'Consulting & Strategy', domain: 'inflectionpointglobal.com', brandColor: '#1a4e8a' },
  { slug: 'lagrange-point', name: 'Lagrange Point International', sector: 'Consulting & Strategy', domain: 'lagrangepoint.in', brandColor: '#2c5282' },
  { slug: 'clairvolex', name: 'Clairvolex', sector: 'Consulting & Strategy', domain: 'clairvolex.com', brandColor: '#3a4e6d' },

  // Finance & Markets
  { slug: 'de-shaw', name: 'D.E. Shaw India', sector: 'Finance & Markets', domain: 'deshaw.com', brandColor: '#bd1e2c', featured: true },
  { slug: 'goldman-sachs', name: 'Goldman Sachs', sector: 'Finance & Markets', domain: 'goldmansachs.com', brandColor: '#7399c6', featured: true },
  { slug: 'futures-first', name: 'Futures First', sector: 'Finance & Markets', domain: 'futuresfirst.com', brandColor: '#1a3a52', featured: true },
  { slug: 'oxane-partners', name: 'Oxane Partners', sector: 'Finance & Markets', domain: 'oxanepartners.com', brandColor: '#1c4d7a', featured: true },
  { slug: 'daloopa', name: 'Daloopa', sector: 'Finance & Markets', domain: 'daloopa.com', brandColor: '#00875a' },
  { slug: 'delta-x', name: 'Delta X', sector: 'Finance & Markets', domain: 'deltacapita.com', brandColor: '#00a37e' },
  { slug: 'verity', name: 'Verity Knowledge Solutions', sector: 'Finance & Markets', domain: 'verityks.com', brandColor: '#0066cc', featured: true },

  // Banking & Insurance
  { slug: 'wtw', name: 'Willis Towers Watson', sector: 'Banking & Insurance', domain: 'wtwco.com', brandColor: '#3b1b6f', featured: true },
  { slug: 'aon', name: 'AON', sector: 'Banking & Insurance', domain: 'aon.com', brandColor: '#c8102e', featured: true },
  { slug: 'rsa', name: 'RSA Actuarial Services', sector: 'Banking & Insurance', domain: 'rsagroup.com', brandColor: '#1c4d7a' },
  { slug: 'care-health', name: 'Care Health Insurance', sector: 'Banking & Insurance', domain: 'careinsurance.com', brandColor: '#005f9e' },
  { slug: 'digit-insurance', name: 'Digit Insurance', sector: 'Banking & Insurance', domain: 'godigit.com', brandColor: '#1a4d8a' },
  { slug: 'icici-bank', name: 'ICICI Bank', sector: 'Banking & Insurance', domain: 'icicibank.com', brandColor: '#f37a25', featured: true },
  { slug: 'hdfc-bank', name: 'HDFC Bank', sector: 'Banking & Insurance', domain: 'hdfcbank.com', brandColor: '#004c8f', featured: true },
  { slug: 'icici-prudential', name: 'ICICI Prudential Life', sector: 'Banking & Insurance', domain: 'iciciprulife.com', brandColor: '#f37a25', featured: true },
  { slug: 'bajaj-capital', name: 'Bajaj Capital', sector: 'Banking & Insurance', domain: 'bajajcapital.com', brandColor: '#1a4d8a' },
  { slug: 'nomura-research', name: 'Nomura Research', sector: 'Banking & Insurance', domain: 'nomura.com', brandColor: '#bd1e2c', featured: true },

  // Analytics & Research
  { slug: 'genpact', name: 'Genpact', sector: 'Analytics & Research', domain: 'genpact.com', brandColor: '#0070c0', featured: true },
  { slug: 'exl', name: 'EXL', sector: 'Analytics & Research', domain: 'exlservice.com', brandColor: '#1e3a8a', featured: true },
  { slug: 'acxiom', name: 'Acxiom', sector: 'Analytics & Research', domain: 'acxiom.com', brandColor: '#005baa' },
  { slug: 'procdna', name: 'ProcDNA', sector: 'Analytics & Research', domain: 'procdna.com', brandColor: '#1a4d8a' },
  { slug: 'flink-analytics', name: 'Flink Analytics & Insights', sector: 'Analytics & Research', domain: 'flinkanalytics.com', brandColor: '#0070c0' },
  { slug: 'infollion', name: 'Infollion', sector: 'Analytics & Research', domain: 'infollion.com', brandColor: '#1a4d8a' },
  { slug: 'preferred-square', name: 'Preferred Square', sector: 'Analytics & Research', domain: 'preferredsquare.com', brandColor: '#1c4d7a' },

  // Product & Tech
  { slug: 'zomato', name: 'Zomato', sector: 'Product & Tech', domain: 'zomato.com', brandColor: '#e23744', featured: true },
  { slug: 'hcl-technologies', name: 'HCL Technologies', sector: 'Product & Tech', domain: 'hcltech.com', brandColor: '#005faf' },
  { slug: 'hubspot', name: 'HubSpot', sector: 'Product & Tech', domain: 'hubspot.com', brandColor: '#ff7a59' },
  { slug: 'salescode', name: 'Salescode', sector: 'Product & Tech', domain: 'salescode.ai', brandColor: '#0d6efd' },
  { slug: 'recruit-crm', name: 'Recruit CRM', sector: 'Product & Tech', domain: 'recruitcrm.io', brandColor: '#1a8cff' },
  { slug: 'code-vyasa', name: 'Code Vyasa', sector: 'Product & Tech', domain: 'codevyasa.com', brandColor: '#1a4d8a' },
  { slug: 'visiontek', name: 'Visiontek Engineers', sector: 'Product & Tech', domain: 'visiontek.in', brandColor: '#1a4d8a' },

  // Hospitality & Aviation
  { slug: 'bribooks', name: 'Bribooks', sector: 'Hospitality & Aviation', domain: 'bribooks.com', brandColor: '#7b3aed' },
  { slug: 'tophire', name: 'Tophire', sector: 'Hospitality & Aviation', domain: 'tophire.co', brandColor: '#1a4d8a' },
  { slug: 'studio-mosaic', name: 'Studio Mosaic', sector: 'Hospitality & Aviation', domain: 'studiomosaicapps.com', brandColor: '#e53935' },
  { slug: 'ecom-express', name: 'Ecom Express', sector: 'Hospitality & Aviation', domain: 'ecomexpress.in', brandColor: '#c8102e' },
  { slug: 'oberoi-group', name: 'Oberoi Group', sector: 'Hospitality & Aviation', domain: 'oberoihotels.com', brandColor: '#8b6914' },
  { slug: 'air-india', name: 'Air India', sector: 'Hospitality & Aviation', domain: 'airindia.com', brandColor: '#bd1e2c' },
  { slug: 'ds-group', name: 'DS Group', sector: 'Hospitality & Aviation', domain: 'dsgroup.com', brandColor: '#005faf' },
  { slug: 'signature-global', name: 'Signature Global', sector: 'Hospitality & Aviation', domain: 'signatureglobal.in', brandColor: '#1a4d8a' },

  // EdTech & Operations
  { slug: 'niit', name: 'NIIT', sector: 'EdTech & Operations', domain: 'niit.com', brandColor: '#003a70' },
  { slug: 'intellipaat', name: 'Intellipaat', sector: 'EdTech & Operations', domain: 'intellipaat.com', brandColor: '#fa5d11' },
  { slug: 'vmock', name: 'VMock', sector: 'EdTech & Operations', domain: 'vmock.com', brandColor: '#0066cc' },
  { slug: 'acmegrade', name: 'Acmegrade', sector: 'EdTech & Operations', domain: 'acmegrade.com', brandColor: '#1a4d8a' },
  { slug: 'my-captain', name: 'My Captain', sector: 'EdTech & Operations', domain: 'mycaptain.in', brandColor: '#7b3aed' },
  { slug: 'planet-spark', name: 'PlanetSpark', sector: 'EdTech & Operations', domain: 'planetspark.in', brandColor: '#5a3aed' },
  { slug: 'masters-union', name: 'Masters Union', sector: 'EdTech & Operations', domain: 'mastersunion.org', brandColor: '#0a0a0a' },
  { slug: 'jaro-education', name: 'Jaro Education', sector: 'EdTech & Operations', domain: 'jaroeducation.com', brandColor: '#003a70' },

  // Policy & Public
  { slug: 'ditto-finshots', name: 'Ditto by Finshots', sector: 'Policy & Public', domain: 'joinditto.in', brandColor: '#10b981' },
  { slug: 'nation-with-namo', name: 'Nation with NaMo', sector: 'Policy & Public', domain: 'nationwithnamo.com', brandColor: '#ff9933' },
  { slug: 'samagra-governance', name: 'Samagra Governance', sector: 'Policy & Public', domain: 'samagragovernance.in', brandColor: '#1a4d8a' },

];

export const PARTNER_COUNT = recruiters.length;

/**
 * Group recruiters by sector for the partnerships and directory pages.
 */
export function recruitersBySector(): Record<string, Recruiter[]> {
  return recruiters.reduce(
    (acc, r) => {
      if (!acc[r.sector]) acc[r.sector] = [];
      acc[r.sector].push(r);
      return acc;
    },
    {} as Record<string, Recruiter[]>,
  );
}
