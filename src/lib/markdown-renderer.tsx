import React, { useEffect, useState, useCallback, memo } from 'react';
import ReactMarkdown, { Options } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypePrism from 'rehype-prism-plus';
import mermaid from 'mermaid';
import { MermaidDiagram } from './mermaid-diagram';
import 'prism-themes/themes/prism-one-dark.css';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

const readingFont = '"Source Serif 4", Georgia, serif';
const uiFont = '"Roboto", system-ui, sans-serif';

const m3 = {
  primary:                '#6750A4',
  secondary:              '#625B71',
  background:             '#FFFBFE',
  surfaceContainer:       '#F3EDF7',
  surfaceContainerHigh:   '#ECE6F0',
  surfaceContainerLowest: '#FFFFFF',
  onBackground:           '#1C1B1F',
  onSurfaceVariant:       '#49454E',
  outline:                '#79747E',
  outlineVariant:         '#CAC4D0',
  primaryContainer:       '#EADDFF',
  error:                  '#B3261E',
  success:                '#146C2E',
};

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Roboto, system-ui, sans-serif',
});

const extractText = (children: React.ReactNode): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (
    React.isValidElement(children) &&
    typeof children.props === 'object' &&
    children.props !== null &&
    'children' in children.props
  ) return extractText((children.props as { children?: React.ReactNode }).children);
  return '';
};

// ── Code ──────────────────────────────────────────────────────────────

interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const CodeBlockRaw: React.FC<CodeBlockProps> = ({ inline, className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const codeContent = extractText(children).replace(/\n$/, '');
  const match = /language-(\w+)/.exec(className || '');
  const lang = match?.[1];
  const isMermaid = lang === 'mermaid';
  const mermaidId = React.useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`).current;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [codeContent]);

  const languageLabel: Record<string, string> = {
    python: 'Python', js: 'JavaScript', javascript: 'JavaScript',
    ts: 'TypeScript', typescript: 'TypeScript', jsx: 'JSX', tsx: 'TSX',
    java: 'Java', cpp: 'C++', c: 'C', csharp: 'C#', go: 'Go', rust: 'Rust',
    ruby: 'Ruby', php: 'PHP', bash: 'Bash', shell: 'Shell', sql: 'SQL',
    html: 'HTML', css: 'CSS', json: 'JSON', yaml: 'YAML', xml: 'XML',
  };

  const displayLang = lang ? languageLabel[lang] || lang.toUpperCase() : '';

  if (inline) {
    return (
      <code
        style={{
          fontFamily: '"Fira Code", "Courier New", monospace',
          fontSize: '0.875em',
          fontWeight: 500,
          backgroundColor: m3.primaryContainer,
          color: m3.primary,
          padding: '0.15em 0.45em',
          borderRadius: '4px',
        }}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div
      className="my-5 overflow-hidden"
      style={{
        borderRadius: '8px',
        border: `1.5px solid ${m3.outlineVariant}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        backgroundColor: isMermaid ? m3.background : '#1e293b',
      }}
    >
      {!isMermaid && (
        <div
          className="px-4 py-2 text-xs font-medium flex justify-between items-center"
          style={{
            fontFamily: uiFont,
            backgroundColor: '#0f172a',
            color: '#94a3b8',
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
          }}
        >
          <span style={{ letterSpacing: '0.3px' }}>{displayLang}</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded transition-all active:scale-95"
            style={{
              backgroundColor: copied ? m3.success : 'rgba(255,255,255,0.08)',
              color: copied ? '#fff' : '#94a3b8',
              border: `1px solid rgba(255,255,255,0.1)`,
              fontSize: '0.75rem',
            }}
          >
            <span className="material-symbols-rounded" style={{ fontSize: '14px' }}>
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      {isMermaid ? (
        <MermaidDiagram code={codeContent} id={mermaidId} />
      ) : (
        <pre
          className={className}
          style={{
            color: '#e5e7eb',
            padding: '1.1rem 1.25rem',
            overflowX: 'auto',
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: '0.875rem',
            lineHeight: 1.65,
            margin: 0,
          }}
          {...props}
        >
          {children}
        </pre>
      )}
    </div>
  );
};

const CodeBlock = memo(CodeBlockRaw);
CodeBlock.displayName = 'MarkdownCodeBlock';

// ── Headings ──────────────────────────────────────────────────────────

