/**
 * Teaching Scenarios — Pre-built learning sequences using the Action System
 * Demonstrates educational patterns: concept intro → explanation → checkpoint → feedback → summary
 */

import type { GameScene } from './playback/engine';
import type { Action } from './action-types';

/**
 * Scenario 1: Introduction to Variables
 * Teaches: What are variables and why they matter
 */
export const introToVariablesScenario: GameScene[] = [
  {
    id: 'scene-1-intro',
    actions: [
      {
        id: 'spotlight-1',
        type: 'spotlight',
        elementId: 'concept-box',
        dimOpacity: 0.7,
      },
      {
        id: 'speech-1',
        type: 'speech',
        text: 'Welcome! Today we are learning about variables. A variable is a named container that holds a value. Think of it like a labeled box where you can store and retrieve information.',
      } as Action,
      {
        id: 'feedback-1',
        type: 'feedback',
        message: '💡 Key insight: Variables let you store data for later use',
        type_: 'hint',
        duration: 4000,
      } as Action,
      {
        id: 'speech-2',
        type: 'speech',
        text: 'Let me show you an example. In most programming languages, you declare a variable like this: let name equals "Alice". This creates a variable called "name" that stores the text "Alice".',
      } as Action,
    ],
  },
  {
    id: 'scene-1-checkpoint',
    actions: [
      {
        id: 'speech-3',
        type: 'speech',
        text: 'Now let us check your understanding with a quick question.',
      } as Action,
      {
        id: 'checkpoint-1',
        type: 'checkpoint',
        checkpointId: 'var-understanding',
        prompt: 'What is a variable?',
        options: [
          'A mathematical equation',
          'A named container that stores a value',
          'A function that calculates something',
          'A type of loop',
        ],
        expectedAnswer: 1,
      } as Action,
      {
        id: 'feedback-correct',
        type: 'feedback',
        message: '✅ Perfect! You understand the fundamentals.',
        type_: 'success',
        duration: 3000,
      } as Action,
      {
        id: 'speech-4',
        type: 'speech',
        text: 'Excellent! Variables are fundamental to programming. They allow you to write flexible, reusable code.',
      } as Action,
    ],
  },
];

/**
 * Scenario 2: Data Types Exploration
 * Teaches: Different types of data (numbers, text, booleans)
 */
export const dataTypesScenario: GameScene[] = [
  {
    id: 'scene-2-intro',
    actions: [
      {
        id: 'speech-1',
        type: 'speech',
        text: 'Different types of data require different storage methods. There are three main data types we focus on: numbers for quantities, text also called strings for words, and booleans for true or false values.',
      } as Action,
      {
        id: 'feedback-1',
        type: 'feedback',
        message: '📊 Three data types: Numbers, Strings, Booleans',
        type_: 'info',
        duration: 3000,
      } as Action,
    ],
  },
  {
    id: 'scene-2-numbers',
    actions: [
      {
        id: 'speech-2',
        type: 'speech',
        text: 'Numbers can be whole numbers called integers, or decimal numbers called floats. For example: let age equals 25 stores an integer, while let height equals 5.9 stores a float.',
      } as Action,
      {
        id: 'laser-1',
        type: 'laser',
        elementId: 'number-example',
        color: '#FF6B6B',
      },
    ],
  },
  {
    id: 'scene-2-strings',
    actions: [
      {
        id: 'speech-3',
        type: 'speech',
        text: 'Strings are text data. You write them in quotes. For example: let greeting equals "Hello World" creates a string variable. Strings can contain any characters: letters, numbers, spaces, and symbols.',
      } as Action,
      {
        id: 'laser-1',
        type: 'laser',
        elementId: 'string-example',
        color: '#4CAF50',
      },
    ],
  },
  {
    id: 'scene-2-booleans',
    actions: [
      {
        id: 'speech-4',
        type: 'speech',
        text: 'Booleans are the simplest type. They can only have two values: true or false. You use booleans to make decisions in your code. For example: let isRaining equals true.',
      } as Action,
      {
        id: 'laser-1',
        type: 'laser',
        elementId: 'boolean-example',
        color: '#2196F3',
      },
    ],
  },
  {
    id: 'scene-2-checkpoint',
    actions: [
      {
        id: 'speech-5',
        type: 'speech',
        text: 'Let us test your knowledge of data types.',
      } as Action,
      {
        id: 'checkpoint-2',
        type: 'checkpoint',
        checkpointId: 'datatype-understanding',
        prompt: 'Which of these is a STRING data type?',
        options: [
          '42',
          '"Hello"',
          'true',
          '3.14',
        ],
        expectedAnswer: 1,
      } as Action,
      {
        id: 'feedback-success',
        type: 'feedback',
        message: '🎉 Correct! Strings use quotes.',
        type_: 'success',
        duration: 3000,
      } as Action,
    ],
  },
];

/**
 * Scenario 3: Functions and Reusability
 * Teaches: Why functions are useful for code organization
 */
export const functionsScenario: GameScene[] = [
  {
    id: 'scene-3-intro',
    actions: [
      {
        id: 'speech-1',
        type: 'speech',
        text: 'Functions are reusable blocks of code. Instead of writing the same code repeatedly, you write it once in a function and call it many times. This saves time and makes code easier to maintain.',
      } as Action,
      {
        id: 'feedback-1',
        type: 'feedback',
        message: '🔧 Functions = reusable, organized code',
        type_: 'hint',
        duration: 3000,
      } as Action,
      {
        id: 'speech-2',
        type: 'speech',
        text: 'Here is a simple function: function greet opens parenthesis name closes parenthesis opens curly. return "Hello, " plus name. close curly. When you call greet of "Alice", it returns "Hello, Alice".',
      } as Action,
    ],
  },
  {
    id: 'scene-3-checkpoint',
    actions: [
      {
        id: 'speech-3',
        type: 'speech',
        text: 'Quick check: What is the main benefit of using functions?',
      } as Action,
      {
        id: 'checkpoint-3',
        type: 'checkpoint',
        checkpointId: 'function-understanding',
        prompt: 'Why use functions?',
        options: [
          'To make code shorter on disk',
          'To reuse code and stay organized',
          'To run code faster',
          'To avoid using variables',
        ],
        expectedAnswer: 1,
      } as Action,
      {
        id: 'feedback-success',
        type: 'feedback',
        message: '✅ Right! Functions promote reusability and organization.',
        type_: 'success',
        duration: 3000,
      } as Action,
    ],
  },
];

/**
 * Scenario Registry
 * Maps scenario names to their scenes for easy loading
 */
export const scenarioRegistry = {
  'intro-variables': introToVariablesScenario,
  'data-types': dataTypesScenario,
  'functions-intro': functionsScenario,
};

export type ScenarioName = keyof typeof scenarioRegistry;

export function getScenario(name: ScenarioName): GameScene[] {
  return scenarioRegistry[name] || [];
}

export function listScenarios(): ScenarioName[] {
  return Object.keys(scenarioRegistry) as ScenarioName[];
}
