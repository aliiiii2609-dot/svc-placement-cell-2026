import type { ProcessStep } from '@/types';

/**
 * Eight-step recruitment process, mapped from the cell's published
 * employer engagement workflow (Sections A through H of the
 * PLACEMENT_CELL_WEBSITE_CONTENT.docx file).
 */
export const processSteps: ProcessStep[] = [
  {
    index: 1,
    title: 'Employer engagement and JD submission',
    owner: 'PR & Outreach, Faculty Convener',
    duration: 'Day 0',
    output: 'Signed JD, role parameters, drive timeline',
    description:
      'Recruiters approach the cell through official channels. Submit a detailed JD with role, eligibility, location, and compensation, plus the number of vacancies and the proposed structure of the drive.',
  },
  {
    index: 2,
    title: 'Coordinator assignment and verification',
    owner: 'Chief Coordinator',
    duration: 'Day 1 to Day 2',
    output: 'Dedicated Placement Coordinator, drive number, briefing call',
    description:
      'On verification and approval, the cell assigns a dedicated Placement Coordinator as the official point of contact for the recruiter for the duration of the drive.',
  },
  {
    index: 3,
    title: 'Opportunity circulation',
    owner: 'Documentation, Social Media',
    duration: 'Day 2 to Day 4',
    output: 'Standardized brief sent to eligible students',
    description:
      'A standardized opportunity brief is prepared. Distribution through email and course-wise WhatsApp groups. Eligibility, deadlines, and selection stages are communicated clearly.',
  },
  {
    index: 4,
    title: 'Application collection and CV shortlisting',
    owner: 'Documentation',
    duration: 'Day 4 to Day 8',
    output: 'Verified CV pack to recruiter',
    description:
      'Students apply via Google Form. The cell verifies eligibility, compiles CVs, forwards the pack. Shortlisting is done solely by the recruiter based on their criteria.',
  },
  {
    index: 5,
    title: 'Pre-placement talk',
    owner: 'Events & Logistics',
    duration: 'After shortlist, before interviews',
    output: 'Recruiter-led briefing for shortlisted candidates',
    description:
      'Held either on the day of the drive or earlier through an online mode. Covers organizational overview, work culture, role detail, compensation, and growth prospects.',
  },
  {
    index: 6,
    title: 'Assessment and selection rounds',
    owner: 'Events & Logistics, Coordinator',
    duration: '1 to 3 days',
    output: 'Final selection list',
    description:
      'Aptitude or skill assessments, group discussions, case evaluations, technical interviews, HR interviews. Mode, number of rounds, and evaluation criteria are decided by the recruiter. The cell handles coordination, scheduling, and logistical support.',
  },
  {
    index: 7,
    title: 'Final selection and offer declaration',
    owner: 'PR & Outreach',
    duration: '5 to 10 working days after rounds',
    output: 'Offer letters, signed acceptances',
    description:
      'The recruiter shares the final selection list with the cell. Offers communicated through the cell or directly by the recruiter, by mutual consent. Selected candidates confirm acceptance within the stipulated timeframe and submit the offer letter for record-keeping.',
  },
  {
    index: 8,
    title: 'Post-selection and onboarding',
    owner: 'Recruiter, Candidate',
    duration: 'Recruiter-driven',
    output: 'Joining',
    description:
      'All post-offer formalities, including joining date, onboarding procedures, role details, and compensation breakdown, are handled directly between the recruiter and the selected candidates. The cell assists only where institutional coordination is required.',
  },
];
