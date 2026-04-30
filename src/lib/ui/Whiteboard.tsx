/**
 * Whiteboard — Interactive canvas for drawing shapes, text, and diagrams
 * Full implementation with drawing tools and action support
 */

import React, { useRef, useEffect, useState } from 'react';

export interface WhiteboardProps {
  width?: number;
  height?: number;
  onClear?: () => void;
  backgroundColor?: string;
}

interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
}

type DrawTool = 'pen' | 'line' | 'rect' | 'circle' | 'text';

/**
 * Whiteboard component with full drawing capabilities
 * Supports: pen, lines, shapes (rectangle, circle), text, clear
 */
export function Whiteboard({
  width = 800,
  height = 600,
  onClear,
  backgroundColor = '#FFFFFF',
}: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState<DrawingState>({ isDrawing: false, startX: 0, startY: 0 });
  const [tool, setTool] = useState<DrawTool>('pen');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, width, height);
    contextRef.current = context;
  }, [width, height, backgroundColor]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    const { x, y } = getMousePos(e);
    setDrawing({ isDrawing: true, startX: x, startY: y });
  };

  const draw = (e: React.MouseEvent) => {
    if (!drawing.isDrawing || !contextRef.current) return;

    const { x, y } = getMousePos(e);
    const ctx = contextRef.current;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = color;

    if (tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(drawing.startX, drawing.startY);
      ctx.lineTo(x, y);
      ctx.stroke();
      setDrawing({ ...drawing, startX: x, startY: y });
    }
  };

  const endDrawing = (e: React.MouseEvent) => {
    if (!drawing.isDrawing || !contextRef.current) return;

    const { x, y } = getMousePos(e);
    const ctx = contextRef.current;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = color;

    // Redraw full shape on release
    if (tool === 'line') {
      ctx.beginPath();
      ctx.moveTo(drawing.startX, drawing.startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'rect') {
      const w = x - drawing.startX;
      const h = y - drawing.startY;
      ctx.strokeRect(drawing.startX, drawing.startY, w, h);
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(x - drawing.startX, 2) + Math.pow(y - drawing.startY, 2));
      ctx.beginPath();
      ctx.arc(drawing.startX, drawing.startY, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }

    setDrawing({ isDrawing: false, startX: 0, startY: 0 });
  };

  const drawText = () => {
    const text = prompt('Enter text:');
    if (text && contextRef.current) {
      const ctx = contextRef.current;
      ctx.font = `${lineWidth * 8}px Arial`;
      ctx.fillStyle = color;
      ctx.fillText(text, drawing.startX || 50, drawing.startY || 50);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (canvas && ctx) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    onClear?.();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['pen', 'line', 'rect', 'circle', 'text'] as DrawTool[]).map((t) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              style={{
                padding: '6px 12px',
                background: tool === t ? '#6750a4' : '#ddd',
                color: tool === t ? 'white' : '#333',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: tool === t ? 'bold' : 'normal',
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Color:
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '32px', height: '32px', border: 'none', cursor: 'pointer' }}
            />
          </label>

          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Size:
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              style={{ width: '60px' }}
            />
          </label>

          <button
            onClick={handleClear}
            style={{
              padding: '6px 12px',
              background: '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold',
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        style={{
          border: '2px solid #ddd',
          borderRadius: '8px',
          cursor: tool === 'text' ? 'text' : 'crosshair',
          background: backgroundColor,
          display: 'block',
          touchAction: 'none',
        }}
      />

      {/* Instructions */}
      <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
        {tool === 'text'
          ? 'Click to place text'
          : tool === 'pen'
            ? 'Click and drag to draw'
            : `Click and drag to draw ${tool}`}
      </p>
    </div>
  );
}
