import type { CellEvent } from '@/types';

/**
 * Upcoming and recent events for the 2025-26 cycle.
 * IFair history: IFair'23 (52 orgs, 680+ regs, 295+ offers),
 * IFair'24 (62 orgs, 595 regs, 540+ offers),
 * IFair'25 (55+ orgs, 347 regs, 165+ offers, 26 March 2025),
 * IFair'26 (upcoming).
 */
export const events: CellEvent[] = [
  {
    id: 'ifair-26',
    title: 'IFair 2026, the Tenth Edition',
    description:
      'The flagship internship fair. On-the-spot CV shortlisting and interviews. Results declared by end of day. 60+ recruiters expected across corporates, startups, and NGOs.',
    date: '2026-03-25',
    startTime: '09:00',
    endTime: '17:00',
    category: 'IFair',
    venue: 'Main Quadrangle, Sri Venkateswara College',
    rsvpOpen: true,
  },
  {
    id: 'cv-vetting-workshop-mar',
    title: 'CV Vetting Workshop',
    description:
      'A two-hour workshop on CV structure, the Placement Cell format, and what recruiters look for in 15 seconds of skim time. Open to all years.',
    date: '2026-02-12',
    startTime: '14:00',
    endTime: '16:00',
    category: 'Workshop',
    venue: 'Seminar Hall 1',
    rsvpOpen: true,
  },
  {
    id: 'mock-interview-finance',
    title: 'Mock Interviews, Finance and Markets',
    description:
      'One-on-one mock interviews with alumni working in finance roles at investment banks, hedge funds, and consulting firms. Bookings via the mock interview portal.',
    date: '2026-02-20',
    startTime: '10:00',
    endTime: '17:00',
    category: 'Mock Interview',
    venue: 'The Placement Cell Room, Durgabai Deshmukh Block',
    rsvpOpen: true,
  },
  {
    id: 'industry-talk-arjun-mehra',
    title: 'Industry Talk: Navigate Your Finance Career',
    description:
      'Career guidance session with CA & CFA Arjun Mehra (CA Inter Rank 1, Ex-BCG). Practical insights into finance careers, industry expectations, and interview preparation.',
    date: '2026-01-18',
    startTime: '15:00',
    endTime: '17:00',
    category: 'Industry Talk',
    venue: 'Auditorium',
    rsvpOpen: false,
  },
  {
    id: 'orientation-batch-2027',
    title: 'Cell Orientation for Batch of 2027',
    description:
      'Annual orientation for first-year students. How the cell works, eligibility, the CV format, the tier policy, and how to engage with coordinators.',
    date: '2026-01-30',
    startTime: '11:00',
    endTime: '13:00',
    category: 'Orientation',
    venue: 'Seminar Hall 2',
    rsvpOpen: true,
  },
  {
    id: 'drive-audit-feb-2026',
    title: 'Big 4 Audit Drive, February Window',
    description:
      'Pre-placement talks from leading audit and assurance firms over a two-week window. Drive eligibility shared via course email lists.',
    date: '2026-02-05',
    startTime: '09:00',
    endTime: '17:00',
    category: 'Drive',
    venue: 'Seminar Halls 1, 2, 3',
    rsvpOpen: false,
  },
];
