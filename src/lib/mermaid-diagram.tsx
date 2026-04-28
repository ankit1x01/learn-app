import React, { useEffect, useState, useRef, memo } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  code: string;
  id: string;
}

const m3Colors = {
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  onSurfaceVariant: '#49454E',
  outline: '#79747E',
  error: '#B3261E',
  success: '#146C2E',
};

const MermaidDiagramRaw: React.FC<MermaidDiagramProps> = ({ code, id }) => {
  const [svg, setSvg] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code) return;

    setLoading(true);
    setError(null);

    mermaid
      .render(id, code)
      .then(({ svg }) => {
        setSvg(svg);
        setZoom(1);
      })
      .catch((err) => {
        console.error('Mermaid error:', err);
        setError(
          typeof err === 'object' && err?.message
            ? err.message
            : 'Invalid diagram syntax. Check Mermaid documentation.'
        );
      })
      .finally(() => setLoading(false));
  }, [code, id]);

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    let newZoom = zoom;
    if (direction === 'in') newZoom = Math.min(zoom + 0.2, 3);
    else if (direction === 'out') newZoom = Math.max(zoom - 0.2, 0.5);
    else newZoom = 1;
    setZoom(newZoom);
  };

  const handleDownload = () => {
    const svgElement = svgRef.current?.querySelector('svg');
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `diagram-${Date.now()}.png`;
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleCopySvg = async () => {
    try {
      const svgElement = svgRef.current?.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      await navigator.clipboard.writeText(svgData);

      // Show feedback
      const btn = event?.target as HTMLElement;
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-rounded">check</span>';
        setTimeout(() => {
          btn.innerHTML = original;
        }, 2000);
      }
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const DiagramContent = () => (
    <div
      ref={svgRef}
      className="flex justify-center items-center"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: 'center',
        transition: 'transform 200ms ease-out',
      }}
    >
      {svg ? (
        <div
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        />
      ) : null}
    </div>
  );

  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 bg-[var(--color-background)] p-4"
        style={{ backgroundColor: m3Colors.background }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--color-on-background)]">Diagram</h3>
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-container)] transition-colors"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => handleZoom('out')}
            className="px-3 py-2 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-rounded">zoom_out</span>
            Zoom Out
          </button>
          <button
            onClick={() => handleZoom('reset')}
            className="px-3 py-2 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-rounded">zoom_in</span>
            Reset
          </button>
          <button
            onClick={() => handleZoom('in')}
            className="px-3 py-2 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-rounded">add</span>
            Zoom In
          </button>
          <button
            onClick={handleDownload}
            className="px-3 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            <span className="material-symbols-rounded">download</span>
            Download
          </button>
          <button
            onClick={handleCopySvg}
            className="px-3 py-2 rounded-lg bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)] transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-rounded">content_copy</span>
            Copy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div
                className="animate-spin"
                style={{
                  width: '40px',
                  height: '40px',
                  border: `4px solid ${m3Colors.outline}`,
                  borderTopColor: m3Colors.primary,
                  borderRadius: '50%',
                }}
              />
              <p style={{ color: m3Colors.onSurfaceVariant }}>Rendering diagram...</p>
            </div>
          ) : error ? (
            <div style={{ padding: '20px', color: m3Colors.error }}>
              <p className="font-bold mb-2">Error rendering diagram:</p>
              <pre className="text-xs overflow-auto">{error}</pre>
            </div>
          ) : (
            <DiagramContent />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mb-4 rounded-none overflow-hidden relative"
      style={{
        border: `3px solid ${m3Colors.onBackground}`,
        boxShadow: `4px 4px 0px ${m3Colors.onBackground}`,
        backgroundColor: m3Colors.background,
      }}
    >
      {/* Controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2 bg-white rounded-lg p-1 shadow-lg">
        <button
          onClick={() => handleZoom('out')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom out"
        >
          <span className="material-symbols-rounded text-base">zoom_out</span>
        </button>
        <div className="text-xs flex items-center px-2 text-gray-600 font-medium">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={() => handleZoom('in')}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Zoom in"
        >
          <span className="material-symbols-rounded text-base">zoom_in</span>
        </button>
        <div className="w-px bg-gray-300" />
        <button
          onClick={handleDownload}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Download as PNG"
        >
          <span className="material-symbols-rounded text-base">download</span>
        </button>
        <button
          onClick={handleCopySvg}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Copy SVG"
        >
          <span className="material-symbols-rounded text-base">content_copy</span>
        </button>
        <button
          onClick={() => setIsFullscreen(true)}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Full screen"
        >
          <span className="material-symbols-rounded text-base">fullscreen</span>
        </button>
      </div>

      {/* Content */}
      <div
        className="p-4 min-h-[200px] flex justify-center items-center overflow-auto"
        style={{
          backgroundColor: m3Colors.background,
        }}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div
              className="animate-spin"
              style={{
                width: '30px',
                height: '30px',
                border: `3px solid ${m3Colors.outline}`,
                borderTopColor: m3Colors.primary,
                borderRadius: '50%',
              }}
            />
            <span className="text-sm" style={{ color: m3Colors.onSurfaceVariant }}>
              Rendering diagram...
            </span>
          </div>
        ) : error ? (
          <div style={{ padding: '20px', color: m3Colors.error, maxWidth: '100%' }}>
            <p className="font-bold mb-2">❌ Error rendering diagram</p>
            <pre className="text-xs overflow-auto bg-[var(--color-surface-container)] p-2 rounded">
              {error}
            </pre>
          </div>
        ) : (
          <DiagramContent />
        )}
      </div>
    </div>
  );
};

export const MermaidDiagram = memo(MermaidDiagramRaw);
MermaidDiagram.displayName = 'MermaidDiagram';
