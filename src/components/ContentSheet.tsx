/**
 * ContentSheet — bottom sheet for adding/viewing notes and images per problem.
 * Uses @capacitor/filesystem for offline image storage.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFocusTrap } from '../lib/useFocusTrap';

import {
  loadImagePaths,
  readImageAsDataURI,
  saveImage,
  deleteImage,
  saveNote,
  loadNotes,
} from '../db/store';

interface Props {
  refKey:   string;   // unique key for this problem/topic
  label:    string;   // display name
  onClose:  () => void;
}

interface LoadedImage {
  path:    string;
  dataURI: string;
}

import { m3SpatialDefault } from '../lib/m3-motion';

export const ContentSheet: React.FC<Props> = ({ refKey, label, onClose }) => {
  const [note, setNote]           = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [images, setImages]       = useState<LoadedImage[]>([]);
  const [loading, setLoading]     = useState(true);
  const [noteSaved, setNoteSaved] = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const containerRef = useFocusTrap(true);

  // Load existing content on open
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [notesMap, paths] = await Promise.all([
        loadNotes(),
        loadImagePaths(refKey),
      ]);
      if (cancelled) return;
      const existing = notesMap.get(refKey) ?? '';
      setNote(existing);
      setSavedNote(existing);

      // Load image data URIs
      const loaded: LoadedImage[] = [];
      for (const path of paths) {
        try {
          const dataURI = await readImageAsDataURI(path);
          loaded.push({ path, dataURI });
        } catch { /* skip unreadable */ }
      }
      if (!cancelled) setImages(loaded);
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [refKey]);

  const handleSaveNote = async () => {
    await saveNote(refKey, note);
    setSavedNote(note.trim());
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1800);
  };

  const handleDeleteNote = async () => {
    await saveNote(refKey, '');
    setNote('');
    setSavedNote('');
  };

  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const ext    = file.type.includes('png') ? 'png' : 'jpg';
      try {
        const path = await saveImage(refKey, base64, ext);
        const dataURI = `data:${file.type};base64,${base64}`;
        setImages(prev => [...prev, { path, dataURI }]);
      } catch (err) {
        console.error('Image save failed:', err);
      }
    };
    reader.readAsDataURL(file);
    // reset so same file can be picked again
    e.target.value = '';
  };

  const handleDeleteImage = async (img: LoadedImage) => {
    await deleteImage(refKey, img.path);
    setImages(prev => prev.filter(i => i.path !== img.path));
  };

  const noteChanged = note !== savedNote;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex flex-col justify-end"
      onClick={onClose}
    >
      <div className="absolute inset-0" style={{ background: 'var(--color-scrim)' }} />

      <motion.div
        ref={containerRef}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={m3SpatialDefault}
        onClick={e => e.stopPropagation()}
        className="relative z-10 max-h-[90vh] flex flex-col focus:outline-none"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-sheet-title"
        style={{
          background: 'var(--color-surface-container-low)',
          borderRadius: '28px 28px 0 0',
          borderTop: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-elevation-1)',
        }}
      >
        {/* M3 Drag Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div style={{ width: 32, height: 4, borderRadius: 9999, background: 'var(--color-surface-variant)' }} />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pb-4 pt-2 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-rounded" style={{ fontSize: 12,  color: 'var(--color-subject-cs)'  }}>sticky_note_2</span>
              <span className="text-[12px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-subject-cs)' }}>My Notes</span>
            </div>
            <h2 id="content-sheet-title" className="font-ui font-bold text-base leading-tight">{label}</h2>
          </div>
          <button onClick={onClose} className="btn-icon mt-1 shrink-0">
            <span className="material-symbols-rounded" style={{ fontSize: 16 }}>close</span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pb-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Note section ── */}
              <div className="mb-6">
                <p className="text-[12px] uppercase tracking-widest font-bold mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Text Note
                </p>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Write your understanding, approach, edge cases…"
                  rows={5}
                  className="w-full rounded-2xl p-4 text-sm resize-none leading-relaxed focus:outline-none"
              style={{ background: 'var(--color-surface-container)', border: '1px solid var(--color-border)', color: 'var(--color-on-surface)' }}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveNote}
                    disabled={!noteChanged && !note}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border"
                    style={
                      noteSaved
                        ? { background: 'var(--color-success-container)', borderColor: 'var(--color-success)', color: 'var(--color-on-success-container)' }
                        : noteChanged
                        ? { background: 'var(--color-primary-container)', borderColor: 'var(--color-primary-border)', color: 'var(--color-on-primary-container)' }
                        : { background: 'var(--color-surface-container)', borderColor: 'var(--color-border)', color: 'var(--color-on-surface-variant)' }
                    }
                  >
                    {noteSaved ? <span className="material-symbols-rounded" style={{ fontSize: 14 }}>check</span> : <span className="material-symbols-rounded" style={{ fontSize: 14 }}>sticky_note_2</span>}
                    {noteSaved ? 'Saved!' : 'Save Note'}
                  </button>
                  {savedNote && (
                    <button
                      onClick={handleDeleteNote}
                      className="px-4 py-3 rounded-xl border"
                      style={{ background: 'var(--color-error-container)', borderColor: 'var(--color-error)', color: 'var(--color-on-error-container)' }}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: 14 }}>delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── Images section ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] uppercase tracking-widest font-bold" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Images ({images.length})
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold uppercase tracking-widest"
                    style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', border: '1px solid var(--color-primary-border)' }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: 11 }}>photo_camera</span>
                    Add Photo
                  </button>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleImagePick}
                />

                {images.length === 0 ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border border-dashed rounded-2xl py-8 flex flex-col items-center gap-2 transition-colors"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-on-surface-variant)' }}
                  >
                    <span className="material-symbols-rounded" style={{ fontSize: 24 }}>image</span>
                    <span className="text-xs">Tap to add a photo of your handwritten notes</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-square" style={{ background: 'var(--color-surface-container-high)' }}>
                        <img
                          src={img.dataURI}
                          alt={`note-${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleDeleteImage(img)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full"
                          style={{ background: 'rgba(255,251,254,0.95)', color: 'var(--color-error)' }}
                        >
                          <span className="material-symbols-rounded" style={{ fontSize: 12 }}>delete</span>
                        </button>
                      </div>
                    ))}
                    {/* Add more */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border border-dashed flex items-center justify-center"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-on-surface-variant)' }}
                    >
                      <span className="material-symbols-rounded" style={{ fontSize: 20 }}>add</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
