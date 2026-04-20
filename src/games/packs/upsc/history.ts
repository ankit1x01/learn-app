/**
 * UPSC History — content packs for all game engines.
 */

import type {
  ChronoConfig, BalloonTapConfig, ThisOrThatConfig,
  KnockoutConfig, RetentionConfig, BubbleMatchConfig,
  LinksConfig, AudioLectureConfig,
} from '../../types'

// ── Chrono: Indian Freedom Struggle ─────────────────────────────────────────
export const upscHistoryChrono: ChronoConfig = {
  type: 'chrono',
  theme: 'Indian Freedom Struggle',
  subject: 'UPSC History',
  events: [
    { id: '1', label: 'Sepoy Mutiny / First War of Independence', dateLabel: '1857', sortKey: 1857 },
    { id: '2', label: 'Indian National Congress founded', dateLabel: '1885', sortKey: 1885 },
    { id: '3', label: 'Partition of Bengal', dateLabel: '1905', sortKey: 1905 },
    { id: '4', label: 'Jallianwala Bagh massacre', dateLabel: '1919', sortKey: 1919 },
    { id: '5', label: 'Non-Cooperation Movement', dateLabel: '1920', sortKey: 1920 },
    { id: '6', label: 'Salt March — Dandi', dateLabel: '1930', sortKey: 1930 },
    { id: '7', label: 'Quit India Movement', dateLabel: '1942', sortKey: 1942 },
    { id: '8', label: 'Independence & Partition', dateLabel: '1947', sortKey: 1947 },
  ],
}

// ── BalloonTap: Events & Years ───────────────────────────────────────────────
export const upscHistoryBalloon: BalloonTapConfig = {
  type: 'balloon-tap',
  theme: 'Events & Years',
  subject: 'UPSC History',
  pairs: [
    { id: 1, a: '1857', b: 'Sepoy Mutiny' },
    { id: 2, a: '1885', b: 'INC founded' },
    { id: 3, a: '1919', b: 'Rowlatt Act' },
    { id: 4, a: '1930', b: 'Salt March' },
    { id: 5, a: '1942', b: 'Quit India' },
    { id: 6, a: '1950', b: 'Constitution adopted' },
  ],
}

// ── ThisOrThat: Ancient vs Medieval India ────────────────────────────────────
export const upscHistoryThisOrThat: ThisOrThatConfig = {
  type: 'this-or-that',
  theme: 'Ancient vs Medieval India',
  subject: 'UPSC History',
  columnA: { label: 'Ancient India', description: 'Before 700 AD' },
  columnB: { label: 'Medieval India', description: '700–1700 AD' },
  cards: [
    { id: '1', label: 'Maurya Empire',       correct: 'A' },
    { id: '2', label: 'Mughal Empire',        correct: 'B' },
    { id: '3', label: 'Gupta Empire',         correct: 'A' },
    { id: '4', label: 'Delhi Sultanate',      correct: 'B' },
    { id: '5', label: 'Indus Valley Civilisation', correct: 'A' },
    { id: '6', label: 'Vijayanagara Empire',  correct: 'B' },
  ],
}

// ── Links: Match Governor-General to their act ───────────────────────────────
export const upscHistoryLinks: LinksConfig = {
  type: 'links',
  theme: 'Governor-Generals & Acts',
  subject: 'UPSC History',
  cards: [
    { id: 'bentinck',  label: 'Lord William Bentinck' },
    { id: 'dalhousie', label: 'Lord Dalhousie' },
    { id: 'curzon',    label: 'Lord Curzon' },
    { id: 'ripon',     label: 'Lord Ripon' },
  ],
  rounds: [
    { cardId: 'bentinck',  attributes: ['Abolished Sati (1829)', 'Charter Act 1833', 'English education policy', 'First Governor-General of India'] },
    { cardId: 'dalhousie', attributes: ['Doctrine of Lapse', 'Railways introduced', 'Telegraph introduced', 'Annexed Punjab'] },
    { cardId: 'curzon',    attributes: ['Partition of Bengal 1905', 'Ancient Monuments Act', 'Police Commission', 'Delhi Durbar 1903'] },
    { cardId: 'ripon',     attributes: ['Ilbert Bill controversy', 'Local Self-Government', 'First Factory Act', 'Hunter Commission'] },
  ],
}

