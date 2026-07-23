/**
 * CV Builder data model.
 *
 * Adapted from the IIM-style format the user uploaded, extended with
 * additional sections (projects, languages, references). Every list
 * item has a stable id so React reconciliation stays clean across
 * reorders, deletions, and edits.
 */

export const uid = () => Math.random().toString(36).slice(2, 9);

export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  institution: string;
  program: string;
  rollNumber: string;
  /** Three short capability tags shown in the header bar */
  tags: [string, string, string];
}

export interface EducationRow {
  id: string;
  degree: string;
  institution: string;
  score: string;
  year: string;
  remarks: string;
}

export interface AchievementItem {
  id: string;
  text: string;
  year: string;
}

export interface AchievementGroup {
  id: string;
  category: string;
  items: AchievementItem[];
}

export interface ExperienceBullet {
  id: string;
  text: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  duration: string;
  tag: string;
  bullets: ExperienceBullet[];
}

export interface PositionEntry {
  id: string;
  role: string;
  organization: string;
  year: string;
  bullets: ExperienceBullet[];
}

export interface CompetitionEntry {
  id: string;
  rank: string;
  detail: string;
  year: string;
}

export interface SimpleItem {
  id: string;
  text: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  context: string;
  duration: string;
  bullets: ExperienceBullet[];
}

export interface CVData {
  personal: PersonalDetails;
  education: EducationRow[];
  achievements: AchievementGroup[];
  experience: ExperienceEntry[];
  positions: PositionEntry[];
  extraCurricular: AchievementGroup[];
  competitions: CompetitionEntry[];
  projects: ProjectEntry[];
  skills: SimpleItem[];
  certifications: SimpleItem[];
  languages: SimpleItem[];
}

export type TemplateId = 'iim-calcutta' | 'bcg-classic' | 'academic' | 'svc-student';

export interface CVTemplate {
  id: TemplateId;
  name: string;
  description: string;
  accentColor: string;
}

export const TEMPLATES: CVTemplate[] = [
  {
    id: 'iim-calcutta',
    name: 'IIM Calcutta',
    description: 'Banded sections, two-column header, signature MBA format. Best for finance and consulting roles.',
    accentColor: '#1b2a4a',
  },
  {
    id: 'bcg-classic',
    name: 'BCG Classic',
    description: 'Minimalist, single-column, hairline rules. Best for strategy and analytics applications.',
    accentColor: '#005a48',
  },
  {
    id: 'academic',
    name: 'Academic CV',
    description: 'Publication-oriented, long-form. Best for higher-ed and research roles.',
    accentColor: '#2c3e50',
  },
  {
    id: 'svc-student',
    name: 'SVC Student',
    description: 'Cell-approved undergraduate format with the institutional crest. Best for first-job applications.',
    accentColor: '#0a2540',
  },
];

export function initData(): CVData {
  return {
    personal: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      institution: 'Sri Venkateswara College, University of Delhi',
      program: '',
      rollNumber: '',
      tags: ['', '', ''],
    },
    education: [
      { id: uid(), degree: '', institution: '', score: '', year: '', remarks: '' },
    ],
    achievements: [
      { id: uid(), category: 'Scholastic Achievements', items: [{ id: uid(), text: '', year: '' }] },
    ],
    experience: [
      { id: uid(), company: '', role: '', duration: '', tag: '', bullets: [{ id: uid(), text: '' }] },
    ],
    positions: [
      { id: uid(), role: '', organization: '', year: '', bullets: [{ id: uid(), text: '' }] },
    ],
    extraCurricular: [
      { id: uid(), category: 'Leadership Initiatives', items: [{ id: uid(), text: '', year: '' }] },
    ],
    competitions: [
      { id: uid(), rank: '', detail: '', year: '' },
    ],
    projects: [
      { id: uid(), title: '', context: '', duration: '', bullets: [{ id: uid(), text: '' }] },
    ],
    skills: [{ id: uid(), text: '' }],
    certifications: [{ id: uid(), text: '' }],
    languages: [{ id: uid(), text: '' }],
  };
}

export const STORAGE_KEY = 'svc-cv-builder-draft';
