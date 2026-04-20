// src/data/topic-banks/exam-registry.ts

export interface ExamCard {
  id: string;
  name: string;
  icon: string;        // Material Symbols Rounded name
  color: string;       // hex accent color
  description: string; // shown as subtitle on card
}

export const EXAM_CARDS: ExamCard[] = [
  {
    id: 'dsa_faang',
    name: 'DSA FAANG',
    icon: 'code',
    color: '#6750A4',
    description: '454 problems · FAANG interviews',
  },
  {
    id: 'it_placement_india',
    name: 'IT Placement',
    icon: 'laptop',
    color: '#0284C7',
    description: '271 concepts · Campus placement',
  },
  {
    id: 'neet_2026',
    name: 'NEET 2026',
    icon: 'science',
    color: '#16A34A',
    description: 'Physics · Chemistry · Biology',
  },
  {
    id: 'iit_jee',
    name: 'IIT JEE',
    icon: 'calculate',
    color: '#EA580C',
    description: 'Maths · Physics · Chemistry',
  },
  {
    id: 'upsc_cse',
    name: 'UPSC CSE',
    icon: 'account_balance',
    color: '#DC2626',
    description: 'GS · CSAT · Optional',
  },
  {
    id: 'mppsc',
    name: 'MPPSC',
    icon: 'location_city',
    color: '#7C3AED',
    description: 'State PCS · MP-specific syllabus',
  },
];