// ── Retention: Important Years ───────────────────────────────────────────────
export const upscHistoryRetention: RetentionConfig = {
  type: 'retention',
  theme: 'Important Years',
  subject: 'UPSC History',
  pool: [
    { id: '1', label: '1526 — First Battle of Panipat' },
    { id: '2', label: '1600 — East India Company founded' },
    { id: '3', label: '1757 — Battle of Plassey' },
    { id: '4', label: '1857 — Sepoy Mutiny' },
    { id: '5', label: '1885 — INC founded' },
    { id: '6', label: '1919 — Rowlatt Act' },
    { id: '7', label: '1930 — Salt March' },
    { id: '8', label: '1947 — Independence' },
    { id: '9', label: '1950 — Constitution' },
    { id: '10', label: '1991 — LPG Reforms' },
  ],
}

// ── Knockout ─────────────────────────────────────────────────────────────────
export const upscHistoryKnockout: KnockoutConfig = {
  type: 'knockout',
  theme: 'Which is correct?',
  subject: 'UPSC History',
  question: 'Which statement about the Mughal Empire is CORRECT?',
  cards: [
    { id: '1', label: 'Babur founded Mughal Empire in 1526' },
    { id: '2', label: 'Akbar introduced Din-i-Ilahi in 1556' },
    { id: '3', label: 'Aurangzeb expanded Mughal art patronage' },
    { id: '4', label: 'Shah Jahan built the Red Fort in Delhi' },
  ],
  answers: {
    '1': 'Correct — Babur defeated Ibrahim Lodi at First Battle of Panipat, 1526',
    '4': 'Also correct — Shah Jahan built the Red Fort (Lal Qila) in Delhi',
    '2': 'Wrong — Akbar introduced Din-i-Ilahi in 1582, not 1556',
    '3': 'Wrong — Aurangzeb was conservative, reduced art patronage significantly',
  },
}

// ── BubbleMatch: Dynasties & Capitals ────────────────────────────────────────
export const upscHistoryBubbleMatch: BubbleMatchConfig = {
  type: 'bubble-match',
  theme: 'Dynasties & Their Features',
  subject: 'UPSC History',
  entities: [
    {
      id: 'maurya', name: 'Maurya', color: 'hsl(35, 80%, 55%)',
      facts: ['Founded by Chandragupta', 'Capital: Pataliputra', 'Ashoka spread Buddhism', 'Arthashastra by Kautilya'],
    },
    {
      id: 'gupta', name: 'Gupta', color: 'hsl(280, 60%, 60%)',
      facts: ['Golden Age of India', 'Chandragupta I founder', 'Aryabhata & Kalidasa', 'Iron Pillar of Delhi'],
    },
    {
      id: 'mughal', name: 'Mughal', color: 'hsl(200, 65%, 55%)',
      facts: ['Babur founded 1526', 'Akbar — Din-i-Ilahi', 'Taj Mahal built', 'Persian court language'],
    },
  ],
}

// ── AudioLecture ─────────────────────────────────────────────────────────────
export const upscHistoryAudio: AudioLectureConfig = {
  type: 'audio-lecture',
  theme: 'The Revolt of 1857',
  subject: 'UPSC History',
  title: 'First War of Independence',
  concepts: ['Sepoy Mutiny', 'Mangal Pandey', 'Queen\'s Proclamation'],
  passage:
    'The Revolt of 1857 began on May 10 at Meerut when Indian sepoys rebelled against the British East India Company. ' +
    'The immediate cause was the introduction of the Enfield rifle, whose cartridges were rumoured to be greased with cow and pig fat. ' +
    'Mangal Pandey was one of the first rebels, hanged on April 8, 1857. ' +
    'After suppressing the revolt, the British Crown took direct control of India through the Government of India Act 1858.',
  displayPassage:
    'The Revolt of 1857 began on May 10 at ___ when Indian sepoys rebelled. ' +
    'The immediate cause was the introduction of the Enfield rifle with cartridges greased with ___ and pig fat. ' +
    'After suppressing the revolt, the ___ took direct control through the Government of India Act 1858.',
  blanks: [
    { id: 'b1', answer: 'Meerut' },
    { id: 'b2', answer: 'cow' },
    { id: 'b3', answer: 'British Crown' },
  ],
  chips: ['Meerut', 'cow', 'British Crown', 'Delhi', 'lard', 'East India Company'],
  questions: [
    { id: 'q1', prompt: 'When did the Revolt of 1857 begin?', options: ['May 10, 1857', 'April 8, 1857', 'June 1, 1857', 'March 29, 1857'], answer: 'May 10, 1857' },
    { id: 'q2', prompt: 'What was the immediate cause of the revolt?', options: ['Land revenue policy', 'Enfield rifle cartridges', 'Doctrine of Lapse', 'Vernacular Press Act'], answer: 'Enfield rifle cartridges' },
    { id: 'q3', prompt: 'What happened after the revolt was suppressed?', options: ['EIC got more power', 'British Crown took control', 'India got independence', 'Mughal rule restored'], answer: 'British Crown took control' },
  ],
}
