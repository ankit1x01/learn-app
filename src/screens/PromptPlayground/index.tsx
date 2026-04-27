import React, { useState } from 'react';
import { CoursePackSelector } from './CoursePackSelector';
import { PromptPlaygroundEditor } from './PromptPlaygroundEditor';
import { usePackProgress } from './usePackProgress';
import type { Screen, CoursePackId } from '../../types';
import { COURSE_PACKS } from './data';

interface PromptPlaygroundProps {
  setScreen: (s: Screen) => void;
}

export const PromptPlayground: React.FC<PromptPlaygroundProps> = ({ setScreen }) => {
  const [selectedPack, setSelectedPack] = useState<CoursePackId | null>(null);
  const { progress, advanceToNextChapter } = usePackProgress();

  if (selectedPack === null) {
    return <CoursePackSelector onSelectPack={setSelectedPack} />;
  }

  const pack = COURSE_PACKS[selectedPack];
  const currentChapter = progress[selectedPack].currentChapter;

  const handleBack = () => {
    setSelectedPack(null);
  };

  const handleNextChapter = async () => {
    if (currentChapter < pack.chapterCount) {
      await advanceToNextChapter(selectedPack);
    }
  };

  return (
    <PromptPlaygroundEditor
      pack={selectedPack}
      chapter={currentChapter}
      onBack={handleBack}
      onNextChapter={handleNextChapter}
    />
  );
};

export default PromptPlayground;
