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
  audioSrc: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Audio track for pacing
  entities: [
    {
      id: 'terrestrial',
      name: 'Terrestrial',
      color: 'hsl(35, 80%, 55%)',
      facts: [
        { text: 'Mercury closest to sun', spawnTimeMs: 1000 },
        { text: 'Venus hottest planet', spawnTimeMs: 5500 },
        { text: 'Earth has life', spawnTimeMs: 10000 },
        { text: 'Mars red planet', spawnTimeMs: 14500 }
      ],
    },
    {
      id: 'gas-giant',
      name: 'Gas Giant',
      color: 'hsl(280, 60%, 60%)',
      facts: [
        { text: 'Jupiter has Great Red Spot', spawnTimeMs: 2500 },
        { text: 'Saturn has prominent rings', spawnTimeMs: 7000 },
        { text: 'Uranus tilted 98°', spawnTimeMs: 11500 },
        { text: 'Neptune coldest', spawnTimeMs: 16000 }
      ],
    },
    {
      id: 'moon',
      name: 'Moon',
      color: 'hsl(200, 65%, 55%)',
      facts: [
        { text: 'Earth\'s Moon causes tides', spawnTimeMs: 4000 },
        { text: 'Mars has Phobos & Deimos', spawnTimeMs: 8500 },
        { text: 'Jupiter has Io', spawnTimeMs: 13000 },
        { text: 'Saturn has Titan', spawnTimeMs: 17500 }
      ],
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
  subject: 'Globalisation',
  theme: 'Historical Context',
  // audioUrl removed - uses TTS mode with globalisation passage instead
  events: []
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

export const sampleVisualizationGame: import('../types').MemoryVisualizationConfig = {
  type: 'memory-visualization',
  theme: 'Biology',
  subject: 'Human Anatomy',
  items: [
    {
      id: 'heart',
      label: 'Human Heart',
      description: 'A muscular organ with four chambers. Imagine it pumping rhythmically, sending bright red oxygenated blood out through the aorta, and drawing in dark blue deoxygenated blood.'
    },
    {
      id: 'lungs',
      label: 'Lungs',
      description: 'Two large spongy structures filling the chest. Picture them expanding like balloons when filled with air, covered in tiny branching tubes like an upside-down tree.'
    },
    {
      id: 'brain',
      label: 'Brain',
      description: 'A highly folded, grayish-pink organ sitting inside the skull. Visualize electricity zipping across its surface as billions of neurons fire simultaneously.'
    }
  ]
}

export const sampleTeachBackGame: import('../types').MemoryTeachBackConfig = {
  type: 'memory-teach-back',
  theme: 'Economics',
  subject: 'Public vs Private Sector',
  concept: 'Public vs Private Sector',
  prompt: 'Explain the key differences between the Public and Private sector. Focus on their primary motives, who owns them, and give an example of each.',
  persona: 'A 12-year-old student',
  requiredKeywords: ['government', 'profit', 'services', 'owned', 'example']
}

export const sampleInversionGame: import('../types').MemoryInversionConfig = {
  type: 'memory-inversion',
  theme: 'Civics',
  subject: 'Federalism',
  statements: [
    {
      id: 'stmt1',
      text: 'In a Federal system, the central government can ALWAYS pass orders to the provincial government to do something.',
      isTrap: true,
      explanation: 'TRAP word: "ALWAYS". In a unitary system the center can order locals, but in Federalism, State governments have powers of their own for which they are not answerable to the center.'
    },
    {
      id: 'stmt2',
      text: 'Municipalities and Gram Panchayats are examples of the third tier of government in India.',
      isTrap: false,
      explanation: 'True. This represents the local self-government system introduced to decentralize power.'
    },
    {
      id: 'stmt3',
      text: 'Reserved Forests are those that are ONLY meant for producing timber and no other use is allowed ever.',
      isTrap: true,
      explanation: 'TRAP word: "ONLY". Reserved forests restrict activities, but they also protect wildlife and are not solely for timber.'
    }
  ]
}
