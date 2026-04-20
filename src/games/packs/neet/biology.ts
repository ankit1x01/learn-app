/**
 * NEET Biology — content packs for all 8 game engines.
 * Data only. No game logic here.
 */

import type {
  ChronoConfig, BalloonTapConfig, ThisOrThatConfig,
  KnockoutConfig, RetentionConfig, BubbleMatchConfig,
  LinksConfig, AudioLectureConfig,
} from '../../types'

// ── Chrono: Cell Theory Timeline ────────────────────────────────────────────
export const neoBioChrono: ChronoConfig = {
  type: 'chrono',
  theme: 'Cell Theory Timeline',
  subject: 'NEET Biology',
  events: [
    { id: '1', label: 'Robert Hooke observes cells in cork', dateLabel: '1665', sortKey: 1665, factoid: 'Named "cells" because they resembled monks\' rooms' },
    { id: '2', label: 'Leeuwenhoek observes living microorganisms', dateLabel: '1674', sortKey: 1674, factoid: 'First to observe bacteria and protozoa' },
    { id: '3', label: 'Schleiden proposes plant cell theory', dateLabel: '1838', sortKey: 1838, factoid: 'All plants are made of cells' },
    { id: '4', label: 'Schwann proposes animal cell theory', dateLabel: '1839', sortKey: 1839, factoid: 'Extended cell theory to animals' },
    { id: '5', label: 'Virchow — Omnis cellula e cellula', dateLabel: '1855', sortKey: 1855, factoid: 'Every cell arises from a pre-existing cell' },
    { id: '6', label: 'Watson & Crick discover DNA double helix', dateLabel: '1953', sortKey: 1953, factoid: 'Base pairing: A-T, G-C' },
  ],
}

// ── BalloonTap: Organelle Functions ─────────────────────────────────────────
export const neoBioBalloon: BalloonTapConfig = {
  type: 'balloon-tap',
  theme: 'Organelle Functions',
  subject: 'NEET Biology',
  pairs: [
    { id: 1, a: 'Mitochondria',  b: 'ATP synthesis' },
    { id: 2, a: 'Ribosome',      b: 'Protein synthesis' },
    { id: 3, a: 'Chloroplast',   b: 'Photosynthesis' },
    { id: 4, a: 'Lysosome',      b: 'Cellular digestion' },
    { id: 5, a: 'Golgi body',    b: 'Secretion & packaging' },
    { id: 6, a: 'Nucleus',       b: 'Genetic control' },
    { id: 7, a: 'Vacuole',       b: 'Turgor & storage' },
    { id: 8, a: 'Centrosome',    b: 'Cell division' },
  ],
}

// ── ThisOrThat: Prokaryote vs Eukaryote ──────────────────────────────────────
export const neoBioThisOrThat: ThisOrThatConfig = {
  type: 'this-or-that',
  theme: 'Prokaryote vs Eukaryote',
  subject: 'NEET Biology',
  columnA: { label: 'Prokaryote', description: 'No membrane-bound nucleus' },
  columnB: { label: 'Eukaryote',  description: 'True membrane-bound nucleus' },
  cards: [
    { id: '1', label: 'E. coli',          correct: 'A' },
    { id: '2', label: 'Amoeba',           correct: 'B' },
    { id: '3', label: 'Cyanobacteria',    correct: 'A' },
    { id: '4', label: 'Yeast',            correct: 'B' },
    { id: '5', label: 'Mycoplasma',       correct: 'A' },
    { id: '6', label: 'Human cell',       correct: 'B' },
    { id: '7', label: 'Salmonella',       correct: 'A' },
    { id: '8', label: 'Paramecium',       correct: 'B' },
  ],
}

// ── Knockout: Which is NOT a function of the given organelle ─────────────────
export const neoBioKnockout: KnockoutConfig = {
  type: 'knockout',
  theme: 'Odd Organelle Out',
  subject: 'NEET Biology',
  question: 'Which organelle is correctly matched with its function?',
  cards: [
    { id: '1', label: 'Mitochondria — Photosynthesis' },
    { id: '2', label: 'Ribosome — Protein synthesis' },
    { id: '3', label: 'Lysosome — Lipid synthesis' },
    { id: '4', label: 'Chloroplast — ATP from light' },
  ],
  answers: {
    '2': 'Ribosome synthesises proteins — correct!',
    '4': 'Chloroplasts use light to make ATP — correct!',
    '1': 'Wrong — Mitochondria does cellular respiration, not photosynthesis',
    '3': 'Wrong — Lysosome does digestion, not lipid synthesis (that\'s SER)',
  },
}

