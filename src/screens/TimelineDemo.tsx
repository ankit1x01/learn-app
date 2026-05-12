/**
 * Timeline Demo — Test bed for Action System + Playback Engine
 * Demonstrates unified action orchestration without full game complexity
 */

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ActionEngine } from '@/lib/action-engine';
import { PlaybackEngine, type GameScene } from '@/lib/playback/engine';
import { computeGamePlaybackView } from '@/lib/playback/derived-state';
import type { EngineMode } from '@/lib/playback/types';
import type { Action, CheckpointAction } from '@/lib/action-types';
import { getScenario, listScenarios, type ScenarioName } from '@/lib/teaching-scenarios';
import { getCurriculumEntry } from '@/lib/curriculum-mapping';
import { recordScenarioCompletion, saveScenarioPerformance, calculateConceptMastery } from '@/lib/scenario-performance';
import { EffectProvider, useEffects, type SpotlightEffect, type LaserEffect, type FeedbackEffect } from '@/lib/effect-context';
import { SpotlightOverlay } from '@/lib/effects/SpotlightOverlay';
import { LaserOverlay } from '@/lib/effects/LaserOverlay';
import { Feedback } from '@/lib/effects/Feedback';
import { Checkpoint } from '@/lib/ui/Checkpoint';
import { CodeBlock } from '@/lib/ui/CodeBlock';
import { Whiteboard } from '@/lib/ui/Whiteboard';
import '@/lib/effects.css';

// Action-level content — updates in sync with each speech action as audio plays
type ActionContent = { title: string; body: string; code?: string; lang?: string };

const ACTION_CONTENT: Record<string, ActionContent> = {
  // Scene 1 — Introduction
  'speech-welcome': {
    title: 'Object-Oriented Programming',
    body: 'A programming paradigm that structures code around objects and classes — combining data and behavior into reusable units.',
  },
  // Scene 2 — Concept definition
  'speech-definition': {
    title: 'What is OOP?',
    body: 'OOP uses objects (instances of classes) that bundle properties (data) and methods (behaviour) together. Promotes code reuse, maintainability, and organisation.',
    code: `// Class = blueprint
class Person {
  name: string;        // property
  age: number;

  greet() {            // method
    return \`Hi, I'm \${this.name}\`;
  }
}

// Object = instance of blueprint
const alice = new Person();
alice.name = 'Alice';
alice.greet(); // "Hi, I'm Alice"`,
    lang: 'typescript',
  },
  // Scene 3 — Car example
  'speech-example': {
    title: 'Class vs Instance — Car Example',
    body: 'A Car class is the blueprint. Your Honda Civic is one specific instance of that blueprint, with its own colour and speed values.',
    code: `class Car {
  color: string;
  speed: number = 0;
  fuelLevel: number = 100;

  constructor(color: string) {
    this.color = color;
  }

  accelerate(by: number) {
    this.speed += by;
    this.fuelLevel -= by * 0.5;
  }

  brake() {
    this.speed = Math.max(0, this.speed - 10);
  }
}

const myCivic = new Car('red');
myCivic.accelerate(60); // speed → 60`,
    lang: 'typescript',
  },
  // Scene 4 — Encapsulation
  'speech-encapsulation': {
    title: 'Encapsulation — Hide & Protect',
    body: 'Bundle data with the methods that operate on it. Hide internal details using private fields — expose only a clean public interface.',
    code: `class BankAccount {
  private balance: number;  // 🔒 hidden

  constructor(initial: number) {
    this.balance = initial;
  }

  // ✅ Public interface — only way in
  deposit(amount: number): void {
    if (amount > 0) this.balance += amount;
  }

  withdraw(amount: number): boolean {
    if (amount > this.balance) return false;
    this.balance -= amount;
    return true;
  }

  getBalance(): number { return this.balance; }
}

const acct = new BankAccount(1000);
acct.deposit(500);         // ✅ OK
// acct.balance = 9999;   // ❌ TypeScript error!`,
    lang: 'typescript',
  },
  // Scene 5 — Inheritance
  'speech-inheritance': {
    title: 'Inheritance — Child extends Parent',
    body: 'Create new classes based on existing ones. Child classes inherit all properties and methods, and can add or override behaviour.',
    code: `class Vehicle {
  brand: string;
  speed: number = 0;

  constructor(brand: string) { this.brand = brand; }

  move() {
    console.log(\`\${this.brand} moving at \${this.speed} km/h\`);
  }
}

// Car inherits everything from Vehicle
class Car extends Vehicle {
  doors: number;
  constructor(brand: string, doors: number) {
    super(brand);      // call parent constructor
    this.doors = doors;
  }
}

class Motorcycle extends Vehicle {
  hasSidecar = false;
}

const car = new Car('Toyota', 4);
car.move(); // inherited from Vehicle ✅`,
    lang: 'typescript',
  },
  // Scene 6 — Polymorphism
  'speech-polymorphism': {
    title: 'Polymorphism — Many Forms',
    body: 'Objects of different classes can share the same method name but behave differently. One interface, many implementations.',
    code: `class Animal {
  speak(): string { return 'Some sound'; }
}

class Dog extends Animal {
  speak(): string { return 'Woof! 🐕'; }
}

class Cat extends Animal {
  speak(): string { return 'Meow! 🐈'; }
}

class Duck extends Animal {
  speak(): string { return 'Quack! 🦆'; }
}

// Same call → different result based on type
const animals: Animal[] = [
  new Dog(), new Cat(), new Duck()
];

animals.forEach(a => console.log(a.speak()));
// Woof! 🐕
// Meow! 🐈
// Quack! 🦆`,
    lang: 'typescript',
  },
  // Scene 7 — Practical code
  'speech-code': {
    title: 'Inheritance + Polymorphism in Action',
    body: 'Dog inherits from Animal and overrides speak() — that\'s polymorphism. Dog also adds its own fetch() method — that\'s extension.',
    code: `class Animal {
  name: string;
  constructor(name: string) { this.name = name; }

  speak(): string {
    return \`\${this.name} makes a sound\`;
  }
}

class Dog extends Animal {
  // Override parent method — polymorphism
  speak(): string {
    return \`\${this.name} barks: Woof!\`;
  }

  // New method only Dog has
  fetch(item: string): string {
    return \`\${this.name} fetched the \${item}!\`;
  }
}

const dog = new Dog('Rex');
console.log(dog.speak());        // Rex barks: Woof!
console.log(dog.fetch('ball')); // Rex fetched the ball!`,
    lang: 'typescript',
  },
  // Scene 8 — Benefits
  'speech-benefits': {
    title: 'Why Use OOP?',
    body: 'Modular, reusable, maintainable, and scalable. Real-world concepts map directly to code structures, making programs intuitive.',
    code: `// Without OOP — repetitive, fragile
const dogName = 'Rex';
const dogSpeed = 30;
function dogBark() { return 'Woof'; }

// With OOP — organised, reusable
class Dog {
  constructor(
    public name: string,
    public speed: number,
  ) {}

  bark() { return 'Woof'; }
  run() { return \`\${this.name} runs at \${this.speed}km/h\`; }
}

// Scale to 1000 dogs — no duplication
const dogs = ['Rex','Luna','Max'].map(
  (n, i) => new Dog(n, 20 + i * 10)
);`,
    lang: 'typescript',
  },
  // Scene 12 — Real-world application
  'speech-application': {
    title: 'OOP in the Real World',
    body: 'React components, Angular services, iOS Swift classes, Android Java objects — OOP is the backbone of modern software.',
    code: `// React itself is OOP!
class MyComponent extends React.Component {
  state = { count: 0 };

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}

// Modern functional style (still OOP underneath)
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}`,
    lang: 'tsx',
  },
  // Scene 13 — Mastery
  'speech-mastery': {
    title: 'OOP Mastered! 🎓',
    body: 'You now understand Encapsulation (hide data), Inheritance (extend classes), and Polymorphism (same interface, different behaviour). You can design professional software systems.',
  },
  // Scene 14 — Next steps
  'speech-next': {
    title: 'Design Patterns — Next Level',
    body: 'Build on OOP with proven design patterns: MVC (Model-View-Controller), Factory, Observer, Singleton, and Strategy patterns.',
    code: `// Observer Pattern — objects watch for events
class EventEmitter {
  private listeners: Record<string, Function[]> = {};

  on(event: string, fn: Function) {
    (this.listeners[event] ??= []).push(fn);
  }

  emit(event: string, ...args: unknown[]) {
    this.listeners[event]?.forEach(fn => fn(...args));
  }
}

// Factory Pattern — create objects without knowing exact class
function createAnimal(type: 'dog' | 'cat'): Animal {
  return type === 'dog' ? new Dog('Buddy') : new Cat('Whiskers');
}`,
    lang: 'typescript',
  },
};

