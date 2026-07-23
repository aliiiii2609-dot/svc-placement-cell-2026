import type { PlacementStats } from '@/types';

/**
 * SINGLE SOURCE OF TRUTH for every number on the site.
 *
 * Provenance (every number below comes from a primary source):
 *   - Cycles 17-18, 19-20, 20-21, 21-22, 22-23, 23-24:
 *       Computed from the cell's annual Placement Cell Reports
 *       (company-level CTC and offer-count records). Aggregated to
 *       peak / average / median / top-decile / gross.
 *   - Cycle 24-25: Reproduced from the 2025-26 Recruitment Brochure
 *       (Recruitment Highlights, page 12) verbatim.
 *   - Cycle 25-26: Interim numbers from the cell's April 2026 handoff
 *       (cycle in progress).
 *
 * Hardcoded numbers in components are not allowed. If you find one
 * anywhere, replace it with a read from this file.
 *
 * Honesty note: peak CTC across cycles is NOT monotonically increasing.
 * The 23-24 dip from 22-23 is in the cell's own report. We surface the
 * real numbers with year-on-year context rather than smoothing them.
 */

// 2025-26 figures per the official college placements page (svc.ac.in/placements).
export const currentCycleStats: PlacementStats = {
  cycle: '2025-26',
  status: 'in-progress',
  totalPlacementOffers: 130,
  totalInternshipOffers: 245,
  peakCtcLPA: 15.98,
  averageCtcLPA: 7.19,
  medianCtcLPA: 7.0,
  topDecileAverageLPA: 14.35,
  grossOfferValueCr: 9.13,
  recruitersEngaged: 100,
  convertingRecruiters: 18,
  highestStipendLPM: 1.75,
  streamSplit: {
    commerce: 68,
    arts: 19,
    science: 13,
  },
  sectorSplit: [
    { sector: 'Audit & Assurance', percentage: 33 },
    { sector: 'Finance & Markets', percentage: 27 },
    { sector: 'Consulting & Strategy', percentage: 20 },
    { sector: 'Consumer & BD', percentage: 12 },
    { sector: 'Other', percentage: 8 },
  ],
};

/** Cycle 24-25 — from brochure page 12. */
export const previousCycleStats: PlacementStats = {
  cycle: '2024-25',
  status: 'closed',
  totalPlacementOffers: 114,
  totalInternshipOffers: 180,
  peakCtcLPA: 13.4,
  averageCtcLPA: 6.43,
  medianCtcLPA: 6.05,
  topDecileAverageLPA: 10.1,
  grossOfferValueCr: 6.8,
  recruitersEngaged: 70,
  convertingRecruiters: 32,
  highestStipendLPM: 1.75,
  streamSplit: {
    commerce: 78,
    arts: 17,
    science: 5,
  },
  sectorSplit: [
    { sector: 'Consulting & Strategy', percentage: 28 },
    { sector: 'Finance & Markets', percentage: 22 },
    { sector: 'Audit & Assurance', percentage: 18 },
    { sector: 'Consumer & BD', percentage: 14 },
    { sector: 'Other', percentage: 18 },
  ],
};

/**
 * Multi-cycle trend.
 *
 * Numbers below are COMPUTED from the cell's annual placement reports,
 * not invented. Source paste includes per-company CTC and offer counts;
 * `peak`, `avg`, `median`, `topDecile`, and `grossCr` are aggregated from
 * those records. `offers` reflects the report's reported total placement
 * offers (which can exceed the records summed because of articleships
 * and "other programmes" categories the records list doesn't expand).
 */
export const trendCycles: Array<{
  cycle: string;
  offers: number;
  peak: number;
  avg: number;
  median: number;
  topDecile: number;
  grossCr: number;
  recruiters: number;
}> = [
  { cycle: '17-18', offers: 162, peak: 16.75, avg: 4.45, median: 4.00, topDecile: 9.19, grossCr: 6.50, recruiters: 44 },
  { cycle: '19-20', offers: 134, peak: 11.50, avg: 5.26, median: 5.02, topDecile: 10.00, grossCr: 6.31, recruiters: 30 },
  { cycle: '20-21', offers: 138, peak: 19.00, avg: 6.03, median: 5.50, topDecile: 15.96, grossCr: 7.23, recruiters: 32 },
  { cycle: '21-22', offers: 178, peak: 21.50, avg: 6.05, median: 6.05, topDecile: 11.86, grossCr: 9.61, recruiters: 23 },
  { cycle: '22-23', offers: 242, peak: 21.50, avg: 6.81, median: 5.10, topDecile: 16.35, grossCr: 11.71, recruiters: 21 },
  { cycle: '23-24', offers: 175, peak: 12.88, avg: 5.66, median: 5.48, topDecile: 9.83, grossCr: 9.85, recruiters: 28 },
  { cycle: '24-25', offers: 114, peak: 13.40, avg: 6.43, median: 6.05, topDecile: 10.10, grossCr: 6.80, recruiters: 70 },
  { cycle: '25-26', offers: 114, peak: 15.98, avg: 7.30, median: 7.00, topDecile: 14.35, grossCr: 8.32, recruiters: 60 },
];

