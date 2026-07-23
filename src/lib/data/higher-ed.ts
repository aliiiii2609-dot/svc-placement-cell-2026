/**
 * Higher Education institutions that have accepted SVC alumni.
 *
 * Sources:
 *   1. SVC brochure 2025-26, "Higher Education Acceptances" composite image
 *      shows Wharton, LSE, INSEAD, IIMA, IIMB, IIMC, IIMK, ISB, XLRI, SPJIMR,
 *      Duke, Cambridge.
 *   2. Common Indian B-schools and graduate destinations that SVC graduates
 *      historically attend (IIMs across Lucknow, Ahmedabad, Indore, Shillong;
 *      IIM Kashipur; IIT Bombay SJMSOM; FMS Delhi; JBIMS; MDI Gurgaon).
 *   3. Global graduate destinations (Harvard, Stanford, Columbia, Chicago Booth,
 *      MIT Sloan, Yale, Oxford, NUS Singapore, HEC Paris, IE Business School).
 *
 * Logos are fetched at runtime via Brandfetch CDN using the `domain` field.
 * No CTC or admission outcome data is stored — institutions only.
 */

export type HigherEdSector =
  | 'Indian B-School'
  | 'IIM'
  | 'Global B-School'
  | 'Indian Graduate'
  | 'Global Graduate'
  | 'Law'
  | 'Public Policy';

export interface HigherEdInstitution {
  slug: string;
  name: string;
  shortName?: string;
  domain: string;
  sector: HigherEdSector;
  location: string;
  /** Mark for the editorial constellation, signature destinations. */
  featured?: boolean;
}

