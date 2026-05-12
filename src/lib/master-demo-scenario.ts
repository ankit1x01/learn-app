/**
 * Master Demo Scenario — Comprehensive showcase of ALL Timeline features
 * Real educational content with all action types
 */

import type { GameScene } from './playback/engine';
import type { Action } from './action-types';

export const masterDemoScenario: GameScene[] = [
  // ==================== SCENE 1: INTRODUCTION ====================
  {
    id: 'master-scene-1-intro',
    actions: [
      {
        id: 'spotlight-intro',
        type: 'spotlight',
        elementId: 'demo-element',
        dimOpacity: 0.7,
      },
      {
        id: 'speech-welcome',
        type: 'speech',
        text: 'Welcome to the Master Learning Experience! Today we will explore a comprehensive programming concept with interactive demonstrations, visual effects, and real-world applications.',
      } as Action,
      {
        id: 'feedback-intro',
        type: 'feedback',
        message: '🎓 You are about to master a core programming concept',
        type_: 'hint',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 2: CONCEPT EXPLANATION ====================
  {
    id: 'master-scene-2-concept',
    actions: [
      {
        id: 'laser-concept',
        type: 'laser',
        elementId: 'demo-element',
        color: '#6B5CE7',
      },
      {
        id: 'speech-definition',
        type: 'speech',
        text: 'Object-Oriented Programming, or OOP, is a programming paradigm that uses objects and classes to structure code. Objects are instances of classes that contain both data, called properties, and functions, called methods. This approach promotes code reuse, maintainability, and clear organization.',
      } as Action,
      {
        id: 'feedback-definition',
        type: 'feedback',
        message: '📚 Key principle: Objects bundle data and behavior together',
        type_: 'info',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 3: REAL-WORLD EXAMPLE ====================
  {
    id: 'master-scene-3-example',
    actions: [
      {
        id: 'spotlight-example',
        type: 'spotlight',
        elementId: 'demo-element-2',
        dimOpacity: 0.6,
      },
      { id: 'wb-open-3', type: 'wb_open' } as Action,
      { id: 'wb-clear-3', type: 'wb_clear' } as Action,
      // Car class box (header)
      { id: 'wb-car-box', type: 'wb_draw_shape', shape: 'rectangle', x: 30, y: 20, width: 200, height: 36, fillColor: '#6750A4' } as unknown as Action,
      { id: 'wb-car-label', type: 'wb_draw_text', content: 'Car  (Class)', x: 70, y: 45, fontSize: 14, color: '#FFFFFF' } as unknown as Action,
      // Properties section
      { id: 'wb-car-props-box', type: 'wb_draw_shape', shape: 'rectangle', x: 30, y: 56, width: 200, height: 72, fillColor: '#EDE7F6' } as unknown as Action,
      { id: 'wb-prop1', type: 'wb_draw_text', content: '  color: string', x: 38, y: 76, fontSize: 11, color: '#4A148C' } as unknown as Action,
      { id: 'wb-prop2', type: 'wb_draw_text', content: '  speed: number', x: 38, y: 96, fontSize: 11, color: '#4A148C' } as unknown as Action,
      { id: 'wb-prop3', type: 'wb_draw_text', content: '  fuelLevel: number', x: 38, y: 116, fontSize: 11, color: '#4A148C' } as unknown as Action,
      // Methods section
      { id: 'wb-car-methods-box', type: 'wb_draw_shape', shape: 'rectangle', x: 30, y: 128, width: 200, height: 60, fillColor: '#E8F5E9' } as unknown as Action,
      { id: 'wb-meth1', type: 'wb_draw_text', content: '  accelerate()', x: 38, y: 148, fontSize: 11, color: '#1B5E20' } as unknown as Action,
      { id: 'wb-meth2', type: 'wb_draw_text', content: '  brake()', x: 38, y: 166, fontSize: 11, color: '#1B5E20' } as unknown as Action,
      { id: 'wb-meth3', type: 'wb_draw_text', content: '  refuel()', x: 38, y: 184, fontSize: 11, color: '#1B5E20' } as unknown as Action,
      // Arrow + instance
      { id: 'wb-arrow-3', type: 'wb_draw_line', startX: 230, startY: 100, endX: 290, endY: 100, color: '#FF6B6B', points: ['', 'arrow'] } as unknown as Action,
      { id: 'wb-new-label', type: 'wb_draw_text', content: 'new Car("red")', x: 295, y: 96, fontSize: 11, color: '#FF6B6B' } as unknown as Action,
      { id: 'wb-instance-box', type: 'wb_draw_shape', shape: 'rectangle', x: 290, y: 108, width: 150, height: 60, fillColor: '#FFEBEE' } as unknown as Action,
      { id: 'wb-inst1', type: 'wb_draw_text', content: '  color: "red"', x: 298, y: 128, fontSize: 11, color: '#B71C1C' } as unknown as Action,
      { id: 'wb-inst2', type: 'wb_draw_text', content: '  speed: 60', x: 298, y: 148, fontSize: 11, color: '#B71C1C' } as unknown as Action,
      {
        id: 'speech-example',
        type: 'speech',
        text: 'Consider a real-world example: a Car class. The Car class defines properties like color, speed, and fuel level. It also defines methods like accelerate, brake, and refuel. Every specific car you create is an instance of the Car class, inheriting all these properties and methods.',
      } as Action,
      {
        id: 'feedback-example',
        type: 'feedback',
        message: '🚗 Example: Car is a class, your Honda Civic is an instance',
        type_: 'hint',
        duration: 4000,
      } as Action,
    ],
  },

  // ==================== SCENE 4: KEY PRINCIPLES ====================
  {
    id: 'master-scene-4-principles',
    actions: [
      {
        id: 'laser-principle-1',
        type: 'laser',
        elementId: 'demo-element',
        color: '#FF6B6B',
      },
      {
        id: 'speech-encapsulation',
        type: 'speech',
        text: 'The first principle is Encapsulation. This means bundling data and methods together, and hiding internal details from the outside world. You expose only what is necessary through a public interface. This protects your data and makes your code more secure and easier to maintain.',
      } as Action,
      {
        id: 'feedback-encapsulation',
        type: 'feedback',
        message: '🔒 Encapsulation: Hide implementation, expose interface',
        type_: 'info',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 5: INHERITANCE ====================
  {
    id: 'master-scene-5-inheritance',
    actions: [
      {
        id: 'laser-inheritance',
        type: 'laser',
        elementId: 'demo-element-2',
        color: '#4CAF50',
      },
      { id: 'wb-clear-5', type: 'wb_clear' } as Action,
      // Parent Vehicle box (center top)
      { id: 'wb-vehicle-box', type: 'wb_draw_shape', shape: 'rectangle', x: 185, y: 15, width: 150, height: 40, fillColor: '#6750A4' } as unknown as Action,
      { id: 'wb-vehicle-label', type: 'wb_draw_text', content: 'Vehicle', x: 220, y: 40, fontSize: 14, color: '#FFFFFF' } as unknown as Action,
      // Arrows down to children
      { id: 'wb-arrow-car', type: 'wb_draw_line', startX: 220, startY: 55, endX: 110, endY: 120, color: '#888', points: ['', 'arrow'] } as unknown as Action,
      { id: 'wb-arrow-moto', type: 'wb_draw_line', startX: 260, startY: 55, endX: 260, endY: 120, color: '#888', points: ['', 'arrow'] } as unknown as Action,
      { id: 'wb-arrow-truck', type: 'wb_draw_line', startX: 300, startY: 55, endX: 420, endY: 120, color: '#888', points: ['', 'arrow'] } as unknown as Action,
      // extends labels
      { id: 'wb-extends1', type: 'wb_draw_text', content: 'extends', x: 48, y: 95, fontSize: 10, color: '#888' } as unknown as Action,
      { id: 'wb-extends2', type: 'wb_draw_text', content: 'extends', x: 228, y: 95, fontSize: 10, color: '#888' } as unknown as Action,
      { id: 'wb-extends3', type: 'wb_draw_text', content: 'extends', x: 380, y: 95, fontSize: 10, color: '#888' } as unknown as Action,
      // Child class boxes
      { id: 'wb-car-child', type: 'wb_draw_shape', shape: 'rectangle', x: 40, y: 120, width: 130, height: 40, fillColor: '#4CAF50' } as unknown as Action,
      { id: 'wb-car-child-label', type: 'wb_draw_text', content: 'Car', x: 88, y: 144, fontSize: 14, color: '#FFFFFF' } as unknown as Action,
      { id: 'wb-moto-child', type: 'wb_draw_shape', shape: 'rectangle', x: 190, y: 120, width: 140, height: 40, fillColor: '#FF9800' } as unknown as Action,
      { id: 'wb-moto-child-label', type: 'wb_draw_text', content: 'Motorcycle', x: 205, y: 144, fontSize: 13, color: '#FFFFFF' } as unknown as Action,
      { id: 'wb-truck-child', type: 'wb_draw_shape', shape: 'rectangle', x: 350, y: 120, width: 130, height: 40, fillColor: '#2196F3' } as unknown as Action,
      { id: 'wb-truck-child-label', type: 'wb_draw_text', content: 'Truck', x: 393, y: 144, fontSize: 14, color: '#FFFFFF' } as unknown as Action,
      {
        id: 'speech-inheritance',
        type: 'speech',
        text: 'The second principle is Inheritance. This allows you to create a new class based on an existing class, inheriting all its properties and methods. For example, you might have a Vehicle class, and then create Car, Motorcycle, and Truck classes that inherit from Vehicle. This promotes code reuse and establishes a hierarchy.',
      } as Action,
      {
        id: 'feedback-inheritance',
        type: 'feedback',
        message: '🌳 Inheritance: Child classes inherit from parent classes',
        type_: 'info',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 6: POLYMORPHISM ====================
  {
    id: 'master-scene-6-polymorphism',
    actions: [
      {
        id: 'spotlight-poly',
        type: 'spotlight',
        elementId: 'demo-element',
        dimOpacity: 0.5,
      },
      {
        id: 'speech-polymorphism',
        type: 'speech',
        text: 'The third principle is Polymorphism, meaning many forms. This allows objects of different classes to be used interchangeably. For instance, both Car and Motorcycle can have a start method, but they might start differently. The same interface name refers to different underlying implementations based on the object type.',
      } as Action,
      {
        id: 'feedback-polymorphism',
        type: 'feedback',
        message: '🎭 Polymorphism: One interface, many implementations',
        type_: 'info',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 7: PRACTICAL CODE EXAMPLE ====================
  {
    id: 'master-scene-7-code',
    actions: [
      {
        id: 'laser-code',
        type: 'laser',
        elementId: 'demo-element-2',
        color: '#FF9800',
      },
      {
        id: 'speech-code',
        type: 'speech',
        text: 'Here is a practical code example. We define a class Animal with a method speak. Then we create a Dog class that inherits from Animal and overrides the speak method to bark. When we call speak on a Dog, it outputs bark, demonstrating polymorphism in action.',
      } as Action,
      {
        id: 'feedback-code',
        type: 'feedback',
        message: '💻 Code demonstrates inheritance and polymorphism together',
        type_: 'success',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 8: BENEFITS SUMMARY ====================
  {
    id: 'master-scene-8-benefits',
    actions: [
      {
        id: 'spotlight-benefits',
        type: 'spotlight',
        elementId: 'demo-element',
        dimOpacity: 0.6,
      },
      {
        id: 'speech-benefits',
        type: 'speech',
        text: 'Object-Oriented Programming provides numerous benefits. Your code becomes more modular and reusable. Large projects become easier to manage and maintain. The clear structure helps teams collaborate effectively. Real-world concepts map directly to code, making your programs more intuitive to understand.',
      } as Action,
      {
        id: 'feedback-benefits',
        type: 'feedback',
        message: '✨ Benefits: Modularity, reusability, maintainability, scalability',
        type_: 'success',
        duration: 4000,
      } as Action,
    ],
  },

  // ==================== SCENE 9: COMPREHENSION CHECK ====================
  {
    id: 'master-scene-9-checkpoint-1',
    actions: [
      {
        id: 'speech-check-1',
        type: 'speech',
        text: 'Now let us check your understanding of the fundamental concepts.',
      } as Action,
      {
        id: 'checkpoint-1',
        type: 'checkpoint',
        checkpointId: 'oop-fundamentals',
        prompt: 'What is the primary benefit of encapsulation in OOP?',
        options: [
          'Increases code execution speed',
          'Hides implementation details and protects data',
          'Makes classes inherit from multiple parents',
          'Automatically creates new instances',
        ],
        expectedAnswer: 1,
        conceptId: 'cs_encapsulation',
        hint: 'Think about what should be visible to the outside world.',
        explanation: 'Encapsulation keeps internal state protected and exposes a small public interface, so other code can use the object without depending on its private details.',
      } as Action,
      {
        id: 'feedback-check-1-success',
        type: 'feedback',
        message: '✅ Correct! Encapsulation protects internal data while exposing a clean interface.',
        type_: 'success',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 10: INHERITANCE UNDERSTANDING ====================
  {
    id: 'master-scene-10-checkpoint-2',
    actions: [
      {
        id: 'laser-check-2',
        type: 'laser',
        elementId: 'demo-element-2',
        color: '#2196F3',
      },
      {
        id: 'speech-check-2',
        type: 'speech',
        text: 'Now let us test your understanding of inheritance.',
      } as Action,
      {
        id: 'checkpoint-2',
        type: 'checkpoint',
        checkpointId: 'oop-inheritance',
        prompt: 'If you have a Parent class and a Child class that inherits from Parent, which of these is true?',
        options: [
          'The Child class must redefine all Parent methods',
          'The Child class automatically inherits all Parent properties and methods',
          'The Parent class must inherit from the Child class',
          'Inheritance requires multiple classes to be exactly identical',
        ],
        expectedAnswer: 1,
        conceptId: 'cs_inheritance',
        hint: 'The child starts with what the parent already knows how to do.',
        explanation: 'A child class automatically receives the parent class properties and methods, then it can add new behavior or override behavior where needed.',
      } as Action,
      {
        id: 'feedback-check-2-success',
        type: 'feedback',
        message: '🎉 Excellent! Child classes inherit and can extend Parent functionality.',
        type_: 'success',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 11: POLYMORPHISM UNDERSTANDING ====================
  {
    id: 'master-scene-11-checkpoint-3',
    actions: [
      {
        id: 'spotlight-check-3',
        type: 'spotlight',
        elementId: 'demo-element',
        dimOpacity: 0.5,
      },
      {
        id: 'speech-check-3',
        type: 'speech',
        text: 'Finally, let us verify your understanding of polymorphism.',
      } as Action,
      {
        id: 'checkpoint-3',
        type: 'checkpoint',
        checkpointId: 'oop-polymorphism',
        prompt: 'What does polymorphism mean in Object-Oriented Programming?',
        options: [
          'Creating many different programming languages',
          'The ability of objects to take many forms and respond differently to the same method call',
          'Breaking code into smaller files',
          'Using only one data type throughout the program',
        ],
        expectedAnswer: 1,
        conceptId: 'cs_polymorphism',
        hint: 'Focus on the same method name producing different behavior.',
        explanation: 'Polymorphism lets different object types respond to the same interface in their own way, which keeps code flexible and extensible.',
      } as Action,
      {
        id: 'feedback-check-3-success',
        type: 'feedback',
        message: '🏆 Perfect! Polymorphism allows flexible and extensible code design.',
        type_: 'success',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 12: REAL-WORLD APPLICATION ====================
  {
    id: 'master-scene-12-application',
    actions: [
      {
        id: 'laser-application',
        type: 'laser',
        elementId: 'demo-element-2',
        color: '#9C27B0',
      },
      {
        id: 'speech-application',
        type: 'speech',
        text: 'OOP is used everywhere in modern software development. Web frameworks like React and Angular use OOP principles. Mobile apps on iOS and Android are built with object-oriented languages. Large-scale systems like Google, Facebook, and Netflix rely heavily on OOP architecture.',
      } as Action,
      {
        id: 'feedback-application',
        type: 'feedback',
        message: '🌍 OOP powers the most important software systems in the world',
        type_: 'info',
        duration: 3000,
      } as Action,
    ],
  },

  // ==================== SCENE 13: MASTERY CONFIRMATION ====================
  {
    id: 'master-scene-13-mastery',
    actions: [
      {
        id: 'spotlight-mastery',
        type: 'spotlight',
        elementId: 'demo-element',
        dimOpacity: 0.4,
      },
      {
        id: 'speech-mastery',
        type: 'speech',
        text: 'Congratulations! You have successfully completed a comprehensive learning experience on Object-Oriented Programming. You now understand the core principles of encapsulation, inheritance, and polymorphism. You can apply these concepts to design scalable, maintainable, and professional software systems.',
      } as Action,
      {
        id: 'feedback-mastery',
        type: 'feedback',
        message: '🎓 You have mastered Object-Oriented Programming fundamentals!',
        type_: 'success',
        duration: 5000,
      } as Action,
    ],
  },

  // ==================== SCENE 14: NEXT STEPS ====================
  {
    id: 'master-scene-14-next',
    actions: [
      {
        id: 'laser-next',
        type: 'laser',
        elementId: 'demo-element-2',
        color: '#00BCD4',
      },
      {
        id: 'speech-next',
        type: 'speech',
        text: 'Your next steps: Implement these concepts in real projects. Build a class hierarchy for a game, web application, or system. Practice writing encapsulated, reusable code. Study design patterns that build upon OOP principles like Model-View-Controller, Factory, and Observer patterns.',
      } as Action,
      {
        id: 'feedback-next',
        type: 'feedback',
        message: '🚀 Ready to build amazing software with OOP!',
        type_: 'hint',
        duration: 4000,
      } as Action,
    ],
  },
];

// Curriculum mapping for master demo
export const masterDemoCurriculum = {
  scenarioId: 'master-demo' as const,
  title: 'Object-Oriented Programming: Complete Mastery',
  description: 'A comprehensive journey through OOP principles with real-world examples, interactive checkpoints, and practical applications. Features all Timeline Demo capabilities.',
  conceptIds: ['cs_oop_fundamentals', 'cs_encapsulation', 'cs_inheritance', 'cs_polymorphism'],
  subject: 'CS' as const,
  difficulty: 'intermediate' as const,
  estimatedDuration: 1200, // 20 minutes
  tags: ['OOP', 'programming', 'design-patterns', 'advanced', 'interactive'],
};