function getActionContent(actionId: string): ActionContent | null {
  return ACTION_CONTENT[actionId] ?? null;
}

// Default demo configuration
const DEFAULT_DEMO_SCENES: GameScene[] = [
  {
    id: 'scene-1',
    actions: [
      {
        id: 'spotlight-1',
        type: 'spotlight',
        elementId: 'demo-element',
        dimOpacity: 0.6,
      },
      {
        id: 'speech-1',
        type: 'speech',
        text: 'Welcome to the Timeline Demo. This demonstrates the Action System and Playback Engine working together to orchestrate a sequence of events.',
      },
      {
        id: 'feedback-1',
        type: 'feedback',
        message: 'Great! You are now experiencing timeline orchestration.',
        type_: 'success',
        duration: 3000,
      },
      {
        id: 'laser-1',
        type: 'laser',
        elementId: 'demo-element-2',
        color: '#FF6B6B',
      },
      {
        id: 'speech-2',
        type: 'speech',
        text: 'Actions are executed sequentially. Each action can be fire-and-forget (spotlight, laser, feedback) or synchronous (speech, whiteboard, checkpoints).',
      },
    ],
  },
];

function TimelineDemoContent({ onBack }: { onBack: () => void }) {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioName>('master-demo');
  const [mode, setMode] = useState<EngineMode>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [experienceMode, setExperienceMode] = useState<'learner' | 'developer'>('learner');
  const [showDevLog, setShowDevLog] = useState(false);
  const [currentScene, setCurrentScene] = useState('');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [checkpointsPassed, setCheckpointsPassed] = useState(0);
  const [checkpointsTotal, setCheckpointsTotal] = useState(0);
  const [currentCheckpoint, setCurrentCheckpoint] = useState<CheckpointAction | null>(null);
  const [currentActionId, setCurrentActionId] = useState<string>('');
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [speechSpeed, setSpeechSpeed] = useState(1);
  const [activityMode, setActivityMode] = useState<'practice' | 'simulation' | 'project'>('practice');
  const [objectCount, setObjectCount] = useState(1);
  const [showPrivateState, setShowPrivateState] = useState(false);
  const [lastSpeechText, setLastSpeechText] = useState('');
  const [showTranscript, setShowTranscript] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [completionData, setCompletionData] = useState<{ score: number; passed: number; total: number; durationMs: number } | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const engineRef = useRef<PlaybackEngine | null>(null);
  const actionEngineRef = useRef<ActionEngine | null>(null);
  const whiteboardRef = useRef<import('@/lib/ui/Whiteboard').WhiteboardHandle | null>(null);
  const logsEndRef = useRef<HTMLDivElement | null>(null);
  const { spotlight, laser, feedback, setSpotlight, setLaser, setFeedback } = useEffects();

  // Get current scenario scenes
  const currentScenes = useMemo(
    () => (selectedScenario ? getScenario(selectedScenario) : DEFAULT_DEMO_SCENES),
    [selectedScenario],
  );
  const scenarioCheckpointTotal = useMemo(
    () => currentScenes.reduce(
      (total, scene) => total + (scene.actions?.filter((action) => action.type === 'checkpoint').length ?? 0),
      0,
    ),
    [currentScenes],
  );

  // Count total checkpoints in scenario
  useEffect(() => {
    setCheckpointsTotal(scenarioCheckpointTotal);
  }, [scenarioCheckpointTotal]);

  // Initialize engines
  useEffect(() => {
    // Stop previous engine if running
    if (engineRef.current) {
      engineRef.current.stop();
    }

    const actionEngine = new ActionEngine(
      null,
      null,
      async (checkpointAction: CheckpointAction) => {
        engineRef.current?.pause();
        setCurrentCheckpoint(checkpointAction);
        addLog(`❓ Checkpoint: ${checkpointAction.prompt}`);
        return true;
      }
    );
    actionEngine.setEffectCallbacks({ setSpotlight, setLaser, setFeedback });
    actionEngine.setWhiteboardCallbacks({
      open: () => setShowWhiteboard(true),
      clear: () => whiteboardRef.current?.clear(),
      drawText: (text, x, y, color, fontSize) => {
        setShowWhiteboard(true);
        whiteboardRef.current?.drawText(text, x, y, color, fontSize);
      },
      drawRect: (x, y, w, h, color) => {
        setShowWhiteboard(true);
        whiteboardRef.current?.drawRect(x, y, w, h, color);
      },
      drawCircle: (cx, cy, r, color) => {
        setShowWhiteboard(true);
        whiteboardRef.current?.drawCircle(cx, cy, r, color);
      },
      drawLine: (x1, y1, x2, y2, color) => {
        setShowWhiteboard(true);
        whiteboardRef.current?.drawLine(x1, y1, x2, y2, color);
      },
      drawArrow: (x1, y1, x2, y2, color) => {
        setShowWhiteboard(true);
        whiteboardRef.current?.drawArrow(x1, y1, x2, y2, color);
      },
    });
    actionEngineRef.current = actionEngine;

    const playbackEngine = new PlaybackEngine(currentScenes, actionEngine, {
      onModeChange: (newMode) => {
        setMode(newMode);
        if (newMode === 'playing') {
          startTimeRef.current = Date.now();
          setCheckpointsPassed(0);
          setCheckpointsTotal(scenarioCheckpointTotal);
          setCurrentActionId('');
          setCompletionData(null);
          timerRef.current = setInterval(() => setElapsedMs(Date.now() - startTimeRef.current), 1000);
        }
        if (newMode === 'idle' || newMode === 'completed') {
          setCurrentActionId('');
          if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
        }
        addLog(`Mode: ${newMode}`);
      },
      onSceneChange: (sceneId) => {
        setCurrentScene(sceneId);
        addLog(`Scene: ${sceneId}`);
      },
      onSpeechStart: (text) => {
        setLastSpeechText(text);
        addLog(`🔊 Speech: "${text.substring(0, 50)}..."`);
      },
      onSpeechEnd: () => {
        addLog(`Speech complete`);
      },
      onProgress: (snapshot) => {
        setCurrentSceneIndex(snapshot.sceneIndex);
        const currentScene = currentScenes[snapshot.sceneIndex];
        const currentAction = currentScene?.actions?.[snapshot.actionIndex];
        if (currentAction?.id) setCurrentActionId(currentAction.id);
        // Auto-scroll logs
        setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);

        // Count checkpoints passed
        let checkpointsSoFar = 0;
        for (let si = 0; si <= snapshot.sceneIndex; si++) {
          const scene = currentScenes[si];
          if (!scene?.actions) continue;
          for (let ai = 0; ai < scene.actions.length; ai++) {
            if (si === snapshot.sceneIndex && ai >= snapshot.actionIndex) break;
            if (scene.actions[ai].type === 'checkpoint') checkpointsSoFar++;
          }
        }
        setCheckpointsPassed(checkpointsSoFar);
        addLog(`Progress: Scene ${snapshot.sceneIndex}, Action ${snapshot.actionIndex}`);
      },
      onComplete: () => {
        addLog(`✅ Timeline complete!`);
        const duration = Date.now() - startTimeRef.current;
        const finalTotal = scenarioCheckpointTotal;
        const finalPassed = finalTotal > 0 ? finalTotal : checkpointsPassed;
        const performance = recordScenarioCompletion(selectedScenario, duration, finalPassed, finalTotal);
        if (performance) {
          saveScenarioPerformance(performance);
          setCompletionData({ score: performance.score, passed: finalPassed, total: finalTotal, durationMs: duration });
          addLog(`📊 Score: ${performance.score}% (${finalPassed}/${finalTotal} checkpoints)`);
          const entry = getCurriculumEntry(selectedScenario);
          if (entry) {
            entry.conceptIds.forEach(id => addLog(`📈 ${id}: ${calculateConceptMastery(id)}% mastery`));
          }
        }
      },
    });

    engineRef.current = playbackEngine;

    return () => {
      playbackEngine.stop();
      actionEngine.dispose();
    };
  }, [currentScenes, scenarioCheckpointTotal, selectedScenario]);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  // Get content from current scene for visual zones
  const getCurrentSceneContent = () => {
    if (!currentScene || !currentScenes) return { focus: 'Ready', highlight: 'Waiting' };

    const sceneIndex = currentScenes.findIndex(s => s.id === currentScene);
    if (sceneIndex < 0) return { focus: 'Ready', highlight: 'Waiting' };

    const scene = currentScenes[sceneIndex];
    const speech = scene.actions?.find(a => a.type === 'speech') as any;

    if (!speech) return { focus: 'Ready', highlight: 'Waiting' };

    // Extract first sentence or first 60 chars as focus
    const text = speech.text || '';
    const firstSentence = text.split('.')[0].substring(0, 60);

    // Use scene name as highlight topic
    const sceneName = currentScene.split('-').pop()?.toUpperCase() || 'LEARNING';

    return {
      focus: firstSentence + (firstSentence.length < text.split('.')[0].length ? '...' : ''),
      highlight: sceneName
    };
  };

  const sceneContent = getCurrentSceneContent();

  const handleStart = () => {
    if (engineRef.current && mode === 'idle') {
      addLog('▶️ Starting playback...');
      engineRef.current.start();
    }
  };

  const handlePause = () => {
    if (engineRef.current && mode === 'playing') {
      addLog('⏸️ Pausing playback');
      engineRef.current.pause();
    }
  };

  const handleResume = () => {
    if (engineRef.current && mode === 'paused') {
      addLog('▶️ Resuming playback');
      engineRef.current.resume();
    }
  };

  const handleStop = () => {
    if (engineRef.current) {
      addLog('⏹️ Stopping playback');
      engineRef.current.stop();
    }
  };

  const handleClear = () => {
    setLogs([]);
  };

  const replayLastSpeech = async () => {
    if (!lastSpeechText || !actionEngineRef.current) return;
    addLog('Replaying last narration segment');
    await actionEngineRef.current.execute({
      id: 'replay-last-speech',
      type: 'speech',
      text: lastSpeechText,
    } as Action);
  };

  const applyWhiteboardTemplate = (template: 'class-object' | 'inheritance' | 'encapsulation' | 'pbl') => {
    setShowWhiteboard(true);
    setTimeout(() => {
      const board = whiteboardRef.current;
      if (!board) return;

      board.clear();

      if (template === 'class-object') {
        board.drawText('Class -> Object', 24, 28, '#134E4A', 18);
        board.drawRect(28, 48, 180, 112, '#0F766E');
        board.drawText('Car', 92, 75, '#0F766E', 18);
        board.drawText('color: string', 46, 104, '#334155', 13);
        board.drawText('speed: number', 46, 126, '#334155', 13);
        board.drawText('accelerate()', 46, 148, '#334155', 13);
        board.drawArrow(214, 104, 300, 104, '#F97316');
        board.drawText('new Car()', 226, 92, '#C2410C', 12);
        board.drawRect(310, 62, 190, 88, '#F97316');
        board.drawText('myCar object', 354, 92, '#9A3412', 16);
        board.drawText('color = "red"', 336, 120, '#334155', 13);
        board.drawText('speed = 60', 336, 140, '#334155', 13);
      }

      if (template === 'inheritance') {
        board.drawText('Inheritance Tree', 24, 28, '#134E4A', 18);
        board.drawRect(210, 44, 140, 48, '#4F46E5');
        board.drawText('Vehicle', 252, 75, '#312E81', 16);
        board.drawArrow(248, 92, 132, 152, '#64748B');
        board.drawArrow(280, 92, 280, 152, '#64748B');
        board.drawArrow(312, 92, 430, 152, '#64748B');
        board.drawRect(70, 154, 120, 46, '#0F766E');
        board.drawText('Car', 116, 183, '#065F46', 15);
        board.drawRect(220, 154, 120, 46, '#F97316');
        board.drawText('Bike', 264, 183, '#9A3412', 15);
        board.drawRect(380, 154, 120, 46, '#0284C7');
        board.drawText('Truck', 422, 183, '#075985', 15);
      }

      if (template === 'encapsulation') {
        board.drawText('Encapsulation Boundary', 24, 28, '#134E4A', 18);
        board.drawRect(72, 54, 400, 150, '#7C3AED');
        board.drawText('BankAccount', 220, 84, '#4C1D95', 18);
        board.drawText('private balance', 112, 124, '#B91C1C', 14);
        board.drawText('private accountId', 112, 150, '#B91C1C', 14);
        board.drawLine(288, 104, 288, 184, '#D8B4FE', 2);
        board.drawText('deposit()', 330, 124, '#166534', 14);
        board.drawText('withdraw()', 330, 150, '#166534', 14);
        board.drawText('getBalance()', 330, 176, '#166534', 14);
        board.drawText('Public methods are the safe door in.', 118, 230, '#57534E', 13);
      }

      if (template === 'pbl') {
        board.drawText('PBL: Library Management System', 24, 28, '#134E4A', 18);
        board.drawRect(30, 56, 140, 82, '#0F766E');
        board.drawText('Book', 78, 84, '#065F46', 16);
        board.drawText('title', 52, 110, '#334155', 12);
        board.drawText('checkout()', 52, 128, '#334155', 12);
        board.drawRect(220, 56, 140, 82, '#4F46E5');
        board.drawText('User', 270, 84, '#312E81', 16);
        board.drawText('name', 244, 110, '#334155', 12);
        board.drawText('borrow()', 244, 128, '#334155', 12);
        board.drawRect(410, 56, 130, 82, '#F97316');
        board.drawText('Loan', 458, 84, '#9A3412', 16);
        board.drawText('dueDate', 432, 110, '#334155', 12);
        board.drawText('return()', 432, 128, '#334155', 12);
        board.drawArrow(170, 96, 220, 96, '#64748B');
        board.drawArrow(360, 96, 410, 96, '#64748B');
        board.drawText('Add inheritance: Member -> StudentMember / TeacherMember', 42, 196, '#57534E', 13);
        board.drawText('Add polymorphism: notify() behaves differently per user type', 42, 220, '#57534E', 13);
      }

      addLog(`Whiteboard template applied: ${template}`);
    }, 80);
  };

  const view = computeGamePlaybackView(mode);
  const curriculumEntry = getCurriculumEntry(selectedScenario);
  const activeContent = getActionContent(currentActionId);
  const lessonTitle = curriculumEntry?.title?.split(':')[0] || activeContent?.title || 'Learning Experience';
  const sceneLabel = currentScene ? currentScene.split('-').pop()?.replace(/^\w/, (c) => c.toUpperCase()) || 'Scene' : 'Not started';
  const sceneProgress = currentScenes.length > 0 ? Math.min(100, ((currentSceneIndex + 1) / currentScenes.length) * 100) : 0;
  const checkpointProgress = checkpointsTotal > 0 ? Math.min(100, (checkpointsPassed / checkpointsTotal) * 100) : mode === 'completed' ? 100 : 0;
  const statusLabel = mode === 'idle' ? 'Ready' : mode === 'playing' ? 'Playing' : mode === 'paused' ? 'Paused' : 'Complete';
  const statusColor = mode === 'playing' ? '#0F766E' : mode === 'paused' ? '#B45309' : mode === 'completed' ? '#15803D' : '#57534E';
  const selectedScenarioLabel = selectedScenario
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const formatPercent = (value: number) => Number.isFinite(value) ? `${Math.round(value)}%` : '0%';
  const practicePrompt = activeContent?.title?.toLowerCase().includes('inheritance')
    ? 'Name one property a Car should inherit from Vehicle, and one method it should define itself.'
    : activeContent?.title?.toLowerCase().includes('polymorphism')
      ? 'Write one method name that different classes could share while behaving differently.'
      : activeContent?.title?.toLowerCase().includes('encapsulation')
        ? 'Which field should be private in a BankAccount class, and which method should expose it safely?'
        : 'Explain the difference between a class and an object using one real-world example.';
  const projectChecklist = [
    'Define at least three classes',
    'Mark private state and public methods',
    'Show one inheritance relationship',
    'Add one polymorphic method',
  ];

  return (
    <>
      <SpotlightOverlay elementId={spotlight?.elementId || null} dimness={spotlight?.dimOpacity} />
      <LaserOverlay elementId={laser?.elementId || null} color={laser?.color} />
      {feedback && <Feedback message={feedback.message} type={feedback.type} duration={feedback.duration} onComplete={() => setFeedback(null)} />}

      <div className="flex flex-col h-screen max-w-5xl mx-auto" style={{ background: '#F5F0E8' }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 border-b border-[#E3DDD5] bg-white"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)', paddingBottom: '12px' }}
      >
        <button
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center rounded-xl active:scale-95 transition-transform"
          style={{ background: 'var(--color-surface-container)', cursor: 'pointer' }}
        >
          <span className="material-symbols-rounded" style={{ fontSize: 24, color: '#292524' }}>
            chevron_left
          </span>
        </button>
        <div className="flex-1">
          <p className="text-[17px] font-black text-[var(--color-on-surface)]" style={{ fontFamily: 'Plus Jakarta Sans, system-ui' }}>
            OOP Learning Studio
          </p>
          <p className="text-[12px] text-[var(--color-on-surface-variant)]" style={{ fontFamily: 'Inter, system-ui' }}>
            Interactive lesson with voice, practice, whiteboard, and projects
          </p>
        </div>
        <div style={{ display: 'flex', gap: '4px', padding: '4px', borderRadius: '12px', background: '#F1ECE4' }}>
          {(['learner', 'developer'] as const).map((option) => (
            <button
              key={option}
              onClick={() => {
                setExperienceMode(option);
                if (option === 'developer') setShowDevLog(true);
              }}
              style={{
                border: 'none',
                borderRadius: '9px',
                padding: '7px 9px',
                background: experienceMode === option ? '#134E4A' : 'transparent',
                color: experienceMode === option ? 'white' : '#57534E',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 900,
                textTransform: 'capitalize',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Command Center */}
      <div style={{ padding: '18px', background: '#F5F0E8', borderBottom: '1px solid #E3DDD5' }}>
        <div
          style={{
            border: '1px solid #E5D8C8',
            borderRadius: '18px',
            background: '#FFFCF6',
            boxShadow: '0 14px 34px rgba(87, 65, 33, 0.10)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '14px', alignItems: 'center' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#0F766E' }}>school</span>
                <span style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.08em', color: '#78716C' }}>SCENARIO</span>
              </div>
              <select
                value={selectedScenario}
                onChange={(e) => {
                  setSelectedScenario(e.target.value as ScenarioName);
                  setMode('idle');
                  setLogs(['Scenario changed. Click Start to begin.']);
                }}
                disabled={mode !== 'idle'}
                style={{
                  width: '100%',
                  padding: '13px 14px',
                  borderRadius: '12px',
                  border: '1px solid #D6C7B7',
                  fontSize: '15px',
                  fontWeight: 850,
                  cursor: mode === 'idle' ? 'pointer' : 'not-allowed',
                  backgroundColor: mode === 'idle' ? '#FFFFFF' : '#F3F0EB',
                  color: '#1F2933',
                  outline: 'none',
                }}
                aria-label="Select learning scenario"
              >
                <option value="master-demo">Master Demo - OOP Complete Mastery (20 min)</option>
                {listScenarios()
                  .filter((name) => name !== 'master-demo')
                  .map((name) => (
                    <option key={name} value={name}>
                      {name
                        .split('-')
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(' ')}
                    </option>
                  ))}
              </select>
              <div style={{ marginTop: '9px', display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                <span style={{ padding: '5px 8px', borderRadius: '999px', background: '#ECFDF5', color: '#0F766E', fontSize: '11px', fontWeight: 800 }}>
                  {currentScenes.length} scenes
                </span>
                <span style={{ padding: '5px 8px', borderRadius: '999px', background: '#EFF6FF', color: '#1D4ED8', fontSize: '11px', fontWeight: 800 }}>
                  {scenarioCheckpointTotal} checkpoints
                </span>
                <span style={{ padding: '5px 8px', borderRadius: '999px', background: '#FFF7ED', color: '#C2410C', fontSize: '11px', fontWeight: 800 }}>
                  Speech + effects
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '8px', minWidth: '145px' }}>
              <button
                onClick={mode === 'idle' ? handleStart : mode === 'playing' ? handlePause : mode === 'paused' ? handleResume : () => { setMode('idle'); engineRef.current?.stop(); setCompletionData(null); }}
                style={{
                  height: '48px',
                  borderRadius: '14px',
                  border: 'none',
                  background: mode === 'completed' ? '#15803D' : mode === 'playing' ? '#B45309' : '#0F766E',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  boxShadow: '0 8px 18px rgba(15, 118, 110, 0.22)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '7px',
                }}
              >
                <span className="material-symbols-rounded" style={{ fontSize: 20 }}>
                  {mode === 'playing' ? 'pause' : mode === 'completed' ? 'replay' : 'play_arrow'}
                </span>
                {mode === 'idle' ? 'Start Lesson' : mode === 'playing' ? 'Pause' : mode === 'paused' ? 'Resume' : 'Replay'}
              </button>
              <button
                onClick={handleStop}
                disabled={mode === 'idle'}
                style={{
                  height: '34px',
                  borderRadius: '11px',
                  border: '1px solid #FECACA',
                  background: mode === 'idle' ? '#F4F1EC' : '#FEF2F2',
                  color: mode === 'idle' ? '#A8A29E' : '#B91C1C',
                  fontSize: '12px',
                  fontWeight: 850,
                  cursor: mode === 'idle' ? 'not-allowed' : 'pointer',
                }}
              >
                Stop
              </button>
            </div>
          </div>

          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px', borderRadius: '13px', background: '#F1ECE4' }}>
                <span style={{ fontSize: '11px', color: '#57534E', fontWeight: 900, paddingLeft: '5px' }}>Speed</span>
                {[0.75, 1, 1.5, 2].map(s => (
                  <button
                    key={s}
                    onClick={() => { setSpeechSpeed(s); if (actionEngineRef.current) actionEngineRef.current.speechSpeed = s; }}
                    style={{
                      minWidth: '38px',
                      padding: '6px 8px',
                      fontSize: '11px',
                      border: 'none',
                      borderRadius: '9px',
                      cursor: 'pointer',
                      background: speechSpeed === s ? '#134E4A' : 'transparent',
                      color: speechSpeed === s ? 'white' : '#57534E',
                      fontWeight: 900,
                    }}
                  >
                    {s}x
                  </button>
                ))}
              </div>
              <button
                onClick={handleClear}
                style={{ marginLeft: 'auto', padding: '9px 12px', fontSize: '12px', background: '#FFFFFF', color: '#57534E', border: '1px solid #E5D8C8', borderRadius: '11px', cursor: 'pointer', fontWeight: 800, display: experienceMode === 'developer' ? 'inline-block' : 'none' }}
              >
                Clear Log
              </button>
              <button
                onClick={replayLastSpeech}
                disabled={!lastSpeechText}
                style={{
                  padding: '9px 12px',
                  fontSize: '12px',
                  background: lastSpeechText ? '#FFFFFF' : '#F4F1EC',
                  color: lastSpeechText ? '#0F766E' : '#A8A29E',
                  border: '1px solid #CDE9DE',
                  borderRadius: '11px',
                  cursor: lastSpeechText ? 'pointer' : 'not-allowed',
                  fontWeight: 850,
                }}
              >
                Replay Voice
              </button>
              <button
                onClick={() => setShowTranscript((value) => !value)}
                style={{ padding: '9px 12px', fontSize: '12px', background: showTranscript ? '#134E4A' : '#FFFFFF', color: showTranscript ? 'white' : '#134E4A', border: '1px solid #CDE9DE', borderRadius: '11px', cursor: 'pointer', fontWeight: 850 }}
              >
                Transcript
              </button>
              <button
                onClick={() => setShowDevLog((value) => !value)}
                style={{ padding: '9px 12px', fontSize: '12px', background: showDevLog ? '#292524' : '#FFFFFF', color: showDevLog ? 'white' : '#292524', border: '1px solid #D6D3D1', borderRadius: '11px', cursor: 'pointer', fontWeight: 850, display: experienceMode === 'developer' ? 'inline-block' : 'none' }}
              >
                {showDevLog ? 'Hide Log' : 'Show Log'}
              </button>
            </div>

            {showTranscript && (
              <div style={{ marginBottom: '12px', padding: '12px', borderRadius: '13px', background: '#F0FDFA', border: '1px solid #CCFBF1' }}>
                <div style={{ fontSize: '11px', color: '#0F766E', fontWeight: 950, marginBottom: '5px' }}>CURRENT NARRATION</div>
                <div style={{ fontSize: '13px', color: '#134E4A', lineHeight: 1.55 }}>
                  {lastSpeechText || 'Start the lesson to see narration here.'}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '7px', fontSize: '11px', color: '#78716C', fontWeight: 800 }}>
              <span>Scene {mode === 'idle' ? 0 : currentSceneIndex + 1} / {currentScenes.length}</span>
              <span>{mode === 'playing' ? `${Math.floor(elapsedMs / 60000)}:${String(Math.floor((elapsedMs % 60000) / 1000)).padStart(2, '0')} elapsed` : statusLabel}</span>
              <span>{checkpointsPassed}/{scenarioCheckpointTotal} checkpoints</span>
            </div>
            <div style={{ background: '#E7E0D6', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                borderRadius: '999px',
                transition: 'width 0.6s ease',
                background: mode === 'completed' ? '#16A34A' : 'linear-gradient(90deg, #0F766E, #38BDF8)',
                width: `${mode === 'idle' ? 0 : sceneProgress}%`,
              }} />
            </div>
            <div style={{ display: 'flex', gap: '3px', marginTop: '6px' }}>
              {currentScenes.map((scene, i) => (
                <div key={scene.id} style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '99px',
                  background: i < currentSceneIndex || mode === 'completed' ? '#0F766E' : i === currentSceneIndex && mode !== 'idle' ? '#F59E0B' : '#DDD6CC',
                  transition: 'background 0.3s',
                }} title={scene.id} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Completion screen */}
      {completionData && mode === 'completed' && (
        <div style={{ padding: '0 18px 18px', background: '#F5F0E8' }}>
          <div style={{ padding: '18px', borderRadius: '18px', background: '#F0FDF4', border: '1px solid #BBF7D0', boxShadow: '0 12px 30px rgba(22, 101, 52, 0.10)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '4px' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 24, color: '#15803D' }}>verified</span>
                  <div style={{ fontSize: '19px', fontWeight: 950, color: '#14532D' }}>Lesson Complete</div>
                </div>
                <div style={{ fontSize: '12px', color: '#3F6B4A', lineHeight: 1.45 }}>
                  {curriculumEntry?.title || selectedScenarioLabel}
                </div>
              </div>
              <button
                onClick={() => { setMode('idle'); engineRef.current?.stop(); setCompletionData(null); }}
                style={{ padding: '10px 14px', background: '#14532D', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 900, cursor: 'pointer', fontSize: '12px' }}
              >
                Replay Lesson
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '10px', textAlign: 'left' }}>
            {[
              { label: 'Score', value: formatPercent(completionData.score), color: completionData.score >= 80 ? '#15803D' : completionData.score >= 60 ? '#B45309' : '#B91C1C' },
              { label: 'Checkpoints', value: `${completionData.passed}/${completionData.total}`, color: '#6750A4' },
              { label: 'Time', value: `${Math.floor(completionData.durationMs / 60000)}m ${Math.floor((completionData.durationMs % 60000) / 1000)}s`, color: '#2196F3' },
            ].map(stat => (
              <div key={stat.label} style={{ background: 'white', borderRadius: '13px', padding: '13px', border: '1px solid #DCFCE7' }}>
                <div style={{ fontSize: '10px', color: '#647067', fontWeight: 900, letterSpacing: '0.06em' }}>{stat.label.toUpperCase()}</div>
                <div style={{ fontSize: '24px', fontWeight: 950, color: stat.color, marginTop: '4px' }}>{stat.value}</div>
              </div>
            ))}
            </div>

            {curriculumEntry && (
              <div style={{ display: 'grid', gap: '8px', marginTop: '12px' }}>
                {curriculumEntry.conceptIds.map(id => {
                  const mastery = calculateConceptMastery(id);
                  return (
                    <div key={id} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', alignItems: 'center', gap: '12px', background: 'white', borderRadius: '12px', padding: '10px 12px', border: '1px solid #DCFCE7' }}>
                      <span style={{ fontSize: '12px', color: '#3F3B8F', fontWeight: 850, overflow: 'hidden', textOverflow: 'ellipsis' }}>{id}</span>
                      <span style={{ fontSize: '12px', fontWeight: 900, color: '#15803D' }}>{formatPercent(mastery)} mastery</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Curriculum Info */}
      {curriculumEntry && (
        <div
          style={{
            padding: '0 18px 18px',
            background: '#F5F0E8',
            borderBottom: '1px solid #E3DDD5',
          }}
        >
          <div style={{ padding: '14px 16px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E5D8C8', boxShadow: '0 8px 22px rgba(87, 65, 33, 0.07)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px', alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#134E4A', fontWeight: 950, fontSize: '14px', lineHeight: 1.35 }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 18 }}>menu_book</span>
                  {curriculumEntry.title}
                </div>
                <div style={{ fontSize: '12px', color: '#5F6C65', marginTop: '7px', lineHeight: 1.55 }}>
                  {curriculumEntry.description}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '280px' }}>
                <span style={{ padding: '5px 8px', borderRadius: '999px', background: '#F1F5F9', color: '#334155', fontSize: '11px', fontWeight: 800 }}>
                  {(curriculumEntry.estimatedDuration / 60).toFixed(0)} min
                </span>
                <span style={{ padding: '5px 8px', borderRadius: '999px', background: '#ECFDF5', color: '#0F766E', fontSize: '11px', fontWeight: 800 }}>
                  {curriculumEntry.difficulty}
                </span>
                {curriculumEntry.conceptIds.map((c) => (
                  <span key={c} style={{ padding: '5px 8px', borderRadius: '999px', backgroundColor: '#F5F3FF', color: '#5B21B6', fontSize: '11px', fontWeight: 750 }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Workspace - Visual Effect Targets */}
      <div style={{ padding: '18px', background: '#F7F3EA', borderBottom: '1px solid #E3DDD5' }}>
        <div
          style={{
            border: '1px solid #E7DED1',
            borderRadius: '18px',
            overflow: 'hidden',
            background: '#FFFCF6',
            boxShadow: '0 16px 40px rgba(79, 59, 28, 0.10)',
          }}
        >
          <div style={{ padding: '18px', background: 'linear-gradient(135deg, #102A43 0%, #256D85 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.08em', opacity: 0.78, marginBottom: '6px' }}>
                  LEARNING WORKSPACE
                </div>
                <h2 style={{ margin: 0, fontSize: '22px', lineHeight: 1.15, fontWeight: 900 }}>
                  {lessonTitle}
                </h2>
                <p style={{ margin: '8px 0 0', fontSize: '12px', lineHeight: 1.5, color: '#D9F0F2', maxWidth: '540px' }}>
                  {curriculumEntry?.description || 'Follow the lesson timeline, test yourself at checkpoints, and sketch ideas as the concept unfolds.'}
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 11px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.13)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  fontSize: '12px',
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: '0 0 0 3px rgba(255,255,255,0.18)' }} />
                {statusLabel}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginTop: '16px' }}>
              {[
                { label: 'Scene', value: sceneLabel },
                { label: 'Checkpoints', value: `${checkpointsPassed}/${checkpointsTotal}` },
                { label: 'Progress', value: `${Math.round(sceneProgress)}%` },
              ].map((stat) => (
                <div key={stat.label} style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.06em', color: '#BEE3E8' }}>{stat.label.toUpperCase()}</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, marginTop: '4px' }}>{stat.value}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '14px' }}>
              <div style={{ height: '7px', borderRadius: '999px', background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${sceneProgress}%`,
                    borderRadius: '999px',
                    background: 'linear-gradient(90deg, #FDE68A, #34D399)',
                    transition: 'width 0.45s ease',
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', padding: '16px' }}>
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ border: '1px solid #E7DED1', borderRadius: '14px', padding: '14px', background: '#FFFFFF' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#78716C', marginBottom: '10px' }}>LESSON PATH</div>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {currentScenes.slice(0, 8).map((scene, index) => {
                    const isDone = mode === 'completed' || index < currentSceneIndex;
                    const isActive = index === currentSceneIndex && mode !== 'idle';
                    const label = scene.id.split('-').pop() || scene.id;
                    return (
                      <div
                        key={scene.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                          padding: '8px 9px',
                          borderRadius: '10px',
                          background: isActive ? '#ECFDF5' : isDone ? '#F0FDF4' : '#FAFAF9',
                          border: `1px solid ${isActive ? '#5EEAD4' : isDone ? '#BBF7D0' : '#E7E5E4'}`,
                        }}
                        title={scene.id}
                      >
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flex: '0 0 auto',
                            fontSize: '12px',
                            fontWeight: 900,
                            color: isDone ? 'white' : isActive ? '#0F766E' : '#78716C',
                            background: isDone ? '#16A34A' : isActive ? '#CCFBF1' : '#F5F5F4',
                          }}
                        >
                          {isDone ? '✓' : index + 1}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: isActive ? 900 : 700, color: isActive ? '#0F766E' : '#44403C', textTransform: 'capitalize' }}>
                          {label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div id="demo-element-2" style={{ border: '1px solid #FED7AA', borderRadius: '14px', padding: '14px', background: '#FFF7ED' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#EA580C' }}>center_focus_strong</span>
                  <span style={{ fontSize: '11px', fontWeight: 900, color: '#EA580C' }}>NOW LEARNING</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#7C2D12', lineHeight: 1.3 }}>
                  {activeContent?.title ?? 'Current Topic'}
                </div>
                <div style={{ fontSize: '12px', color: '#9A3412', marginTop: '6px', lineHeight: 1.45 }}>
                  {mode === 'idle' ? 'Choose a scenario and start the lesson.' : activeContent ? 'The concept card is synced with the current narration.' : sceneContent.highlight}
                </div>
                {curriculumEntry && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
                    <span style={{ padding: '4px 7px', borderRadius: '999px', background: '#FFEDD5', color: '#9A3412', fontSize: '10px', fontWeight: 800 }}>{curriculumEntry.subject}</span>
                    {curriculumEntry.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} style={{ padding: '4px 7px', borderRadius: '999px', background: '#FFE7C2', color: '#9A3412', fontSize: '10px', fontWeight: 700 }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </aside>

            <section style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div
                id="demo-element"
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #BBF7D0',
                  background: '#FFFFFF',
                  boxShadow: '0 8px 24px rgba(15, 118, 110, 0.10)',
                  transition: 'all 0.3s ease',
                }}
              >
                {activeContent?.code ? (
                  <CodeBlock title={activeContent.title} code={activeContent.code} language={activeContent.lang} />
                ) : (
                  <div style={{ padding: '22px', background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFEFF 100%)', minHeight: '210px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <span className="material-symbols-rounded" style={{ color: '#0F766E', fontSize: 22 }}>auto_stories</span>
                      <span style={{ fontSize: '11px', fontWeight: 900, color: '#0F766E', letterSpacing: '0.06em' }}>CONCEPT CARD</span>
                    </div>
                    <h3 style={{ margin: 0, fontSize: '22px', lineHeight: 1.2, color: '#134E4A', fontWeight: 900 }}>
                      {activeContent?.title ?? lessonTitle}
                    </h3>
                    <p style={{ margin: '12px 0 0', fontSize: '14px', color: '#36534F', lineHeight: 1.65 }}>
                      {activeContent?.body ?? (mode === 'idle' ? 'Press Start when you are ready. The lesson card will update as each narration segment begins.' : sceneContent.focus)}
                    </p>
                    <div style={{ marginTop: '18px', padding: '12px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.78)', border: '1px solid #CCFBF1' }}>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#0F766E', marginBottom: '4px' }}>LEARNER PROMPT</div>
                      <div style={{ fontSize: '13px', color: '#33403D', lineHeight: 1.45 }}>
                        Say the idea back in one sentence, then draw a tiny example on the board.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #E7DED1' }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#78716C' }}>CHECKPOINT MASTERY</div>
                  <div style={{ height: '6px', background: '#E7E5E4', borderRadius: '999px', overflow: 'hidden', marginTop: '9px' }}>
                    <div style={{ width: `${checkpointProgress}%`, height: '100%', background: '#16A34A', borderRadius: '999px', transition: 'width 0.35s ease' }} />
                  </div>
                  <div style={{ marginTop: '7px', fontSize: '12px', fontWeight: 800, color: '#44403C' }}>{checkpointsPassed} passed</div>
                </div>
                <button
                  onClick={() => setShowWhiteboard(v => !v)}
                  style={{
                    padding: '12px',
                    minHeight: '72px',
                    borderRadius: '12px',
                    border: `1px solid ${showWhiteboard ? '#7C3AED' : '#DDD6FE'}`,
                    background: showWhiteboard ? '#5B21B6' : '#FFFFFF',
                    color: showWhiteboard ? 'white' : '#5B21B6',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span className="material-symbols-rounded" style={{ fontSize: 20 }}>draw</span>
                  {showWhiteboard ? 'Hide Board' : 'Open Whiteboard'}
                </button>
              </div>

              <div style={{ borderRadius: '14px', background: '#FFFFFF', border: '1px solid #E5D8C8', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px' }}>
                  <span className="material-symbols-rounded" style={{ fontSize: 18, color: '#5B21B6' }}>dashboard_customize</span>
                  <span style={{ fontSize: '11px', fontWeight: 950, color: '#57534E' }}>WHITEBOARD TEMPLATES</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'class-object', label: 'Class/Object' },
                    { id: 'inheritance', label: 'Inheritance' },
                    { id: 'encapsulation', label: 'Encapsulation' },
                    { id: 'pbl', label: 'PBL Sketch' },
                  ].map((template) => (
                    <button
                      key={template.id}
                      onClick={() => applyWhiteboardTemplate(template.id as 'class-object' | 'inheritance' | 'encapsulation' | 'pbl')}
                      style={{
                        padding: '9px 8px',
                        borderRadius: '10px',
                        border: '1px solid #DDD6FE',
                        background: '#FAF8FF',
                        color: '#5B21B6',
                        fontSize: '12px',
                        fontWeight: 850,
                        cursor: 'pointer',
                      }}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E5D8C8', overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #EFE6DA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 20, color: '#134E4A' }}>psychology_alt</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 950, color: '#1F2933' }}>Activity Studio</div>
                      <div style={{ fontSize: '11px', color: '#78716C' }}>Practice, simulate, then build.</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '5px', padding: '4px', background: '#F5F1EA', borderRadius: '12px' }}>
                    {[
                      { id: 'practice', label: 'Quiz', icon: 'quiz' },
                      { id: 'simulation', label: 'Sim', icon: 'widgets' },
                      { id: 'project', label: 'PBL', icon: 'assignment' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActivityMode(tab.id as typeof activityMode)}
                        style={{
                          border: 'none',
                          borderRadius: '9px',
                          padding: '7px 9px',
                          background: activityMode === tab.id ? '#134E4A' : 'transparent',
                          color: activityMode === tab.id ? 'white' : '#57534E',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: 900,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span className="material-symbols-rounded" style={{ fontSize: 15 }}>{tab.icon}</span>
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activityMode === 'practice' && (
                  <div style={{ padding: '14px', background: '#FFFCF6' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#B45309', marginBottom: '8px' }}>QUICK PRACTICE</div>
                    <div style={{ fontSize: '15px', fontWeight: 850, color: '#292524', lineHeight: 1.5 }}>
                      {practicePrompt}
                    </div>
                    <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                      {['I can explain it', 'Need example', 'Ask checkpoint'].map((label) => (
                        <button
                          key={label}
                          onClick={() => addLog(`Practice reflection: ${label}`)}
                          style={{ padding: '9px', borderRadius: '10px', border: '1px solid #E5D8C8', background: '#FFFFFF', color: '#57534E', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activityMode === 'simulation' && (
                  <div style={{ padding: '14px', background: '#F0FDFA' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: '12px', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 900, color: '#0F766E', marginBottom: '6px' }}>INTERACTIVE HTML SCENE</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#134E4A' }}>OOP Object Factory</div>
                        <div style={{ fontSize: '12px', color: '#36534F', lineHeight: 1.45, marginTop: '4px' }}>
                          Create object instances from one class blueprint and toggle private state visibility.
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button onClick={() => setObjectCount((value) => Math.min(5, value + 1))} style={{ padding: '9px 10px', borderRadius: '10px', border: 'none', background: '#0F766E', color: 'white', fontSize: '12px', fontWeight: 900, cursor: 'pointer' }}>Create Object</button>
                        <button onClick={() => setObjectCount(1)} style={{ padding: '9px 10px', borderRadius: '10px', border: '1px solid #99F6E4', background: '#FFFFFF', color: '#0F766E', fontSize: '12px', fontWeight: 850, cursor: 'pointer' }}>Reset</button>
                      </div>
                    </div>
                    <div style={{ marginTop: '13px', display: 'grid', gridTemplateColumns: '140px minmax(0, 1fr)', gap: '10px', alignItems: 'stretch' }}>
                      <div style={{ padding: '12px', borderRadius: '13px', background: '#134E4A', color: 'white' }}>
                        <div style={{ fontSize: '11px', opacity: 0.75, fontWeight: 900 }}>CLASS</div>
                        <div style={{ marginTop: '5px', fontSize: '16px', fontWeight: 950 }}>Car</div>
                        <div style={{ marginTop: '8px', fontSize: '11px', lineHeight: 1.5, color: '#CCFBF1' }}>color<br />speed<br />accelerate()</div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '8px' }}>
                        {Array.from({ length: objectCount }).map((_, index) => (
                          <div key={index} style={{ padding: '11px', borderRadius: '13px', background: '#FFFFFF', border: '1px solid #99F6E4' }}>
                            <div style={{ fontSize: '11px', fontWeight: 900, color: '#0F766E' }}>OBJECT {index + 1}</div>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: '#292524', marginTop: '4px' }}>car{index + 1}</div>
                            <div style={{ fontSize: '11px', color: '#57534E', marginTop: '5px', lineHeight: 1.45 }}>
                              color: {['red', 'blue', 'green', 'black', 'white'][index]}<br />
                              speed: {20 + index * 15}
                              {showPrivateState && <><br />_engineId: hidden</>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <label style={{ marginTop: '10px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '12px', color: '#134E4A', fontWeight: 800 }}>
                      <input type="checkbox" checked={showPrivateState} onChange={(event) => setShowPrivateState(event.target.checked)} />
                      Reveal private implementation state
                    </label>
                  </div>
                )}

                {activityMode === 'project' && (
                  <div style={{ padding: '14px', background: '#F8FAFC' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#475569', marginBottom: '7px' }}>PROJECT-BASED LEARNING</div>
                    <div style={{ fontSize: '16px', fontWeight: 950, color: '#1E293B' }}>Design a library management system</div>
                    <div style={{ marginTop: '6px', fontSize: '12px', color: '#475569', lineHeight: 1.55 }}>
                      Model books, users, and borrowing with OOP. Use the whiteboard to sketch your class diagram before writing code.
                    </div>
                    <div style={{ marginTop: '12px', display: 'grid', gap: '7px' }}>
                      {projectChecklist.map((item, index) => (
                        <label key={item} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 10px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                          <input type="checkbox" />
                          <span>{index + 1}. {item}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={() => applyWhiteboardTemplate('pbl')}
                      style={{ marginTop: '12px', width: '100%', padding: '10px', borderRadius: '11px', border: 'none', background: '#334155', color: 'white', fontSize: '12px', fontWeight: 900, cursor: 'pointer' }}
                    >
                      Generate Project Sketch on Whiteboard
                    </button>
                  </div>
                )}
              </div>

              {showWhiteboard && (
                <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid #7C3AED', background: '#FFFFFF' }}>
                  <div style={{ background: '#5B21B6', padding: '10px 14px', color: 'white', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="material-symbols-rounded" style={{ fontSize: 18 }}>edit_note</span>
                    Whiteboard Notes
                  </div>
                  <Whiteboard ref={whiteboardRef} width={560} height={240} backgroundColor="#FFFBFE" />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Checkpoint Modal */}
      {currentCheckpoint && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => {
            // Click outside to close (optional)
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            }}
          >
            <Checkpoint
              prompt={currentCheckpoint.prompt}
              options={currentCheckpoint.options}
              expectedAnswer={currentCheckpoint.expectedAnswer}
              explanation={currentCheckpoint.explanation}
              hint={currentCheckpoint.hint}
              conceptId={currentCheckpoint.conceptId}
              onAnswer={(answer, isCorrect) => {
                addLog(`${isCorrect ? '✅' : '❌'} Answer: ${currentCheckpoint.options?.[Number(answer)] || answer}`);
                setCurrentCheckpoint(null);
                setTimeout(() => {
                  engineRef.current?.resume();
                }, 500);
              }}
              onSkip={() => {
                addLog('⏭️ Checkpoint skipped');
                setCurrentCheckpoint(null);
                setTimeout(() => {
                  engineRef.current?.resume();
                }, 500);
              }}
            />
          </div>
        </div>
      )}

      {/* Developer Log */}
      {experienceMode === 'developer' && (
        <div style={{ background: '#F5F0E8', borderTop: '1px solid #E3DDD5', padding: '0 18px 18px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid #2E2A27', background: '#1E1E1E' }}>
            <button
              onClick={() => setShowDevLog((value) => !value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                background: '#292524',
                color: '#F5F5F4',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 900,
              }}
            >
              <span>Timeline Execution Log</span>
              <span>{logs.length} events · {showDevLog ? 'Hide' : 'Show'}</span>
            </button>
            {showDevLog && (
              <div
                style={{
                  maxHeight: '260px',
                  padding: '14px',
                  overflowY: 'auto',
                  fontFamily: '"Fira Code", "Monaco", monospace',
                  fontSize: '12px',
                  lineHeight: '1.6',
                  color: '#00FF00',
                }}
              >
                {logs.length === 0 ? (
                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                    Select a scenario and click Start to begin execution...
                  </div>
                ) : (
                  [...logs].map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        marginBottom: '4px',
                        color: log.includes('✅') ? '#4ADE80' : log.includes('🔊') ? '#FBBF24' : log.includes('❓') ? '#60A5FA' : log.includes('Error') ? '#F87171' : '#A3E635',
                        borderLeft: log.includes('✅') ? '3px solid #00FF00' : log.includes('Error') ? '3px solid #FF0000' : 'none',
                        paddingLeft: log.includes('✅') || log.includes('Error') ? '8px' : '0',
                      }}
                    >
                      {log}
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export function TimelineDemo({ onBack }: { onBack: () => void }) {
  return (
    <EffectProvider>
      <TimelineDemoContent onBack={onBack} />
    </EffectProvider>
  );
}
