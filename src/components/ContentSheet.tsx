/**
 * ContentSheet — bottom sheet for adding/viewing notes and images per problem.
 * Uses @capacitor/filesystem for offline image storage.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, StickyNote, Image, Trash2, Plus, Check, Camera } from 'lucide-react';
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

export const ContentSheet: React.FC<Props> = ({ refKey, label, onClose }) => {
  const [note, setNote]           = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [images, setImages]       = useState<LoadedImage[]>([]);
  const [loading, setLoading]     = useState(true);
  const [noteSaved, setNoteSaved] = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);

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
      <div className="absolute inset-0 bg-[#F7F6F3]/95 " />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 bg-surface rounded-t-[2.5rem] border-t border-[#E8E5DF] shadow-[0_-20px_60px_rgba(0,0,0,0.5)] max-h-[90vh] flex flex-col"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-[#F0EEE9]" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pb-4 pt-2 shrink-0">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <StickyNote size={12} className="text-[#0E7490]" />
              <span className="text-[12px] uppercase tracking-widest text-[#0E7490] font-bold">My Notes</span>
            </div>
            <h2 className="font-ui font-bold text-base leading-tight">{label}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-[#F0EEE9] hover:bg-[#F0EEE9] transition-colors mt-1 shrink-0">
            <X size={16} className="text-[#6B7280]" />
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
                <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold mb-2">
                  Text Note
                </p>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Write your understanding, approach, edge cases…"
                  rows={5}
                  className="w-full bg-[#F0EEE9] border border-[#E8E5DF] rounded-2xl p-4 text-sm text-[#1C1917] placeholder:text-[#78716C] focus:outline-none focus:border-[#A5F3FC] resize-none leading-relaxed"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveNote}
                    disabled={!noteChanged && !note}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all ${
                      noteSaved
                        ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#15803D]'
                        : noteChanged
                        ? 'bg-[#ECFEFF] border border-[#A5F3FC] text-[#0E7490]'
                        : 'bg-[#F0EEE9] border border-[#E8E5DF] text-[#78716C]'
                    }`}
                  >
                    {noteSaved ? <Check size={14} /> : <StickyNote size={14} />}
                    {noteSaved ? 'Saved!' : 'Save Note'}
                  </button>
                  {savedNote && (
                    <button
                      onClick={handleDeleteNote}
                      className="px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C]"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* ── Images section ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[12px] uppercase tracking-widest text-[#78716C] font-bold">
                    Images ({images.length})
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F3FF] border border-[#F472B6]/20 text-[#7C3AED] text-[12px] font-bold uppercase tracking-widest"
                  >
                    <Camera size={11} />
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
                    className="w-full border border-dashed border-[#E8E5DF] rounded-2xl py-8 flex flex-col items-center gap-2 text-[#78716C] hover:border-[#E8E5DF] transition-colors"
                  >
                    <Image size={24} />
                    <span className="text-xs">Tap to add a photo of your handwritten notes</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((img, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-square bg-[#F0EEE9]">
                        <img
                          src={img.dataURI}
                          alt={`note-${i}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => handleDeleteImage(img)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-[#F7F6F3]/95 text-[#B91C1C]"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {/* Add more */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border border-dashed border-[#E8E5DF] flex items-center justify-center text-[#78716C] hover:border-[#E8E5DF]"
                    >
                      <Plus size={20} />
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