const MarkdownH1 = memo((props: React.ComponentProps<'h1'>) => (
  <h1
    className="font-bold mb-5 mt-10 pb-3"
    style={{
      fontFamily: uiFont,
      fontSize: '1.6rem',
      color: m3.onBackground,
      borderBottom: `2px solid ${m3.primary}`,
      letterSpacing: '-0.3px',
      lineHeight: 1.25,
    }}
    {...props}
  />
));
MarkdownH1.displayName = 'MarkdownH1';

const MarkdownH2 = memo((props: React.ComponentProps<'h2'>) => (
  <h2
    className="font-bold mb-3 mt-8 pb-2"
    style={{
      fontFamily: uiFont,
      fontSize: '1.25rem',
      color: m3.onBackground,
      borderBottom: `1px solid ${m3.outlineVariant}`,
      letterSpacing: '-0.1px',
      lineHeight: 1.35,
    }}
    {...props}
  />
));
MarkdownH2.displayName = 'MarkdownH2';

const MarkdownH3 = memo((props: React.ComponentProps<'h3'>) => (
  <h3
    className="font-semibold mb-2 mt-6"
    style={{
      fontFamily: uiFont,
      fontSize: '1.05rem',
      color: m3.onBackground,
      lineHeight: 1.4,
    }}
    {...props}
  />
));
MarkdownH3.displayName = 'MarkdownH3';