/**
 * Top recruiters per cycle, ranked by offer count in that cycle.
 * Pulled directly from the cell's reports. Used by the cinematic
 * recruiter-highlights reel.
 */
/**
 * Recruiter prestige tier. Premium: MBB consulting (McKinsey, BCG, Bain),
 * Goldman Sachs, D.E. Shaw, Big 4 (Deloitte, EY, KPMG, PwC), American
 * Express, Nomura Research, Barclays, top-tier ICICI Prudential Life,
 * Arcesium, DSP BlackRock. Strong: Accenture, ZS, AON, WTW, Genpact, EXL,
 * HCL Tech, ICICI Bank, HDFC Bank, TresVista, Grant Thornton, BSR & Co,
 * Futures First, Oxane Partners, Milliman, Bajaj Capital, RSA, Dyson.
 * Standard: every other firm.
 */
export type RecruiterTier = 'premium' | 'strong' | 'standard';

export interface CycleRecruiter {
  name: string;
  tier: RecruiterTier;
}

/**
 * Top recruiters per cycle, ranked premium-first then by offer count in
 * that cycle. Pulled directly from the cell's annual reports (offer-level
 * records). Names match what the cell uses on its publications. Used by
 * the cinematic recruiter-highlights chip grid.
 *
 * Lists are intentionally long (15-22 per cycle) so the reader sees the
 * actual breadth of cycle activity, not a curated highlight. No invented
 * recruiters. Premium tier is rendered with brand-color accent in the UI.
 */
