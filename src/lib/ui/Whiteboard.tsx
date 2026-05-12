import React, { forwardRef, useRef, useEffect, useState, useImperativeHandle } from 'react';

export interface WhiteboardProps {
  width?: number;
  height?: number;
  onClear?: () => void;
  backgroundColor?: string;
}

export interface WhiteboardHandle {
  drawText(text: string, x: number, y: number, color?: string, fontSize?: number): void;
  drawRect(x: number, y: number, w: number, h: number, color?: string, filled?: boolean): void;
  drawCircle(cx: number, cy: number, r: number, color?: string, filled?: boolean): void;
  drawLine(x1: number, y1: number, x2: number, y2: number, color?: string, width?: number): void;
  drawArrow(x1: number, y1: number, x2: number, y2: number, color?: string): void;
  clear(): void;
}

interface DrawingState { isDrawing: boolean; startX: number; startY: number; }
type DrawTool = 'pen' | 'line' | 'rect' | 'circle' | 'text';

export const Whiteboard = forwardRef<WhiteboardHandle, WhiteboardProps>(function Whiteboard(
  { width = 800, height = 400, onClear, backgroundColor = '#FFFFFF' },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState<DrawingState>({ isDrawing: false, startX: 0, startY: 0 });
  const [tool, setTool] = useState<DrawTool>('pen');
  const [color, setColor] = useState('#1a1a2e');
  const [lineWidth, setLineWidth] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }, [width, height, backgroundColor]);

  // Programmatic drawing API exposed to parent via ref
  useImperativeHandle(ref, () => ({
    drawText(text, x, y, clr = '#1a1a2e', fontSize = 16) {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.font = `${fontSize}px 'Plus Jakarta Sans', system-ui, sans-serif`;
      ctx.fillStyle = clr;
      ctx.fillText(text, x, y);
    },
    drawRect(x, y, w, h, clr = '#6750A4', filled = false) {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = clr;
      ctx.fillStyle = clr + '22';
      ctx.lineWidth = 2;
      if (filled) { ctx.fillStyle = clr; ctx.fillRect(x, y, w, h); }
      else { ctx.fillRect(x, y, w, h); ctx.strokeRect(x, y, w, h); }
    },
    drawCircle(cx, cy, r, clr = '#6750A4', filled = false) {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, 2 * Math.PI);
      if (filled) { ctx.fillStyle = clr; ctx.fill(); }
      else { ctx.strokeStyle = clr; ctx.lineWidth = 2; ctx.stroke(); }
    },
    drawLine(x1, y1, x2, y2, clr = '#1a1a2e', w = 2) {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = clr;
      ctx.lineWidth = w;
      ctx.stroke();
    },
    drawArrow(x1, y1, x2, y2, clr = '#1a1a2e') {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = clr;
      ctx.lineWidth = 2;
      ctx.stroke();
      // Arrowhead
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 12 * Math.cos(angle - 0.4), y2 - 12 * Math.sin(angle - 0.4));
      ctx.lineTo(x2 - 12 * Math.cos(angle + 0.4), y2 - 12 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fillStyle = clr;
      ctx.fill();
    },
    clear() {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      onClear?.();
    },
  }));

  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = getPos(e);
    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) { ctx.font = `${lineWidth * 6 + 10}px system-ui`; ctx.fillStyle = color; ctx.fillText(text, x, y); }
      }
      return;
    }
    setDrawing({ isDrawing: true, startX: x, startY: y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drawing.isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    if (tool === 'pen') {
      ctx.beginPath();
      ctx.moveTo(drawing.startX, drawing.startY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      setDrawing({ ...drawing, startX: x, startY: y });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!drawing.isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.fillStyle = color + '22';
    if (tool === 'line') {
      ctx.beginPath(); ctx.moveTo(drawing.startX, drawing.startY); ctx.lineTo(x, y); ctx.stroke();
    } else if (tool === 'rect') {
      ctx.fillRect(drawing.startX, drawing.startY, x - drawing.startX, y - drawing.startY);
      ctx.strokeRect(drawing.startX, drawing.startY, x - drawing.startX, y - drawing.startY);
    } else if (tool === 'circle') {
      const r = Math.sqrt((x - drawing.startX) ** 2 + (y - drawing.startY) ** 2);
      ctx.beginPath(); ctx.arc(drawing.startX, drawing.startY, r, 0, 2 * Math.PI); ctx.stroke();
    }
    setDrawing({ isDrawing: false, startX: 0, startY: 0 });
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) { ctx.fillStyle = backgroundColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    onClear?.();
  };

  const TOOLS: DrawTool[] = ['pen', 'line', 'rect', 'circle', 'text'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '6px', padding: '10px 12px', background: '#F3F0FF', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {TOOLS.map(t => (
            <button key={t} onClick={() => setTool(t)} style={{
              padding: '5px 10px', fontSize: '11px', fontWeight: '600', border: 'none', borderRadius: '6px', cursor: 'pointer',
              background: tool === t ? '#6750A4' : '#E8E0F7', color: tool === t ? 'white' : '#6750A4',
            }}>
              {t === 'pen' ? '✏️' : t === 'line' ? '📏' : t === 'rect' ? '▭' : t === 'circle' ? '○' : 'T'} {t}
            </button>
          ))}
        </div>
        <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: 28, height: 28, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
        <input type="range" min={1} max={8} value={lineWidth} onChange={e => setLineWidth(+e.target.value)} style={{ width: 56 }} />
        <button onClick={handleClear} style={{ padding: '5px 10px', fontSize: '11px', background: '#F44336', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: '600' }}>
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={e => drawing.isDrawing && handleMouseUp(e)}
        style={{ border: '1px solid #E8E0F7', borderRadius: 8, cursor: tool === 'text' ? 'text' : 'crosshair', display: 'block', background: backgroundColor }}
      />
    </div>
  );
});