const MarkdownH4 = memo((props: React.ComponentProps<'h4'>) => (
  <h4
    className="font-semibold mb-2 mt-4"
    style={{
      fontFamily: uiFont,
      fontSize: '0.9375rem',
      color: m3.secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}
    {...props}
  />
));
MarkdownH4.displayName = 'MarkdownH4';

// ── Body text ─────────────────────────────────────────────────────────

const MarkdownP = memo((props: React.ComponentProps<'p'>) => (
  <p
    className="mb-5"
    style={{
      fontFamily: readingFont,
      fontWeight: 400,
      fontSize: '1.0625rem',
      color: m3.onBackground,
      lineHeight: 1.85,
    }}
    {...props}
  />
));
MarkdownP.displayName = 'MarkdownP';

const MarkdownStrong = memo((props: React.ComponentProps<'strong'>) => (
  <strong
    style={{
      fontFamily: readingFont,
      fontWeight: 700,
      color: m3.onBackground,
    }}
    {...props}
  />
));
MarkdownStrong.displayName = 'MarkdownStrong';

const MarkdownEm = memo((props: React.ComponentProps<'em'>) => (
  <em
    style={{
      fontFamily: readingFont,
      fontStyle: 'italic',
      fontWeight: 400,
      color: m3.onSurfaceVariant,
    }}
    {...props}
  />
));
MarkdownEm.displayName = 'MarkdownEm';

const MarkdownA = memo((props: React.ComponentProps<'a'>) => (
  <a
    style={{
      fontFamily: readingFont,
      fontWeight: 400,
      color: m3.primary,
      textDecoration: 'underline',
      textDecorationColor: `${m3.primary}60`,
      textUnderlineOffset: '3px',
      transition: 'text-decoration-color 0.15s',
    }}
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
));
MarkdownA.displayName = 'MarkdownA';

// ── Lists ─────────────────────────────────────────────────────────────

const MarkdownUl = memo((props: React.ComponentProps<'ul'>) => (
  <ul
    className="mb-5 pl-5 space-y-1.5"
    style={{ listStyleType: 'disc', color: m3.primary }}
    {...props}
  />
));
MarkdownUl.displayName = 'MarkdownUl';

const MarkdownOl = memo((props: React.ComponentProps<'ol'>) => (
  <ol
    className="mb-5 pl-5 space-y-1.5 list-decimal"
    style={{ color: m3.secondary }}
    {...props}
  />
));
MarkdownOl.displayName = 'MarkdownOl';

const MarkdownLi = memo((props: React.ComponentProps<'li'>) => (
  <li
    style={{
      fontFamily: readingFont,
      fontWeight: 400,
      fontSize: '1.0625rem',
      color: m3.onBackground,
      lineHeight: 1.75,
    }}
    {...props}
  />
));
MarkdownLi.displayName = 'MarkdownLi';

// ── Blockquote ────────────────────────────────────────────────────────

const MarkdownBlockquote = memo((props: React.ComponentProps<'blockquote'>) => (
  <blockquote
    className="pl-5 pr-4 py-3 my-5"
    style={{
      borderLeft: `3px solid ${m3.primary}`,
      backgroundColor: m3.surfaceContainer,
      borderRadius: '0 6px 6px 0',
      fontFamily: readingFont,
      fontStyle: 'italic',
      fontWeight: 400,
      fontSize: '1.0625rem',
      color: m3.onSurfaceVariant,
      lineHeight: 1.8,
    }}
    {...props}
  />
));
MarkdownBlockquote.displayName = 'MarkdownBlockquote';

// ── Media & dividers ──────────────────────────────────────────────────

const MarkdownImg = memo((props: React.ComponentProps<'img'>) => (
  <img
    className="max-w-full h-auto my-6 mx-auto block"
    style={{
      borderRadius: '8px',
      border: `1px solid ${m3.outlineVariant}`,
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    }}
    loading="lazy"
    {...props}
  />
));
MarkdownImg.displayName = 'MarkdownImg';

const MarkdownHr = memo((props: React.ComponentProps<'hr'>) => (
  <hr
    className="my-8 border-none"
    style={{
      height: '1px',
      backgroundColor: m3.outlineVariant,
    }}
    {...props}
  />
));
MarkdownHr.displayName = 'MarkdownHr';

// ── Tables ────────────────────────────────────────────────────────────

const MarkdownTable = memo(({ children, ...props }: React.ComponentProps<'table'>) => (
  <div
    className="w-full overflow-auto my-5"
    style={{
      borderRadius: '8px',
      border: `1px solid ${m3.outlineVariant}`,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}
  >
    <table className="w-full border-collapse" {...props}>
      {children}
    </table>
  </div>
));
MarkdownTable.displayName = 'MarkdownTable';

interface TableRowProps extends React.ComponentProps<'tr'> {
  rowIndex?: number;
}

const MarkdownTr = memo(({ rowIndex = 0, ...props }: TableRowProps) => (
  <tr
    style={{ backgroundColor: rowIndex % 2 === 0 ? m3.background : m3.surfaceContainer }}
    data-row-index={rowIndex}
    {...props}
  />
));
MarkdownTr.displayName = 'MarkdownTr';

const MarkdownTh = memo((props: React.ComponentProps<'th'>) => (
  <th
    className="px-4 py-2.5 text-left font-semibold text-sm"
    style={{
      fontFamily: uiFont,
      backgroundColor: m3.surfaceContainerHigh,
      color: m3.onBackground,
      borderBottom: `2px solid ${m3.outlineVariant}`,
      letterSpacing: '0.1px',
    }}
    {...props}
  />
));
MarkdownTh.displayName = 'MarkdownTh';

const MarkdownTd = memo(({ rowIndex = 0, ...props }: React.ComponentProps<'td'> & { rowIndex?: number }) => (
  <td
    className="px-4 py-2.5"
    style={{
      fontFamily: readingFont,
      fontSize: '0.9375rem',
      backgroundColor: rowIndex % 2 === 0 ? m3.background : m3.surfaceContainer,
      color: m3.onBackground,
      borderBottom: `1px solid ${m3.outlineVariant}`,
    }}
    {...props}
  />
));
MarkdownTd.displayName = 'MarkdownTd';

// ── Renderer ──────────────────────────────────────────────────────────

const components: Options['components'] = {
  h1: MarkdownH1, h2: MarkdownH2, h3: MarkdownH3, h4: MarkdownH4,
  p: MarkdownP, strong: MarkdownStrong, em: MarkdownEm, a: MarkdownA,
  ul: MarkdownUl, ol: MarkdownOl, li: MarkdownLi,
  code: CodeBlock, blockquote: MarkdownBlockquote,
  img: MarkdownImg, hr: MarkdownHr,
  table: MarkdownTable, th: MarkdownTh, td: MarkdownTd, tr: MarkdownTr,
};

const MarkdownRendererFunction: React.FC<MarkdownRendererProps> = ({ markdown, className }) => (
  <div className={`max-w-[72ch] ${className || ''}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypePrism]}
      components={components}
    >
      {markdown}
    </ReactMarkdown>
  </div>
);

const MarkdownRenderer = memo(MarkdownRendererFunction);
MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