export const cycleHeadlineRecruiters: Array<{
  cycle: string;
  marquee: CycleRecruiter[];
}> = [
  {
    cycle: '17-18',
    marquee: [
      // Premium
      { name: 'D.E. Shaw',           tier: 'premium'  },
      { name: 'McKinsey',            tier: 'premium'  },
      { name: 'American Express',    tier: 'premium'  },
      { name: 'DSP BlackRock',       tier: 'premium'  },
      { name: 'PwC India',           tier: 'premium'  },
      { name: 'KPMG India',          tier: 'premium'  },
      { name: 'EY India',            tier: 'premium'  },
      { name: 'Deloitte USI',        tier: 'premium'  },
      { name: 'EY GDS',              tier: 'premium'  },
      { name: 'Deloitte Consulting', tier: 'premium'  },
      // Strong
      { name: 'ZS Associates',       tier: 'strong'   },
      { name: 'FIS',                 tier: 'strong'   },
      { name: 'Dyson',               tier: 'strong'   },
      { name: 'Zomato',              tier: 'strong'   },
      { name: 'Genpact',             tier: 'strong'   },
      { name: 'EXL',                 tier: 'strong'   },
      { name: 'WTW',                 tier: 'strong'   },
      { name: 'Bain Capability Network', tier: 'strong' },
      { name: 'Accenture',           tier: 'strong'   },
      // Standard
      { name: 'BYJU\'S',             tier: 'standard' },
      { name: 'Concentrix',          tier: 'standard' },
      { name: 'Mobikwik',            tier: 'standard' },
      { name: 'NIIT',                tier: 'standard' },
      { name: 'OYO',                 tier: 'standard' },
      { name: 'Snapdeal',            tier: 'standard' },
      { name: 'PolicyBazaar',        tier: 'standard' },
      { name: 'Paytm',               tier: 'standard' },
    ],
  },
  {
    cycle: '19-20',
    marquee: [
      // Premium
      { name: 'McKinsey Knowledge Center', tier: 'premium'  },
      { name: 'BCG',                        tier: 'premium'  },
      { name: 'Deloitte USI',               tier: 'premium'  },
      { name: 'KPMG India',                 tier: 'premium'  },
      { name: 'EY GDS',                     tier: 'premium'  },
      { name: 'PwC India',                  tier: 'premium'  },
      { name: 'Bain Capability Network',    tier: 'premium'  },
      { name: 'American Express',           tier: 'premium'  },
      // Strong
      { name: 'AON Service',                tier: 'strong'   },
      { name: 'AXA XL',                     tier: 'strong'   },
      { name: 'WTW',                        tier: 'strong'   },
      { name: 'ZS Associates',              tier: 'strong'   },
      { name: 'AIG',                        tier: 'strong'   },
      { name: 'EXL',                        tier: 'strong'   },
      { name: 'FIS',                        tier: 'strong'   },
      { name: 'Genpact',                    tier: 'strong'   },
      { name: 'Bajaj Capital',              tier: 'strong'   },
      // Standard
      { name: 'Byjus',                      tier: 'standard' },
      { name: 'United Airlines',            tier: 'standard' },
      { name: 'Great Learning',             tier: 'standard' },
      { name: 'NIIT',                       tier: 'standard' },
      { name: 'Wipro',                      tier: 'standard' },
      { name: 'KPMG GDC',                   tier: 'standard' },
    ],
  },
  {
    cycle: '20-21',
    marquee: [
      // Premium
      { name: 'D.E. Shaw',                  tier: 'premium'  },
      { name: 'McKinsey',                   tier: 'premium'  },
      { name: 'Deloitte',                   tier: 'premium'  },
      { name: 'KPMG India',                 tier: 'premium'  },
      { name: 'EY India',                   tier: 'premium'  },
      { name: 'PwC Actuarial',              tier: 'premium'  },
      { name: 'Bain Capability Network',    tier: 'premium'  },
      // Strong
      { name: 'Accenture',                  tier: 'strong'   },
      { name: 'WTW',                        tier: 'strong'   },
      { name: 'HCL Technologies',           tier: 'strong'   },
      { name: 'AON Services',               tier: 'strong'   },
      { name: 'EXL Service',                tier: 'strong'   },
      { name: 'ZS Associates',              tier: 'strong'   },
      { name: 'Genpact',                    tier: 'strong'   },
      { name: 'Milliman',                   tier: 'strong'   },
      // Standard
      { name: 'Better.com',                 tier: 'standard' },
      { name: 'Wise Finserve',              tier: 'standard' },
      { name: 'Urban Company',              tier: 'standard' },
      { name: 'Byju\'s',                    tier: 'standard' },
      { name: 'Wipro',                      tier: 'standard' },
      { name: 'United Airlines',            tier: 'standard' },
      { name: 'Capgemini',                  tier: 'standard' },
      { name: 'Infosys',                    tier: 'standard' },
    ],
  },
  {
    cycle: '21-22',
    marquee: [
      { name: 'D.E. Shaw',                  tier: 'premium'  },
      { name: 'Boston Consulting Group',    tier: 'premium'  },
      { name: 'Nomura Research',            tier: 'premium'  },
      { name: 'Barclays',                   tier: 'premium'  },
      { name: 'Deloitte USI',               tier: 'premium'  },
      { name: 'KPMG India',                 tier: 'premium'  },
      { name: 'KPMG Global Services',       tier: 'premium'  },
      { name: 'PwC India',                  tier: 'premium'  },
      { name: 'Accenture',                  tier: 'strong'   },
      { name: 'AON Consulting',             tier: 'strong'   },
      { name: 'TresVista',                  tier: 'strong'   },
      { name: 'EXL Services',               tier: 'strong'   },
      { name: 'Willis Towers Watson',       tier: 'strong'   },
      { name: 'Milliman',                   tier: 'strong'   },
      { name: 'RSA',                        tier: 'strong'   },
      { name: 'Wise Finserv',               tier: 'standard' },
      { name: 'Upgrad',                     tier: 'standard' },
      { name: 'Jaro Education',             tier: 'standard' },
      { name: 'Wipro',                      tier: 'standard' },
      { name: 'PayTm',                      tier: 'standard' },
    ],
  },
  {
    cycle: '22-23',
    marquee: [
      { name: 'D.E. Shaw',                  tier: 'premium'  },
      { name: 'Bain Capability Network',    tier: 'premium'  },
      { name: 'Nomura Research',            tier: 'premium'  },
      { name: 'ICICI Prudential Life',      tier: 'premium'  },
      { name: 'Deloitte USI',               tier: 'premium'  },
      { name: 'KPMG India',                 tier: 'premium'  },
      { name: 'KPMG Global Services',       tier: 'premium'  },
      { name: 'EY India',                   tier: 'premium'  },
      { name: 'PwC India',                  tier: 'premium'  },
      { name: 'AON Consulting',             tier: 'strong'   },
      { name: 'Willis Towers Watson',       tier: 'strong'   },
      { name: 'ZS Associates',              tier: 'strong'   },
      { name: 'Grant Thornton',             tier: 'strong'   },
      { name: 'EXL Services',               tier: 'strong'   },
      { name: 'Genpact',                    tier: 'strong'   },
      { name: 'TresVista',                  tier: 'strong'   },
      { name: 'Milliman',                   tier: 'strong'   },
      { name: 'United Airlines',            tier: 'standard' },
      { name: 'Internshala',                tier: 'standard' },
      { name: 'MakeMyTrip',                 tier: 'standard' },
    ],
  },
  {
    cycle: '23-24',
    marquee: [
      { name: 'Nomura Research',            tier: 'premium'  },
      { name: 'Deloitte USI',               tier: 'premium'  },
      { name: 'KPMG India',                 tier: 'premium'  },
      { name: 'KPMG Global Services',       tier: 'premium'  },
      { name: 'EY India',                   tier: 'premium'  },
      { name: 'PwC India',                  tier: 'premium'  },
      { name: 'Accenture',                  tier: 'strong'   },
      { name: 'BSR & Co.',                  tier: 'strong'   },
      { name: 'Futures First',              tier: 'strong'   },
      { name: 'Oxane Partners',             tier: 'strong'   },
      { name: 'WTW India',                  tier: 'strong'   },
      { name: 'Milliman',                   tier: 'strong'   },
      { name: 'Bajaj Capital',              tier: 'strong'   },
      { name: 'RSA Actuarial',              tier: 'strong'   },
      { name: 'Zomato',                     tier: 'strong'   },
      { name: 'Clairvolex',                 tier: 'standard' },
      { name: 'Air India',                  tier: 'standard' },
      { name: 'Ecom Express',               tier: 'standard' },
      { name: 'Ditto by Finshots',          tier: 'standard' },
      { name: 'PlanetSpark',                tier: 'standard' },
    ],
  },
  {
    cycle: '24-25',
    marquee: [
      // Premium tier
      { name: 'BCG',                        tier: 'premium'  },
      { name: 'Bain & Company',             tier: 'premium'  },
      { name: 'Goldman Sachs',              tier: 'premium'  },
      { name: 'Deloitte',                   tier: 'premium'  },
      { name: 'EY',                         tier: 'premium'  },
      { name: 'KPMG',                       tier: 'premium'  },
      { name: 'PwC India',                  tier: 'premium'  },
      { name: 'Nomura Research',            tier: 'premium'  },
      { name: 'ICICI Prudential Life',      tier: 'premium'  },
      { name: 'American Express',           tier: 'premium'  },
      { name: 'Barclays',                   tier: 'premium'  },
      // Strong tier
      { name: 'Accenture',                  tier: 'strong'   },
      { name: 'ICICI Bank',                 tier: 'strong'   },
      { name: 'HDFC Bank',                  tier: 'strong'   },
      { name: 'HCL Technologies',           tier: 'strong'   },
      { name: 'TresVista',                  tier: 'strong'   },
      { name: 'Grant Thornton',             tier: 'strong'   },
      { name: 'AON',                        tier: 'strong'   },
      { name: 'WTW',                        tier: 'strong'   },
      { name: 'Bajaj Capital',              tier: 'strong'   },
      { name: 'ZS Associates',              tier: 'strong'   },
      { name: 'EXL Service',                tier: 'strong'   },
      { name: 'Genpact',                    tier: 'strong'   },
      { name: 'BSR & Co.',                  tier: 'strong'   },
      { name: 'Milliman',                   tier: 'strong'   },
      // Standard tier
      { name: 'Zomato',                     tier: 'standard' },
      { name: 'Masters Union',              tier: 'standard' },
      { name: 'Wells Fargo',                tier: 'standard' },
      { name: 'Société Générale',           tier: 'standard' },
      { name: 'Wipro',                      tier: 'standard' },
      { name: 'GLG',                        tier: 'standard' },
      { name: 'HubSpot',                    tier: 'standard' },
    ],
  },
  {
    cycle: '25-26',
    marquee: [
      // Premium tier
      { name: 'Bain & Company',             tier: 'premium'  },
      { name: 'BCG',                        tier: 'premium'  },
      { name: 'Goldman Sachs',              tier: 'premium'  },
      { name: 'D.E. Shaw',                  tier: 'premium'  },
      { name: 'Arcesium',                   tier: 'premium'  },
      { name: 'EY',                         tier: 'premium'  },
      { name: 'Deloitte',                   tier: 'premium'  },
      { name: 'KPMG',                       tier: 'premium'  },
      { name: 'PwC India',                  tier: 'premium'  },
      { name: 'Nomura Research',            tier: 'premium'  },
      { name: 'American Express',           tier: 'premium'  },
      { name: 'ICICI Prudential Life',      tier: 'premium'  },
      // Strong tier
      { name: 'Accenture',                  tier: 'strong'   },
      { name: 'ZS Associates',              tier: 'strong'   },
      { name: 'AON',                        tier: 'strong'   },
      { name: 'Zomato',                     tier: 'strong'   },
      { name: 'TresVista',                  tier: 'strong'   },
      { name: 'Oxane Partners',             tier: 'strong'   },
      { name: 'Grant Thornton',             tier: 'strong'   },
      { name: 'Futures First',              tier: 'strong'   },
      { name: 'ICICI Bank',                 tier: 'strong'   },
      { name: 'HDFC Bank',                  tier: 'strong'   },
      { name: 'WTW',                        tier: 'strong'   },
      { name: 'EXL Service',                tier: 'strong'   },
      { name: 'Genpact',                    tier: 'strong'   },
      // Standard tier
      { name: 'Masters Union',              tier: 'standard' },
      { name: 'GLG',                        tier: 'standard' },
      { name: 'HubSpot',                    tier: 'standard' },
      { name: 'Wells Fargo',                tier: 'standard' },
    ],
  },
];

