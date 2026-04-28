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

// M3 Expressive Light theme colors from DESIGN_SYSTEM.md
const m3Colors = {
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
  background: '#FFFBFE',
  surface: '#FFFBFE',
  surfaceContainer: '#F3EDF7',
  surfaceContainerHigh: '#ECE6F0',
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454E',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  error: '#B3261E',
  success: '#146C2E',
};

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'Roboto, system-ui, sans-serif',
});

// Helper to extract raw text from complex children
const extractText = (children: React.ReactNode): string => {
  if (typeof children === 'string') {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map(child => extractText(child)).join('');
  }
  if (
    React.isValidElement(children) &&
    typeof children.props === 'object' &&
    children.props !== null &&
    'children' in children.props
  ) {
    return extractText((children.props as { children?: React.ReactNode }).children);
  }
  return '';
};

// Code Block Component
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: unknown;
}

const CodeBlockRaw: React.FC<CodeBlockProps> = ({
  inline,
  className,
  children,
  ...props
}) => {
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
    python: 'Python',
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    jsx: 'JSX',
    tsx: 'TSX',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    csharp: 'C#',
    go: 'Go',
    rust: 'Rust',
    ruby: 'Ruby',
    php: 'PHP',
    bash: 'Bash',
    shell: 'Shell',
    sql: 'SQL',
    html: 'HTML',
    css: 'CSS',
    json: 'JSON',
    yaml: 'YAML',
    xml: 'XML',
  };

  const displayLang = lang ? languageLabel[lang] || lang.toUpperCase() : '';

  if (inline) {
    return (
      <code
        className="px-2 py-1 rounded-sm font-mono text-sm"
        style={{
          backgroundColor: m3Colors.surfaceContainer,
          color: m3Colors.primary,
          border: `2px solid ${m3Colors.outlineVariant}`,
          boxShadow: `1px 1px 0px ${m3Colors.outlineVariant}`,
        }}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div
      className="mb-4 rounded-none overflow-hidden relative"
      style={{
        border: `3px solid ${m3Colors.onBackground}`,
        boxShadow: `4px 4px 0px ${m3Colors.onBackground}`,
        backgroundColor: isMermaid ? m3Colors.background : '#1e293b',
      }}
    >
      {!isMermaid && (
        <>
          {lang && (
            <div
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide flex justify-between items-center"
              style={{
                backgroundColor: '#0f172a',
                color: '#94a3b8',
                borderBottom: `1px solid ${m3Colors.outline}`,
              }}
            >
              <span>{displayLang}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded transition-all active:scale-95 flex items-center gap-1"
                style={{
                  backgroundColor: copied ? m3Colors.success : m3Colors.primary,
                  color: '#FFFFFF',
                  border: `1px solid ${m3Colors.outline}`,
                }}
                title={copied ? 'COPIED!' : 'Copy code'}
              >
                {copied ? (
                  <>
                    <span className="material-symbols-rounded text-xs">check</span>
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-rounded text-xs">content_copy</span>
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
          {!lang && (
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 z-10 p-2 rounded transition-all active:scale-95"
              style={{
                backgroundColor: copied ? m3Colors.success : 'rgba(255,255,255,0.1)',
                border: `1px solid ${m3Colors.outline}`,
                color: '#e5e7eb',
              }}
              title={copied ? 'COPIED!' : 'Copy code'}
            >
              {copied ? (
                <span className="material-symbols-rounded text-sm">check</span>
              ) : (
                <span className="material-symbols-rounded text-sm">content_copy</span>
              )}
            </button>
          )}
        </>
      )}

      {isMermaid ? (
        <MermaidDiagram code={codeContent} id={mermaidId} />
      ) : (
        <pre
          className={className}
          style={{
            color: '#e5e7eb',
            padding: lang ? '1rem' : '1rem',
            overflowX: 'auto',
            fontFamily: '"Fira Code", "Courier New", monospace',
            fontSize: '0.9rem',
            lineHeight: 1.6,
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

// Heading Components
const MarkdownH1 = memo((props: React.ComponentProps<'h1'>) => (
  <h1
    className="font-bold uppercase mb-4 mt-8 pb-3"
    style={{
      fontSize: '2.25rem',
      color: m3Colors.onBackground,
      borderBottom: `3px solid ${m3Colors.primary}`,
      display: 'block',
      letterSpacing: '0.5px',
    }}
    {...props}
  />
));
MarkdownH1.displayName = 'MarkdownH1';

const MarkdownH2 = memo((props: React.ComponentProps<'h2'>) => (
  <h2
    className="font-bold uppercase mb-3 mt-6 pb-2"
    style={{
      fontSize: '1.75rem',
      color: m3Colors.onBackground,
      borderBottom: `2px solid ${m3Colors.secondary}`,
      letterSpacing: '0.3px',
    }}
    {...props}
  />
));
MarkdownH2.displayName = 'MarkdownH2';

const MarkdownH3 = memo((props: React.ComponentProps<'h3'>) => (
  <h3
    className="font-bold mb-3 mt-5"
    style={{
      fontSize: '1.5rem',
      color: m3Colors.onBackground,
      letterSpacing: '0.2px',
    }}
    {...props}
  />
));
MarkdownH3.displayName = 'MarkdownH3';

const MarkdownH4 = memo((props: React.ComponentProps<'h4'>) => (
  <h4
    className="font-bold mb-2 mt-4"
    style={{
      fontSize: '1.25rem',
      color: m3Colors.secondary,
      letterSpacing: '0.1px',
    }}
    {...props}
  />
));
MarkdownH4.displayName = 'MarkdownH4';

const MarkdownP = memo((props: React.ComponentProps<'p'>) => (
  <p
    className="mb-3 leading-relaxed font-medium"
    style={{
      fontSize: '1.05rem',
      color: m3Colors.onBackground,
      lineHeight: 1.7,
    }}
    {...props}
  />
));
MarkdownP.displayName = 'MarkdownP';

const MarkdownA = memo((props: React.ComponentProps<'a'>) => (
  <a
    className="font-bold underline transition-all hover:opacity-80"
    style={{
      color: m3Colors.primary,
      textDecorationColor: m3Colors.secondary,
      textUnderlineOffset: '3px',
    }}
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
));
MarkdownA.displayName = 'MarkdownA';

const MarkdownUl = memo((props: React.ComponentProps<'ul'>) => (
  <ul
    className="mb-4 pl-6 space-y-2"
    style={{
      listStyleType: 'none',
    }}
    {...props}
  />
));
MarkdownUl.displayName = 'MarkdownUl';

const MarkdownOl = memo((props: React.ComponentProps<'ol'>) => (
  <ol
    className="mb-4 pl-6 space-y-2 list-decimal"
    {...props}
  />
));
MarkdownOl.displayName = 'MarkdownOl';

const MarkdownLi = memo((props: React.ComponentProps<'li'>) => (
  <li
    className="font-medium"
    style={{
      fontSize: '1.05rem',
      color: m3Colors.onBackground,
      lineHeight: 1.6,
    }}
    {...props}
  />
));
MarkdownLi.displayName = 'MarkdownLi';

const MarkdownBlockquote = memo((props: React.ComponentProps<'blockquote'>) => (
  <blockquote
    className="px-5 py-4 my-4 rounded-none"
    style={{
      borderLeft: `6px solid ${m3Colors.primary}`,
      border: `2px solid ${m3Colors.outlineVariant}`,
      borderLeftWidth: '6px',
      backgroundColor: m3Colors.surfaceContainerHigh,
      boxShadow: `2px 2px 0px ${m3Colors.outlineVariant}`,
      color: m3Colors.onBackground,
      fontStyle: 'italic',
      fontWeight: 500,
    }}
    {...props}
  />
));
MarkdownBlockquote.displayName = 'MarkdownBlockquote';

const MarkdownImg = memo((props: React.ComponentProps<'img'>) => (
  <img
    className="max-w-full h-auto my-4 mx-auto block rounded-none"
    style={{
      border: `3px solid ${m3Colors.onBackground}`,
      boxShadow: `4px 4px 0px ${m3Colors.onBackground}`,
    }}
    loading="lazy"
    {...props}
  />
));
MarkdownImg.displayName = 'MarkdownImg';

const MarkdownTable = memo(({ children, ...props }: React.ComponentProps<'table'>) => {
  const tbody = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === 'tbody'
  ) as React.ReactElement<any> | undefined;

  const rows = tbody ? React.Children.toArray((tbody.props as { children?: React.ReactNode }).children) : [];

  return (
    <div
      className="w-full overflow-auto mb-4 rounded-none"
      style={{
        border: `3px solid ${m3Colors.onBackground}`,
        boxShadow: `4px 4px 0px ${m3Colors.onBackground}`,
      }}
    >
      <table className="w-full border-collapse" {...props}>
        {children}
      </table>
    </div>
  );
});
MarkdownTable.displayName = 'MarkdownTable';

interface TableRowProps extends React.ComponentProps<'tr'> {
  rowIndex?: number;
}

const MarkdownTr = memo(({ rowIndex = 0, ...props }: TableRowProps) => {
  const isEven = rowIndex % 2 === 0;
  return (
    <tr
      className="transition-colors hover:shadow-inner"
      style={{
        backgroundColor: isEven ? m3Colors.background : m3Colors.surfaceContainer,
      }}
      data-row-index={rowIndex}
      {...props}
    />
  );
});
MarkdownTr.displayName = 'MarkdownTr';

const MarkdownTh = memo((props: React.ComponentProps<'th'>) => (
  <th
    className="p-3 text-left font-black uppercase transition-colors"
    style={{
      backgroundColor: m3Colors.primary,
      color: '#FFFFFF',
      border: `2px solid ${m3Colors.onBackground}`,
      letterSpacing: '0.5px',
    }}
    {...props}
  />
));
MarkdownTh.displayName = 'MarkdownTh';

const MarkdownTd = memo(({ rowIndex = 0, ...props }: React.ComponentProps<'td'> & { rowIndex?: number }) => {
  const isEven = rowIndex % 2 === 0;
  return (
    <td
      className="p-3 font-medium transition-colors"
      style={{
        backgroundColor: isEven ? m3Colors.background : m3Colors.surfaceContainer,
        color: m3Colors.onBackground,
        border: `1px solid ${m3Colors.outlineVariant}`,
      }}
      {...props}
    />
  );
});
MarkdownTd.displayName = 'MarkdownTd';

const MarkdownHr = memo((props: React.ComponentProps<'hr'>) => (
  <hr
    className="my-6 border-none h-1"
    style={{
      backgroundColor: m3Colors.onBackground,
      boxShadow: `4px 4px 0px ${m3Colors.onBackground}`,
    }}
    {...props}
  />
));
MarkdownHr.displayName = 'MarkdownHr';

const components: Options['components'] = {
  h1: MarkdownH1,
  h2: MarkdownH2,
  h3: MarkdownH3,
  h4: MarkdownH4,
  p: MarkdownP,
  a: MarkdownA,
  ul: MarkdownUl,
  ol: MarkdownOl,
  li: MarkdownLi,
  code: CodeBlock,
  blockquote: MarkdownBlockquote,
  img: MarkdownImg,
  table: MarkdownTable,
  th: MarkdownTh,
  td: MarkdownTd,
  hr: MarkdownHr,
};

const MarkdownRendererFunction: React.FC<MarkdownRendererProps> = ({ markdown, className }) => {
  return (
    <div className={`prose prose-sm max-w-none ${className || ''}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypePrism]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

const MarkdownRenderer = memo(MarkdownRendererFunction);
MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;
