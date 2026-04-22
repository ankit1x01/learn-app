import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

// The equation we are setting up: 2x + 2 = 6  (so x = 2)
const INITIAL_X_COUNT_LEFT = 2;
const INITIAL_1_COUNT_LEFT = 2;
const INITIAL_X_COUNT_RIGHT = 0;
const INITIAL_1_COUNT_RIGHT = 6;
const X_WEIGHT = 2; // True hidden weight of x
const CONSTANT_WEIGHT = 1;

export const EquationBalancer: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  // Gamestate
  const [leftX, setLeftX] = useState(INITIAL_X_COUNT_LEFT);
  const [left1, setLeft1] = useState(INITIAL_1_COUNT_LEFT);
  const [rightX, setRightX] = useState(INITIAL_X_COUNT_RIGHT);
  const [right1, setRight1] = useState(INITIAL_1_COUNT_RIGHT);
  const [message, setMessage] = useState("Isolate x to find its value!");
  const [solved, setSolved] = useState(false);

  const bodiesRef = useRef({
    leftX: [] as Matter.Body[],
    left1: [] as Matter.Body[],
    rightX: [] as Matter.Body[],
    right1: [] as Matter.Body[],
  });

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Matter.js Engine & Render
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
        background: '#FFFBFE',
      }
    });
    renderRef.current = render;

    // 2. Create the Fulcrum and Beam (The Scale)
    const platform = Matter.Bodies.rectangle(400, 500, 600, 20, { 
      isStatic: false, 
      friction: 1,
      render: { fillStyle: '#6750A4' } 
    });
    const fulcrum = Matter.Bodies.polygon(400, 550, 3, 40, { 
      isStatic: true,
      render: { fillStyle: '#1D192B' } 
    });

    const pivot = Matter.Constraint.create({
      bodyA: platform,
      pointB: { x: 400, y: 512 },
      stiffness: 1,
      length: 0
    });

    // Invisible walls to keep blocks falling evenly
    const leftWall = Matter.Bodies.rectangle(100, 300, 20, 600, { isStatic: true, render: { visible: false } });
    const rightWall = Matter.Bodies.rectangle(700, 300, 20, 600, { isStatic: true, render: { visible: false } });

    Matter.World.add(engine.world, [platform, fulcrum, pivot, leftWall, rightWall]);

    // 3. Helper to create a block
    const createBlock = (side: 'left' | 'right', type: 'x' | '1', yDrop: number) => {
      const isX = type === 'x';
      const weight = isX ? X_WEIGHT : CONSTANT_WEIGHT;
      const xPos = side === 'left' ? 250 + Math.random() * 50 : 550 + Math.random() * 50;
      
      const block = Matter.Bodies.rectangle(xPos, yDrop, 40, 40, {
        mass: weight,
        friction: 0.8,
        frictionAir: 0.05,
        render: {
          fillStyle: isX ? '#F43F5E' : '#B45309',
          strokeStyle: '#ffffff',
          lineWidth: 2,
        }
      });
      return block;
    };

    // 4. Initialize blocks
    const leftXBodies = Array.from({ length: leftX }).map((_, i) => createBlock('left', 'x', 200 - (i * 50)));
    const left1Bodies = Array.from({ length: left1 }).map((_, i) => createBlock('left', '1', 100 - (i * 50)));
    const rightXBodies = Array.from({ length: rightX }).map((_, i) => createBlock('right', 'x', 200 - (i * 50)));
    const right1Bodies = Array.from({ length: right1 }).map((_, i) => createBlock('right', '1', 100 - (i * 50)));

    bodiesRef.current = {
      leftX: leftXBodies,
      left1: left1Bodies,
      rightX: rightXBodies,
      right1: right1Bodies
    };

    Matter.World.add(engine.world, [...leftXBodies, ...left1Bodies, ...rightXBodies, ...right1Bodies]);

    // 5. Mouse Interaction
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } }
    });
    Matter.World.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // 6. Run Engine
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // Text rendering hook (Matter.js native render doesn't support text easily, so we draw labels natively via canvas post-render)
    Matter.Events.on(render, 'afterRender', function() {
      const ctx = render.context;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 18px Arial';
      ctx.fillStyle = '#FFFFFF';

      [...bodiesRef.current.leftX, ...bodiesRef.current.rightX].forEach(body => {
        if (body.render.visible) ctx.fillText('x', body.position.x, body.position.y);
      });
      [...bodiesRef.current.left1, ...bodiesRef.current.right1].forEach(body => {
        if (body.render.visible) ctx.fillText('1', body.position.x, body.position.y);
      });
    });

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      // Let React handle the canvas node removal
      // render.canvas.remove();
      render.canvas = null as any;
      render.context = null as any;
      render.textures = {};
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performOperation = (action: 'sub_1' | 'sub_x' | 'div_2') => {
    if (solved || !engineRef.current) return;
    const world = engineRef.current.world;
    const bodies = bodiesRef.current;

    // Remove random block from an array and world
    const removeBlock = (arr: Matter.Body[]) => {
      const block = arr.pop();
      if (block) {
        // Drop it into the void rather than insta-delete for smooth viz
        Matter.Body.setStatic(block, true);
        Matter.World.remove(world, block);
      }
    };

    if (action === 'sub_1') {
      if (left1 > 0 && right1 > 0) {
        removeBlock(bodies.left1);
        removeBlock(bodies.right1);
        setLeft1(p => p - 1);
        setRight1(p => p - 1);
        setMessage("Subtracted 1 from both sides.");
      } else {
        setMessage("Invalid operation: Can't subtract 1 from both sides!");
      }
    }

    if (action === 'sub_x') {
      if (leftX > 0 && rightX > 0) {
        removeBlock(bodies.leftX);
        removeBlock(bodies.rightX);
        setLeftX(p => p - 1);
        setRightX(p => p - 1);
        setMessage("Subtracted x from both sides.");
      } else {
        setMessage("Invalid operation: Not enough x's on both sides.");
      }
    }

    if (action === 'div_2') {
      if (leftX % 2 === 0 && left1 % 2 === 0 && rightX % 2 === 0 && right1 % 2 === 0) {
        const dropXLeft = leftX / 2;
        const drop1Left = left1 / 2;
        const dropXRight = rightX / 2;
        const drop1Right = right1 / 2;

        for (let i = 0; i < dropXLeft; i++) removeBlock(bodies.leftX);
        for (let i = 0; i < drop1Left; i++) removeBlock(bodies.left1);
        for (let i = 0; i < drop1Right; i++) removeBlock(bodies.right1);
        // Assuming no right X's for this specific equation, but left for robustness
        for (let i = 0; i < dropXRight; i++) removeBlock(bodies.rightX);

        setLeftX(leftX / 2);
        setLeft1(left1 / 2);
        setRight1(right1 / 2);
        setRightX(rightX / 2);
        setMessage("Divided both sides by 2!");
      } else {
        setMessage("Invalid operation: Can't neatly divide both sides by 2 right now.");
      }
    }
  };

  // Check win condition whenever state updates
  useEffect(() => {
    if (leftX === 1 && left1 === 0 && rightX === 0 && right1 === 2) {
      setSolved(true);
      setMessage("Correct! x = 2");
    }
    // Mirrored solution check
    if (rightX === 1 && right1 === 0 && leftX === 0 && left1 === 2) {
      setSolved(true);
      setMessage("Correct! x = 2");
    }
  }, [leftX, left1, rightX, right1]);

  // Equation text representation
  const renderEq = (x: number, c: number) => {
    if (x === 0 && c === 0) return '0';
    let output = '';
    if (x === 1) output += 'x';
    else if (x > 1) output += `${x}x`;
    
    if (c > 0) {
      if (output.length > 0) output += ` + ${c}`;
      else output += `${c}`;
    }
    return output;
  };

  return (
    <div className="bg-[var(--color-background)] min-h-screen flex flex-col items-center justify-center p-4">
      {/* HUD Board */}
      <div className="bg-[var(--color-surface-container)] rounded-2xl w-full max-w-3xl p-6 mb-6 shadow-sm border border-[var(--color-outline-variant)]">
        <h2 className="text-[22px] font-bold text-[var(--color-on-surface)] mb-2 flex items-center justify-between">
          <span>Equation Balancer</span>
          <span className={`px-4 py-1 rounded-full text-[14px] ${solved ? 'bg-green-500 text-white' : 'bg-[var(--color-primary)] text-white'}`}>
            {solved ? 'SOLVED' : renderEq(leftX, left1) + " = " + renderEq(rightX, right1)}
          </span>
        </h2>
        <p className="text-[var(--color-on-surface-variant)] text-[14px] font-medium">{message}</p>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-3 mt-5">
          <button 
            disabled={solved}
            onClick={() => performOperation('sub_1')}
            className="bg-[var(--color-surface-container-highest)] hover:bg-[var(--color-secondary-container)] px-4 py-2 rounded-xl text-[14px] font-bold disabled:opacity-50 transition-colors border border-[var(--color-outline-variant)]">
            - 1 from both sides
          </button>
          <button 
            disabled={solved}
            onClick={() => performOperation('sub_x')}
            className="bg-[var(--color-surface-container-highest)] hover:bg-[var(--color-secondary-container)] px-4 py-2 rounded-xl text-[14px] font-bold disabled:opacity-50 transition-colors border border-[var(--color-outline-variant)]">
            - x from both sides
          </button>
          <button 
            disabled={solved}
            onClick={() => performOperation('div_2')}
            className="bg-[var(--color-surface-container-highest)] hover:bg-[var(--color-secondary-container)] px-4 py-2 rounded-xl text-[14px] font-bold disabled:opacity-50 transition-colors border border-[var(--color-outline-variant)]">
            ÷ 2 to both sides
          </button>
        </div>
      </div>

      {/* Physics Canvas */}
      <div 
        ref={sceneRef} 
        className="w-full max-w-3xl overflow-hidden rounded-[32px] border-4 border-[var(--color-surface-container-highest)] bg-white relative shadow-lg"
        style={{ height: 600 }}
      >
        {/* Playful prompt shown inside canvas if solved */}
        {solved && (
          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center pointer-events-none">
            <h1 className="text-6xl font-black text-white drop-shadow-lg scale-110 mb-4 animate-bounce">
              x = 2
            </h1>
            <p className="text-xl text-white font-bold bg-black/50 px-4 py-2 rounded-full">
              The physics perfectly balanced!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
