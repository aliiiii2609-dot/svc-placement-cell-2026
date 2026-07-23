import type { CouncilMember } from '@/types';

/**
 * Council heads for cycle 2026-27.
 * 13 members across the five departments.
 * Sourced from Placement_Cell_2026-67_Team_Members.xlsx.
 */
export const councilHeads: CouncilMember[] = [
  // Editorial
  {
    id: 'sambhav-pandey',
    name: 'Sambhav Pandey',
    department: 'Editorial',
    course: 'B.Com (H)',
    year: 'II',
    email: 'sambhav01.svcpcell@gmail.com',
  },
  {
    id: 'moulik-sharma',
    name: 'Moulik Sharma',
    department: 'Editorial',
    course: 'B.A. (H) English',
    year: 'II',
    email: 'moulik.svcpcell@gmail.com',
  },

  // Events & Logistics
  {
    id: 'amish-choudhary',
    name: 'Amish Choudhary',
    department: 'Events & Logistics',
    course: 'B.A. (H) Economics',
    year: 'II',
    email: 'amish.svcpcell@gmail.com',
  },
  {
    id: 'aryan-kumar',
    name: 'Aryan Kumar',
    department: 'Events & Logistics',
    course: 'B.Sc. (H) Mathematics',
    year: 'II',
    email: 'aryankumar.svcpcell@gmail.com',
  },
  {
    id: 'medha-bhatnagar',
    name: 'Medha Bhatnagar',
    department: 'Events & Logistics',
    course: 'B.Sc. (H) Biochemistry',
    year: 'IV',
    email: 'medhabhatnagar.svcpcell@gmail.com',
  },
  {
    id: 'chhavi-singla',
    name: 'Chhavi Singla',
    department: 'Events & Logistics',
    course: 'B.Sc. (H) Statistics',
    year: 'II',
    email: 'chhavisingla.svcpcell@gmail.com',
  },

  // Documentation
  {
    id: 'aman-raj-upadhyay',
    name: 'Aman Raj Upadhyay',
    department: 'Documentation',
    course: 'B.A. (H) Economics',
    year: 'II',
    email: 'amanraj.svcpcell@gmail.com',
  },
  {
    id: 'hiral-datta',
    name: 'Hiral Datta',
    department: 'Documentation',
    course: 'B.Sc. (H) Statistics',
    year: 'II',
    email: 'hiraldatta.svcpcell@gmail.com',
  },

  // Social Media & Marketing
  {
    id: 'aditya-banga',
    name: 'Aditya Banga',
    department: 'Social Media & Marketing',
    course: 'B.Sc. (H) Statistics',
    year: 'II',
    email: 'adityabanga.svcpcell@gmail.com',
  },
  {
    id: 'simmi',
    name: 'Simmi',
    department: 'Social Media & Marketing',
    course: 'B.Sc. (P) Life Sciences',
    year: 'II',
    email: 'simmi.svcpcell@gmail.com',
  },
  {
    id: 'priyanshu-gupta',
    name: 'Priyanshu Gupta',
    department: 'Social Media & Marketing',
    course: 'B.Sc. (H) Statistics',
    year: 'II',
    email: 'priyanshugupta.svcpcell@gmail.com',
  },

  // PR & Outreach
  {
    id: 'jiya-aggarwal',
    name: 'Jiya Aggarwal',
    department: 'PR & Outreach',
    course: 'B.A. (H) Economics',
    year: 'II',
    email: 'jiyaagg.svcpcell@gmail.com',
  },
  {
    id: 'shivam-mishra',
    name: 'Shivam Mishra',
    department: 'PR & Outreach',
    course: 'B.Com (H)',
    year: 'II',
    email: 'shivam.svcpcell@gmail.com',
  },
];

/**
 * Department charter copy, displayed on the Departments section.
 */
export const departmentCharters: Record<
  CouncilMember['department'],
  { headcount: number; charter: string }
> = {
  'Events & Logistics': {
    headcount: 4,
    charter:
      'Plans and runs every on-campus event, the IFair floor, and all recruiter hosting. Owns venue, A/V, scheduling, registrations, and on-day execution for both online and offline formats.',
  },
  Editorial: {
    headcount: 2,
    charter:
      'Owns the brochure, the website copy, the annual report, and recruiter-facing collateral. Final word on tone, accuracy, and professionalism in all written communication.',
  },
  Documentation: {
    headcount: 2,
    charter:
      'Maintains the recruiter database, drive trackers, application records, and the cell\'s audit trail across the cycle. Handles permissions and logistical coordination.',
  },
  'Social Media & Marketing': {
    headcount: 3,
    charter:
      'Runs Instagram, LinkedIn, and the news feed. Plans the content calendar, executes posts for drives and IFair, and maintains a consistent, professional digital identity for the Cell.',
  },
  'PR & Outreach': {
    headcount: 2,
    charter:
      'Owns external relationships. First contact for new recruiters, sponsors, and the press. Coordinates media coverage of key events and builds the partner pipeline.',
  },
};