// ── Retention: Key Bio Terms ─────────────────────────────────────────────────
export const neoBioRetention: RetentionConfig = {
  type: 'retention',
  theme: 'Cell Biology Terms',
  subject: 'NEET Biology',
  pool: [
    { id: '1',  label: 'Mitosis' },
    { id: '2',  label: 'Meiosis' },
    { id: '3',  label: 'Osmosis' },
    { id: '4',  label: 'Diffusion' },
    { id: '5',  label: 'Plasmolysis' },
    { id: '6',  label: 'Turgor pressure' },
    { id: '7',  label: 'Endocytosis' },
    { id: '8',  label: 'Exocytosis' },
    { id: '9',  label: 'Tonicity' },
    { id: '10', label: 'Cytokinesis' },
  ],
}

// ── BubbleMatch: Kingdom Classification ─────────────────────────────────────
export const neoBioBubbleMatch: BubbleMatchConfig = {
  type: 'bubble-match',
  subject: 'NEET Biology',
  theme: 'Five Kingdom Classification',
  entities: [
    {
      id: 'monera', name: 'Monera', color: 'hsl(200, 70%, 55%)',
      facts: ['Prokaryotic', 'No nuclear membrane', 'E. coli, Cyanobacteria', 'Peptidoglycan cell wall'],
    },
    {
      id: 'protista', name: 'Protista', color: 'hsl(160, 65%, 50%)',
      facts: ['Unicellular eukaryotes', 'Amoeba, Paramecium', 'Diatoms', 'Euglena'],
    },
    {
      id: 'fungi', name: 'Fungi', color: 'hsl(30, 80%, 60%)',
      facts: ['Chitin cell wall', 'Saprophytic', 'Mushroom, Yeast', 'Hyphae & mycelium'],
    },
    {
      id: 'plantae', name: 'Plantae', color: 'hsl(120, 60%, 45%)',
      facts: ['Cellulose cell wall', 'Autotrophic', 'Chloroplasts present', 'Multicellular'],
    },
  ],
}

// ── AudioLecture: Protein Synthesis ─────────────────────────────────────────
export const neoBioAudio: AudioLectureConfig = {
  type: 'audio-lecture',
  theme: 'Protein Synthesis',
  subject: 'NEET Biology',
  title: 'From DNA to Protein',
  concepts: ['Transcription', 'Translation', 'mRNA'],
  passage:
    'Protein synthesis occurs in two stages. First, Transcription: the DNA double helix unwinds and RNA polymerase reads the template strand to produce messenger RNA. ' +
    'Second, Translation: the mRNA travels to the ribosome where tRNA anticodons match mRNA codons, adding amino acids to build the polypeptide chain. ' +
    'The start codon is AUG and the stop codons are UAA, UAG, and UGA.',
  displayPassage:
    'Protein synthesis occurs in two stages. First, ___: the DNA double helix unwinds and ___ reads the template strand to produce messenger RNA. ' +
    'Second, Translation: the mRNA travels to the ___ where tRNA anticodons match mRNA codons, adding amino acids to build the polypeptide chain. ' +
    'The start codon is AUG.',
  blanks: [
    { id: 'b1', answer: 'Transcription' },
    { id: 'b2', answer: 'RNA polymerase' },
    { id: 'b3', answer: 'ribosome' },
  ],
  chips: ['Transcription', 'RNA polymerase', 'ribosome', 'DNA ligase', 'Golgi body'],
  questions: [
    { id: 'q1', prompt: 'What enzyme reads DNA during transcription?', options: ['DNA polymerase', 'RNA polymerase', 'Ligase', 'Helicase'], answer: 'RNA polymerase' },
    { id: 'q2', prompt: 'Which codon starts translation?', options: ['UAA', 'UGA', 'AUG', 'UAG'], answer: 'AUG' },
    { id: 'q3', prompt: 'Where does translation occur?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi'], answer: 'Ribosome' },
  ],
}

// ── Links: Identify the Biologist ───────────────────────────────────────────
export const neoBioLinks: LinksConfig = {
  type: 'links',
  theme: 'Famous Biologists',
  subject: 'NEET Biology',
  cards: [
    { id: 'darwin',   label: 'Charles Darwin' },
    { id: 'mendel',   label: 'Gregor Mendel' },
    { id: 'watson',   label: 'James Watson' },
    { id: 'flemming', label: 'Alexander Fleming' },
  ],
  rounds: [
    { cardId: 'darwin',   attributes: ['Theory of Natural Selection', 'HMS Beagle voyage', 'On the Origin of Species', 'Galapagos Islands'] },
    { cardId: 'mendel',   attributes: ['Pea plant experiments', 'Father of Genetics', 'Law of Segregation', 'Law of Independent Assortment'] },
    { cardId: 'watson',   attributes: ['DNA double helix', 'Nobel Prize 1962', 'Co-discoverer with Crick', 'Base pair model'] },
    { cardId: 'flemming', attributes: ['Discovered Penicillin', 'Mould on petri dish', 'Nobel Prize 1945', 'Accidental discovery'] },
  ],
}