/**
 * IFair editions.
 * 2024 (8th): 595 registrations, 62 startups/NGOs/corporates, 490+ internship offers,
 *             chief guest Mr. Shalabh Hajela.
 * Earlier editions and 2025/2026 fall back to figures stated in the brochure.
 */
export const ifairEditions = [
  { year: '2023', edition: '7th', orgs: 52, regs: 680, offers: 295, chiefGuest: 'Eti Gupta, GM at Asteria Aerospace' },
  { year: '2024', edition: '8th', orgs: 62, regs: 595, offers: 490, chiefGuest: 'Shalabh Hajela, CA + IFRS (ACCA UK)' },
  { year: '2025', edition: '9th', orgs: 55, regs: 347, offers: 165, chiefGuest: "Leandro D'Sylva, Global Training Director at Miller Wymann USA" },
] as const;

/** Course-wise batch breakdown for Batch of 2026, from the 2025-26 brochure. */
export const courseBatchBreakdown: Array<{ course: string; strength: number; stream: 'Commerce' | 'Arts' | 'Science' }> = [
  { course: 'B.Com (H)', strength: 316, stream: 'Commerce' },
  { course: 'B.Com (P)', strength: 296, stream: 'Commerce' },
  { course: 'B.A. (P)', strength: 252, stream: 'Arts' },
  { course: 'Economics', strength: 129, stream: 'Arts' },
  { course: 'English', strength: 119, stream: 'Arts' },
  { course: 'Hindi', strength: 111, stream: 'Arts' },
  { course: 'History', strength: 107, stream: 'Arts' },
  { course: 'Political Science', strength: 134, stream: 'Arts' },
  { course: 'Sanskrit', strength: 65, stream: 'Arts' },
  { course: 'Sociology', strength: 100, stream: 'Arts' },
  { course: 'Biochemistry', strength: 116, stream: 'Science' },
  { course: 'Bio Sciences', strength: 108, stream: 'Science' },
  { course: 'Botany', strength: 77, stream: 'Science' },
  { course: 'Chemistry', strength: 133, stream: 'Science' },
  { course: 'Electronics', strength: 80, stream: 'Science' },
  { course: 'Life Sciences', strength: 299, stream: 'Science' },
  { course: 'Mathematics', strength: 227, stream: 'Science' },
  { course: 'Physics', strength: 94, stream: 'Science' },
  { course: 'Statistics', strength: 83, stream: 'Science' },
  { course: 'Zoology', strength: 80, stream: 'Science' },
];

/** Institution-level facts. */
export const institutionFacts = {
  foundedYear: 1961,
  patronage: 'Tirumala Tirupati Devasthanams (TTD) Trust',
  affiliation: 'University of Delhi',
  campus: 'South Campus, Dhaula Kuan',
  pincode: '110021',
  rankings: {
    indiaToday: 7,
    outlook: 6,
    nirf: 11,
    naacGrade: 'A+',
  },
  courses: 20,
  societies: 30,
  batch2026Strength: 2926,
  internshipOffers202324: 850,
};
