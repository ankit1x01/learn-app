/**
 * Offline-first storage layer for CHITTA DSA
 * Uses @capacitor/preferences for structured data (works 100% offline on Android)
 * Uses @capacitor/filesystem for images
 */

import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory } from '@capacitor/filesystem';

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEY_CONCEPT_STATES  = 'chitta:concept_states';   // all FSRS states in one blob
const KEY_TOPICS_READ     = 'chitta:topics_read';       // Set of read topic keys
const KEY_NOTES_MAP       = 'chitta:notes';             // Map of refKey → note text
const KEY_IMAGES_MAP      = 'chitta:images';            // Map of refKey → string[] paths
const KEY_DB_VERSION      = 'chitta:db_version';
const KEY_COURSE_PROGRESS = 'chitta:course_progress';   // course day completions + compress notes
const DB_VERSION          = 2;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ConceptState {
  stage:       string;   // 'Unseen' | 'Fragile' | 'Conscious' | 'Automatic'
  stability:   number;
  difficulty:  number;
  lastTested:  number;
  queue:       string;   // 'new' | 'review' | 'strengthen' | 'challenge'
  // Neuroscience fields
  encodingDepth?:          string;   // 'shallow' | 'moderate' | 'deep'
  metacogAccuracy?:        number;
  overconfidenceFlag?:     boolean;
  predictionErrorHistory?: { date: number; preTestWrong: boolean }[];
  lastStudiedAt?:          number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const { value } = await Preferences.get({ key });
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

async function setJSON(key: string, value: unknown): Promise<void> {
  await Preferences.set({ key, value: JSON.stringify(value) });
}

// ─── DB init / migration ───────────────────────────────────────────────────────

export async function initDB(): Promise<void> {
  const { value } = await Preferences.get({ key: KEY_DB_VERSION });
  const existing = value ? parseInt(value, 10) : 0;
  if (existing < DB_VERSION) {
    // future migrations go here
    await Preferences.set({ key: KEY_DB_VERSION, value: String(DB_VERSION) });
  }
}

// ─── App Login Streak ────────────────────────────────────────────────────────

const KEY_LAST_LOGIN = 'chitta:last_login';
const KEY_STREAK     = 'chitta:current_streak';

/**
 * Read the current streak without mutating storage.
 * If the user hasn't logged in today but logged in yesterday, the streak is still active.
 * If the user hasn't logged in since before yesterday, the streak is broken (0).
 */
export async function peekStreak(): Promise<number> {
  const lastLogin = await getJSON<string | null>(KEY_LAST_LOGIN, null);
  const streak = await getJSON<number>(KEY_STREAK, 0);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastLogin === today || lastLogin === yesterday) {
    return streak;
  }
  return 0; // Streak broken
}

/**
 * Commits today's activity and advances the streak if applicable.
 * Called when a session is actually started or completed.
 */
export async function recordTodayLogin(): Promise<number> {
  const today = new Date().toDateString();
  const lastLogin = await getJSON<string | null>(KEY_LAST_LOGIN, null);
  let streak = await getJSON<number>(KEY_STREAK, 0);

  if (lastLogin === today) {
    return streak; // Already recorded today
  }

  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastLogin === yesterday) {
    streak += 1;
  } else {
    // Broke streak (or first time)
    streak = 1;
  }

  // Update for today
  await setJSON(KEY_LAST_LOGIN, today);
  await setJSON(KEY_STREAK, streak);

  return streak;
}

// ─── Concept states ───────────────────────────────────────────────────────────

/** Load all concept FSRS states as a Map<id, ConceptState> */
export async function loadConceptStates(): Promise<Map<string, ConceptState>> {
  const raw = await getJSON<Record<string, ConceptState>>(KEY_CONCEPT_STATES, {});
  return new Map(Object.entries(raw));
}

/** Persist all concept states at once (call after session complete) */
export async function saveAllConceptStates(states: Map<string, ConceptState>): Promise<void> {
  const obj: Record<string, ConceptState> = {};
  states.forEach((v, k) => { obj[k] = v; });
  await setJSON(KEY_CONCEPT_STATES, obj);
}

/** Persist a single concept state (call after each rating) */
export async function saveConceptState(id: string, state: ConceptState): Promise<void> {
  const raw = await getJSON<Record<string, ConceptState>>(KEY_CONCEPT_STATES, {});
  raw[id] = state;
  await setJSON(KEY_CONCEPT_STATES, raw);
}

// ─── Course Progress ─────────────────────────────────────────────────────────

export interface CourseDayProgress {
  completedAt: number;   // timestamp
  compressNote: string;  // student's written compression (Day N compress field)
}

export async function loadCourseProgress(): Promise<Map<number, CourseDayProgress>> {
  const raw = await getJSON<Record<number, CourseDayProgress>>(KEY_COURSE_PROGRESS, {});
  return new Map(Object.entries(raw).map(([k, v]) => [Number(k), v]));
}

export async function saveCourseDay(day: number, note: string): Promise<void> {
  const raw = await getJSON<Record<number, CourseDayProgress>>(KEY_COURSE_PROGRESS, {});
  raw[day] = { completedAt: Date.now(), compressNote: note };
  await setJSON(KEY_COURSE_PROGRESS, raw);
}

