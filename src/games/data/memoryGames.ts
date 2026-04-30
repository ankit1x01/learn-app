// src/games/data/memoryGames.ts
import {
  GameConfig,
  MemoryAttentionConfig,
  MemoryNameRecallConfig,
  MemoryRetentionConfig,
  MemorySequencingConfig,
  MemorySynthesisConfig,
  BubbleMatchConfig
} from '../types';

export const sampleAttentionGame: GameConfig = {
  type: 'bubble-match',
  subject: 'Solar System',
  theme: 'Planets & Their Moons',
  entities: [
    {
      id: 'terrestrial',
      name: 'Terrestrial',
      color: 'hsl(35, 80%, 55%)',
      facts: ['Mercury closest to sun', 'Venus hottest planet', 'Earth has life', 'Mars red planet'],
    },
    {
      id: 'gas-giant',
      name: 'Gas Giant',
      color: 'hsl(280, 60%, 60%)',
      facts: ['Jupiter has Great Red Spot', 'Saturn has prominent rings', 'Uranus tilted 98°', 'Neptune coldest'],
    },
    {
      id: 'moon',
      name: 'Moon',
      color: 'hsl(200, 65%, 55%)',
      facts: ['Earth\'s Moon causes tides', 'Mars has Phobos & Deimos', 'Jupiter has Io', 'Saturn has Titan'],
    },
  ],
} as GameConfig;


export const sampleNameRecallGame: MemoryNameRecallConfig = {
  type: 'memory-name-recall',
  subject: 'Social',
  theme: 'Office Meeting',
  people: [
    { id: 'p1', name: 'Maggie', detail: 'Runs the math department', faceUrl: 'https://i.pravatar.cc/150?u=maggie' },
    { id: 'p2', name: 'Scarlett', detail: 'Wears a red scarf', faceUrl: 'https://i.pravatar.cc/150?u=scarlett' },
    { id: 'p3', name: 'Arthur', detail: 'Expert in ancient history', faceUrl: 'https://i.pravatar.cc/150?u=arthur' },
    { id: 'p4', name: 'Elena', detail: 'Lead software architect', faceUrl: 'https://i.pravatar.cc/150?u=elena' },
  ],
  mnemonicPairs: [
    { name: 'Scarlett', mnemonic: 'Scarlett wears a Scarf' },
    { name: 'Maggie', mnemonic: 'Maggie loves Math' }
  ]
};

export const sampleRetentionGame: MemoryRetentionConfig = {
  type: 'memory-retention',
  subject: 'General Knowledge',
  theme: 'City Tour',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  questions: [
    { 
      id: 'q1', 
      prompt: 'What color was the car mentioned in the second sentence?', 
      options: ['Red', 'Blue', 'Silver', 'Black'], 
      answer: 'Blue',
      difficulty: 'low'
    },
    { 
      id: 'q2', 
      prompt: 'How many people were standing at the bus stop?', 
      options: ['3', '5', '7', '10'], 
      answer: '7',
      difficulty: 'high'
    }
  ]
};

export const sampleSequencingGame: MemorySequencingConfig = {
  type: 'memory-sequencing',
  subject: 'Navigation',
  theme: 'Morning Route',
  audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  events: [
    { id: 'e1', label: 'Left at the bank', order: 1 },
    { id: 'e2', label: 'Right at the park', order: 2 },
    { id: 'e3', label: 'Straight through the tunnel', order: 3 },
    { id: 'e4', label: 'Arrive at the station', order: 4 },
  ]
};

export const sampleSynthesisGame: MemorySynthesisConfig = {
  type: 'memory-synthesis',
  subject: 'Logic',
  theme: 'Office Puzzle',
  question: 'Is the meeting in New York?',
  premises: [
    { id: 'pr1', text: 'The office is located in New York.' },
    { id: 'pr2', text: 'The meeting will take place in the office.' }
  ],
  conclusion: {
    text: 'The meeting is in New York.',
    isValid: true
  }
};
