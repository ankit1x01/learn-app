import React, { useEffect, useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export function CodeBlock({ code, language = 'typescript', title }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    import('shiki').then(({ codeToHtml }) => {
      codeToHtml(code, {
        lang: language,
        theme: 'github-dark',
      }).then((result) => {
        if (!cancelled) {
          setHtml(result);
          setLoading(false);
        }
      });
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [code, language]);

  return (
    <div style={{
      borderRadius: '10px',
      overflow: 'hidden',
      border: '1px solid #30363d',
      fontFamily: '"Fira Code", "JetBrains Mono", monospace',
      fontSize: '13px',
    }}>
      {title && (
        <div style={{
          background: '#161b22',
          color: '#8b949e',
          padding: '8px 14px',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57', display: 'inline-block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e', display: 'inline-block' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840', display: 'inline-block' }} />
          <span style={{ marginLeft: 8 }}>{title}</span>
        </div>
      )}
      {loading ? (
        <div style={{ background: '#0d1117', padding: '16px', color: '#8b949e' }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{code}</pre>
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ overflow: 'auto', maxHeight: '300px' }}
        />
      )}
    </div>
  );
}