// ─── Topic read status ────────────────────────────────────────────────────────

/** Returns a Set of topic keys that have been marked as read */
export async function loadTopicsRead(): Promise<Set<string>> {
  const arr = await getJSON<string[]>(KEY_TOPICS_READ, []);
  return new Set(arr);
}

export async function markTopicRead(topicKey: string): Promise<void> {
  const set = await loadTopicsRead();
  set.add(topicKey);
  await setJSON(KEY_TOPICS_READ, [...set]);
}

export async function unmarkTopicRead(topicKey: string): Promise<void> {
  const set = await loadTopicsRead();
  set.delete(topicKey);
  await setJSON(KEY_TOPICS_READ, [...set]);
}

// ─── User notes ───────────────────────────────────────────────────────────────

/** Load all notes as Map<refKey, noteText> */
export async function loadNotes(): Promise<Map<string, string>> {
  const raw = await getJSON<Record<string, string>>(KEY_NOTES_MAP, {});
  return new Map(Object.entries(raw));
}

export async function saveNote(refKey: string, note: string): Promise<void> {
  const raw = await getJSON<Record<string, string>>(KEY_NOTES_MAP, {});
  if (note.trim()) {
    raw[refKey] = note.trim();
  } else {
    delete raw[refKey];
  }
  await setJSON(KEY_NOTES_MAP, raw);
}

export async function deleteNote(refKey: string): Promise<void> {
  await saveNote(refKey, '');
}

// ─── Images (via Filesystem) ──────────────────────────────────────────────────

const IMAGE_DIR = 'chitta_images';

/** Ensure image directory exists */
async function ensureImageDir(): Promise<void> {
  try {
    await Filesystem.mkdir({ path: IMAGE_DIR, directory: Directory.Data, recursive: true });
  } catch {
    // already exists — ignore
  }
}

/** Save a base64 image and return its path */
export async function saveImage(refKey: string, base64Data: string, ext = 'jpg'): Promise<string> {
  await ensureImageDir();
  const filename = `${IMAGE_DIR}/${refKey.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.${ext}`;
  await Filesystem.writeFile({
    path: filename,
    data: base64Data,
    directory: Directory.Data,
  });

  // Register path in images map
  const raw = await getJSON<Record<string, string[]>>(KEY_IMAGES_MAP, {});
  if (!raw[refKey]) raw[refKey] = [];
  raw[refKey].push(filename);
  await setJSON(KEY_IMAGES_MAP, raw);

  return filename;
}

/** Load image paths for a given refKey */
export async function loadImagePaths(refKey: string): Promise<string[]> {
  const raw = await getJSON<Record<string, string[]>>(KEY_IMAGES_MAP, {});
  return raw[refKey] ?? [];
}

/** Read a saved image as base64 data URI */
export async function readImageAsDataURI(path: string): Promise<string> {
  const result = await Filesystem.readFile({ path, directory: Directory.Data });
  const data = result.data;
  if (typeof data === 'string') {
    return data.startsWith('data:') ? data : `data:image/jpeg;base64,${data}`;
  }
  // Blob — convert to base64
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(data as Blob);
  });
}

/** Delete a saved image by path */
export async function deleteImage(refKey: string, path: string): Promise<void> {
  try {
    await Filesystem.deleteFile({ path, directory: Directory.Data });
  } catch { /* ignore if already gone */ }
  const raw = await getJSON<Record<string, string[]>>(KEY_IMAGES_MAP, {});
  if (raw[refKey]) {
    raw[refKey] = raw[refKey].filter(p => p !== path);
    if (raw[refKey].length === 0) delete raw[refKey];
  }
  await setJSON(KEY_IMAGES_MAP, raw);
}

/** Load all notes + images counts for a list of refKeys in one shot */
export async function loadContentSummary(refKeys: string[]): Promise<Map<string, { note: string; imageCount: number }>> {
  const [notesRaw, imagesRaw] = await Promise.all([
    getJSON<Record<string, string>>(KEY_NOTES_MAP, {}),
    getJSON<Record<string, string[]>>(KEY_IMAGES_MAP, {}),
  ]);
  const result = new Map<string, { note: string; imageCount: number }>();
  for (const key of refKeys) {
    const note  = notesRaw[key]  ?? '';
    const imageCount = (imagesRaw[key] ?? []).length;
    if (note || imageCount > 0) {
      result.set(key, { note, imageCount });
    }
  }
  return result;
}

// ─── Portfolio Projects ──────────────────────────────────────────────────────

const KEY_PORTFOLIO = 'chitta:portfolio_projects';

export type PortfolioStatus = 'not_started' | 'in_progress' | 'completed';

export interface PortfolioProgress {
  status: PortfolioStatus;
  startedAt?: number;
  completedAt?: number;
  githubUrl?: string;
  notes?: string;
}

export async function loadPortfolio(): Promise<Record<string, PortfolioProgress>> {
  return await getJSON<Record<string, PortfolioProgress>>(KEY_PORTFOLIO, {});
}

export async function savePortfolioItem(id: string, progress: PortfolioProgress): Promise<void> {
  const raw = await loadPortfolio();
  raw[id] = progress;
  await setJSON(KEY_PORTFOLIO, raw);
}