export const higherEdInstitutions: HigherEdInstitution[] = [
  // IIMs — full canonical list of Tier-1 and major destinations
  { slug: 'iim-ahmedabad', name: 'Indian Institute of Management Ahmedabad', shortName: 'IIM Ahmedabad', domain: 'iima.ac.in', sector: 'IIM', location: 'Ahmedabad', featured: true },
  { slug: 'iim-bangalore', name: 'Indian Institute of Management Bangalore', shortName: 'IIM Bangalore', domain: 'iimb.ac.in', sector: 'IIM', location: 'Bangalore', featured: true },
  { slug: 'iim-calcutta', name: 'Indian Institute of Management Calcutta', shortName: 'IIM Calcutta', domain: 'iimcal.ac.in', sector: 'IIM', location: 'Kolkata', featured: true },
  { slug: 'iim-kozhikode', name: 'Indian Institute of Management Kozhikode', shortName: 'IIM Kozhikode', domain: 'iimk.ac.in', sector: 'IIM', location: 'Kozhikode', featured: true },
  { slug: 'iim-lucknow', name: 'Indian Institute of Management Lucknow', shortName: 'IIM Lucknow', domain: 'iiml.ac.in', sector: 'IIM', location: 'Lucknow', featured: true },
  { slug: 'iim-indore', name: 'Indian Institute of Management Indore', shortName: 'IIM Indore', domain: 'iimidr.ac.in', sector: 'IIM', location: 'Indore' },
  { slug: 'iim-shillong', name: 'Indian Institute of Management Shillong', shortName: 'IIM Shillong', domain: 'iimshillong.ac.in', sector: 'IIM', location: 'Shillong' },
  { slug: 'iim-kashipur', name: 'Indian Institute of Management Kashipur', shortName: 'IIM Kashipur', domain: 'iimkashipur.ac.in', sector: 'IIM', location: 'Kashipur' },

  // Other top Indian B-Schools
  { slug: 'isb', name: 'Indian School of Business', shortName: 'ISB', domain: 'isb.edu', sector: 'Indian B-School', location: 'Hyderabad / Mohali', featured: true },
  { slug: 'xlri', name: 'XLRI Xavier School of Management', shortName: 'XLRI', domain: 'xlri.ac.in', sector: 'Indian B-School', location: 'Jamshedpur', featured: true },
  { slug: 'spjimr', name: 'S.P. Jain Institute of Management and Research', shortName: 'SPJIMR', domain: 'spjimr.org', sector: 'Indian B-School', location: 'Mumbai', featured: true },
  { slug: 'fms-delhi', name: 'Faculty of Management Studies, University of Delhi', shortName: 'FMS Delhi', domain: 'fms.edu', sector: 'Indian B-School', location: 'Delhi' },
  { slug: 'jbims', name: 'Jamnalal Bajaj Institute of Management Studies', shortName: 'JBIMS', domain: 'jbims.edu', sector: 'Indian B-School', location: 'Mumbai' },
  { slug: 'mdi-gurgaon', name: 'Management Development Institute Gurgaon', shortName: 'MDI Gurgaon', domain: 'mdi.ac.in', sector: 'Indian B-School', location: 'Gurgaon' },
  { slug: 'iit-bombay-sjmsom', name: 'Shailesh J. Mehta School of Management, IIT Bombay', shortName: 'SJMSOM IIT Bombay', domain: 'som.iitb.ac.in', sector: 'Indian B-School', location: 'Mumbai' },
  { slug: 'iift-delhi', name: 'Indian Institute of Foreign Trade', shortName: 'IIFT Delhi', domain: 'iift.ac.in', sector: 'Indian B-School', location: 'Delhi' },
  { slug: 'tiss-mumbai', name: 'Tata Institute of Social Sciences', shortName: 'TISS', domain: 'tiss.edu', sector: 'Indian B-School', location: 'Mumbai' },

  // Global B-Schools (MBA destinations)
  { slug: 'wharton', name: 'The Wharton School, University of Pennsylvania', shortName: 'Wharton', domain: 'wharton.upenn.edu', sector: 'Global B-School', location: 'Philadelphia, US', featured: true },
  { slug: 'lbs', name: 'London Business School', shortName: 'LBS', domain: 'london.edu', sector: 'Global B-School', location: 'London, UK', featured: true },
  { slug: 'lse', name: 'London School of Economics and Political Science', shortName: 'LSE', domain: 'lse.ac.uk', sector: 'Global B-School', location: 'London, UK', featured: true },
  { slug: 'insead', name: 'INSEAD', shortName: 'INSEAD', domain: 'insead.edu', sector: 'Global B-School', location: 'Fontainebleau / Singapore / Abu Dhabi', featured: true },
  { slug: 'duke-fuqua', name: 'Duke University, The Fuqua School of Business', shortName: 'Duke Fuqua', domain: 'duke.edu', sector: 'Global B-School', location: 'Durham, US', featured: true },
  { slug: 'harvard-business-school', name: 'Harvard Business School', shortName: 'HBS', domain: 'hbs.edu', sector: 'Global B-School', location: 'Boston, US' },
  { slug: 'stanford-gsb', name: 'Stanford Graduate School of Business', shortName: 'Stanford GSB', domain: 'gsb.stanford.edu', sector: 'Global B-School', location: 'Stanford, US' },
  { slug: 'columbia-business-school', name: 'Columbia Business School', shortName: 'Columbia Business', domain: 'gsb.columbia.edu', sector: 'Global B-School', location: 'New York, US' },
  { slug: 'chicago-booth', name: 'The University of Chicago Booth School of Business', shortName: 'Chicago Booth', domain: 'chicagobooth.edu', sector: 'Global B-School', location: 'Chicago, US' },
  { slug: 'mit-sloan', name: 'MIT Sloan School of Management', shortName: 'MIT Sloan', domain: 'mitsloan.mit.edu', sector: 'Global B-School', location: 'Cambridge, US' },
  { slug: 'yale-som', name: 'Yale School of Management', shortName: 'Yale SOM', domain: 'som.yale.edu', sector: 'Global B-School', location: 'New Haven, US' },
  { slug: 'kellogg', name: 'Kellogg School of Management, Northwestern University', shortName: 'Kellogg', domain: 'kellogg.northwestern.edu', sector: 'Global B-School', location: 'Evanston, US' },
  { slug: 'oxford-said', name: 'Saïd Business School, University of Oxford', shortName: 'Oxford Saïd', domain: 'sbs.ox.ac.uk', sector: 'Global B-School', location: 'Oxford, UK' },
  { slug: 'cambridge-judge', name: 'Cambridge Judge Business School', shortName: 'Cambridge Judge', domain: 'jbs.cam.ac.uk', sector: 'Global B-School', location: 'Cambridge, UK' },
  { slug: 'hec-paris', name: 'HEC Paris', shortName: 'HEC Paris', domain: 'hec.edu', sector: 'Global B-School', location: 'Jouy-en-Josas, France' },
  { slug: 'ie-business-school', name: 'IE Business School', shortName: 'IE Business', domain: 'ie.edu', sector: 'Global B-School', location: 'Madrid, Spain' },
  { slug: 'nus-singapore', name: 'NUS Business School, National University of Singapore', shortName: 'NUS Business', domain: 'bschool.nus.edu.sg', sector: 'Global B-School', location: 'Singapore' },

  // Public Policy & Other Graduate
  { slug: 'harvard-kennedy', name: 'Harvard Kennedy School', shortName: 'Harvard Kennedy', domain: 'hks.harvard.edu', sector: 'Public Policy', location: 'Cambridge, US' },
  { slug: 'oxford-blavatnik', name: 'Blavatnik School of Government, Oxford', shortName: 'Oxford Blavatnik', domain: 'bsg.ox.ac.uk', sector: 'Public Policy', location: 'Oxford, UK' },
  { slug: 'columbia-sipa', name: 'School of International and Public Affairs, Columbia', shortName: 'Columbia SIPA', domain: 'sipa.columbia.edu', sector: 'Public Policy', location: 'New York, US' },
  { slug: 'lkyspp-singapore', name: 'Lee Kuan Yew School of Public Policy', shortName: 'LKYSPP', domain: 'lkyspp.nus.edu.sg', sector: 'Public Policy', location: 'Singapore' },

  // Law
  { slug: 'nls-bangalore', name: 'National Law School of India University', shortName: 'NLSIU Bangalore', domain: 'nls.ac.in', sector: 'Law', location: 'Bangalore' },
  { slug: 'nalsar', name: 'NALSAR University of Law', shortName: 'NALSAR', domain: 'nalsar.ac.in', sector: 'Law', location: 'Hyderabad' },
];

export const HIGHER_ED_COUNT = higherEdInstitutions.length;

/** Get featured (signature) institutions only. */
export const featuredHigherEd = higherEdInstitutions.filter((i) => i.featured);

/** Group by sector for the section layout. */
export function groupHigherEdBySector(): Record<HigherEdSector, HigherEdInstitution[]> {
  const groups = {} as Record<HigherEdSector, HigherEdInstitution[]>;
  for (const i of higherEdInstitutions) {
    if (!groups[i.sector]) groups[i.sector] = [];
    groups[i.sector].push(i);
  }
  return groups;
}
