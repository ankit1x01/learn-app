/**
 * Mass replace dark-theme tokens → light-theme equivalents across all src files.
 * Run: node scripts/fix-theme.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'glob';

const files = globSync('src/**/*.{tsx,ts,css}', { cwd: process.cwd() });

// Ordered: most specific first to avoid partial-match collisions
const REPLACEMENTS = [
  // ── on-surface-variant opacity tiers ──────────────────────────────────────
  [/text-on-surface-variant\/1[0-9]/g,   'text-[#A8A29E]'],  // /10-19
  [/text-on-surface-variant\/2[0-9]/g,   'text-[#A8A29E]'],  // /20-29 → muted
  [/text-on-surface-variant\/3[0-9]/g,   'text-[#78716C]'],  // /30-39 → secondary
  [/text-on-surface-variant\/4[0-9]/g,   'text-[#6B7280]'],  // /40-49
  [/text-on-surface-variant\/5[0-9]/g,   'text-[#6B7280]'],  // /50-59
  [/text-on-surface-variant\/6[0-9]/g,   'text-[#6B7280]'],  // /60-69
  [/text-on-surface-variant\/7[0-9]/g,   'text-[#374151]'],  // /70-79 → body
  [/text-on-surface-variant\/8[0-9]/g,   'text-[#374151]'],  // /80-89
  [/text-on-surface-variant\/9[0-9]/g,   'text-[#292524]'],  // /90+
  [/\btext-on-surface-variant\b/g,       'text-[#6B7280]'],  // bare token

  // ── on-surface opacity tiers ───────────────────────────────────────────────
  [/text-on-surface\/[0-9]+/g,           'text-[#292524]'],
  [/\btext-on-surface\b/g,               'text-[#1C1917]'],

  // ── Glass → clean card ────────────────────────────────────────────────────
  [/glass-card-premium/g,                'card'],
  [/\bglass-card\b/g,                    'card'],

  // ── Borders ───────────────────────────────────────────────────────────────
  [/border-white\/[0-9]+/g,              'border-[#E8E5DF]'],

  // ── Hover backgrounds ─────────────────────────────────────────────────────
  [/hover:bg-white\/5\b/g,               'hover:bg-[#F7F6F3]'],
  [/hover:bg-white\/[0-9]+/g,            'hover:bg-[#F0EEE9]'],

  // ── Backgrounds ───────────────────────────────────────────────────────────
  [/bg-white\/[0-9]+/g,                  'bg-[#F0EEE9]'],
  [/bg-background\/[0-9]+/g,             'bg-[#F7F6F3]/95'],
  [/\bbg-background\b/g,                 'bg-[#F7F6F3]'],
  [/bg-surface-variant\/[0-9]+/g,        'bg-[#F0EEE9]'],
  [/\bbg-surface-variant\b/g,            'bg-[#F0EEE9]'],

  // ── Neon blue-teal (#38BDF8) → readable deep teal ─────────────────────────
  [/text-\[#38BDF8\]/g,                  'text-[#0E7490]'],
  [/bg-\[#38BDF8\]\/[0-9]+/g,            'bg-[#ECFEFF]'],
  [/border-\[#38BDF8\]\/[0-9]+/g,        'border-[#A5F3FC]'],

  // ── Neon pink (#F472B6) → muted purple ────────────────────────────────────
  [/text-\[#F472B6\]/g,                  'text-[#7C3AED]'],
  [/bg-\[#F472B6\]\/[0-9]+/g,            'bg-[#F5F3FF]'],

  // ── Old primary colour overrides ──────────────────────────────────────────
  [/text-\[#6C63FF\]/g,                  'text-[#2563EB]'],
  [/bg-\[#6C63FF\]/g,                    'bg-[#2563EB]'],
  [/text-\[#7B6FFF\]/g,                  'text-[#2563EB]'],
  [/bg-\[#7B6FFF\]/g,                    'bg-[#2563EB]'],

  // ── Old success neon (#00D97E) → deep green ───────────────────────────────
  [/text-\[#00D97E\]/g,                  'text-[#15803D]'],
  [/bg-\[#00D97E\]/g,                    'bg-[#15803D]'],
  [/\btext-success\b/g,                  'text-[#15803D]'],
  [/\bbg-success\/[0-9]+/g,              'bg-[#F0FDF4]'],
  [/\bbg-success\b/g,                    'bg-[#15803D]'],
  [/border-success\/[0-9]+/g,            'border-[#BBF7D0]'],

  // ── Old error neon (#FF4D6D) → deep red ───────────────────────────────────
  [/text-\[#FF4D6D\]/g,                  'text-[#B91C1C]'],
  [/bg-\[#FF4D6D\]/g,                    'bg-[#B91C1C]'],
  [/\btext-error\b/g,                    'text-[#B91C1C]'],
  [/\bbg-error\/[0-9]+/g,                'bg-[#FEF2F2]'],
  [/border-error\/[0-9]+/g,              'border-[#FECACA]'],

  // ── Old tertiary (#F5A623) → amber ────────────────────────────────────────
  [/\btext-tertiary\b/g,                 'text-[#B45309]'],
  [/\bbg-tertiary\/[0-9]+/g,             'bg-[#FFFBEB]'],

  // ── Backdrop blur (remove — not needed in light theme) ────────────────────
  [/backdrop-filter: blur\([^)]+\);?\s*/g, ''],
  [/backdropFilter: ['"][^'"]+['"]/g,    ''],
  [/\bbackdrop-blur-\w+/g,              ''],

  // ── font-headline → font-ui ───────────────────────────────────────────────
  [/\bfont-headline\b/g,                 'font-ui'],

  // ── tracking-widest on tiny text → normal ─────────────────────────────────
  // (only on text-[8px] and text-[9px] which are too small)
  [/(text-\[(?:8|9)px\][^"]*?)tracking-widest/g, '$1tracking-normal'],
  [/(text-\[(?:8|9)px\][^"]*?)tracking-\[0\.[0-9]+em\]/g, '$1'],

  // ── Minimum font sizes: text-[8px] → text-[12px], text-[9px] → text-[12px] ─
  [/\btext-\[8px\]/g,                    'text-[12px]'],
  [/\btext-\[9px\]/g,                    'text-[12px]'],
  [/\btext-\[10px\]/g,                   'text-[12px]'],

  // ── Dark result sheet backgrounds ─────────────────────────────────────────
  [/rgba\(13,17,23,0\.\d+\)/g,           '#FFFFFF'],
  [/rgba\(22,27,38,0\.\d+\)/g,           '#FFFFFF'],
  [/rgba\(12,16,24,0\.\d+\)/g,           '#FFFFFF'],
];

let totalChanges = 0;

for (const file of files) {
  let src = readFileSync(file, 'utf8');
  const original = src;

  for (const [pattern, replacement] of REPLACEMENTS) {
    src = src.replace(pattern, replacement);
  }

  if (src !== original) {
    writeFileSync(file, src, 'utf8');
    const changes = REPLACEMENTS.reduce((count, [p]) => {
      const matches = original.match(p);
      return count + (matches ? matches.length : 0);
    }, 0);
    console.log(`✓ ${file} (${changes} replacements)`);
    totalChanges += changes;
  }
}

console.log(`\n✅ Done — ${totalChanges} total replacements across ${files.length} files`);
