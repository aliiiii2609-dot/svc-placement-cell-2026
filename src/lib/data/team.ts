import type { CoreTeamMember, ConvenerProfile } from '@/types';

/**
 * Core team for cycle 2026-27.
 * Sourced from Placement_Cell_2026-67_Team_Members.xlsx
 * supplied by the cell's Documentation department.
 *
 * Member names per the cell's Documentation department.
 */
export const coreTeam: CoreTeamMember[] = [
  {
    id: 'nishtha-khatri',
    name: 'Nishtha Khatri',
    role: 'President',
    course: 'B.A. (H) Economics',
    year: 'III',
    bio:
      'Leading the Placement Cell with a vision to ensure every student of SVC has access to meaningful career opportunities and professional growth.',
    email: 'nishtha.svcpcell@gmail.com',
    phone: '+91 98180 43273',
    photoPath: '/images/team/nishtha-khatri.jpg',
    initials: 'NK',
  },
  {
    id: 'mohammed-ali',
    name: 'Muhammad Ali',
    role: 'Vice President, Placements',
    course: 'B.A. (H) English',
    year: 'III',
    bio:
      'Overseeing all placement-related engagement, ensuring smooth coordination between students and recruiting organisations.',
    email: 'ali.svcpcell@gmail.com',
    phone: '+91 90273 89597',
    photoPath: '/images/team/mohammed-ali.jpg',
    initials: 'MA',
  },
  {
    id: 'gurbani-chandok',
    name: 'Gurbani Chandok',
    role: 'Vice President, Internships',
    course: 'B.Sc. (H) Mathematics',
    year: 'III',
    bio:
      'Managing internship opportunities and ensuring students gain valuable pre-placement experiences that strengthen their professional profiles.',
    email: 'gurbani.svcpcell@gmail.com',
    phone: '+91 95822 25700',
    photoPath: '/images/team/gurbani-chandok.jpg',
    initials: 'GC',
  },
  {
    id: 'anisha-tanwar',
    name: 'Anisha Tanwar',
    role: 'Chief Coordinator',
    course: 'B.Sc. (H) Botany',
    year: 'III',
    bio:
      'Coordinating operations across all divisions of the Placement Cell to ensure seamless execution of drives and events.',
    email: 'anishatanwar.svcpcell@gmail.com',
    phone: '+91 98705 12006',
    photoPath: '/images/team/anisha-tanwar.jpg',
    initials: 'AT',
  },
  {
    id: 'sukhmanpreet-kaur-sandhu',
    name: 'Sukhmanpreet Kaur Sandhu',
    role: 'Secretary',
    course: 'B.Com (H)',
    year: 'III',
    bio:
      'Handling documentation, correspondence, and administrative matters to keep the Placement Cell running with precision and efficiency.',
    email: 'sukhmansvc.pcell@gmail.com',
    phone: '+91 90564 82808',
    photoPath: '/images/team/sukhmanpreet-kaur-sandhu.jpg',
    initials: 'SS',
  },
  {
    id: 'shiv-chopra',
    name: 'Shiv Chopra',
    role: 'Joint Secretary',
    course: 'B.Com (H)',
    year: 'III',
    bio:
      'Supporting secretarial functions and assisting in cross-divisional coordination to maintain operational excellence across all activities.',
    email: 'shiv.svcpcell@gmail.com',
    phone: '+91 98118 17950',
    photoPath: '/images/team/shiv-chopra.jpg',
    initials: 'SC',
  },
];

/**
 * Faculty Convener, Dr. Abhishek Malhotra.
 * Message reproduced verbatim from the 2025-26 recruitment brochure
 * with the Convener's published approval.
 */
export const convener: ConvenerProfile = {
  name: 'Dr. Abhishek Malhotra',
  title: 'Convener, The Placement Cell',
  department: 'Assistant Professor, Department of Economics',
  email: 'abhishek_m@svc.ac.in',
  phone: '+91 96542 30020',
  photoPath: '/images/convener/abhishek-malhotra.jpg',
};

/**
 * Principal of Sri Venkateswara College.
 * Featured alongside the Convener in the leadership section.
 */
export const principal: ConvenerProfile = {
  name: 'Prof. Vajala Ravi',
  title: 'Principal',
  department: 'Sri Venkateswara College, University of Delhi',
  email: 'principal@svc.ac.in',
  phone: '',
  photoPath: '/images/principal/vajala-ravi.jpg',
};
