import React from "react";
import { motion, AnimatePresence, Variants } from "motion/react";
import { cn } from "@/lib/utils";

export interface CognitiveItemProps {
  /** Uniquely identifies the item for AnimatePresence/layout */
  id: string | number;
  /** Primary content to display (text, emoji, or custom React node) */
  children: React.ReactNode;
  /** Primary base color in hex (e.g., '#10B981') */
  color?: string;
  /** Darker shadow color in hex (e.g., '#16A34A') */
  shadowColor?: string;
  /** Additional Tailwind classes for the wrapper */
  className?: string;
  /** Callback fired on tap/click */
  onClick?: () => void;
  /** If true, the item is removed with a popping animation */
  isPopped?: boolean;
  /** If true, disables interaction */
  disabled?: boolean;
  /** Custom Framer Motion variants */
  variants?: Variants;
}

/**
 * A highly tactile, 2.5D cognitive game component.
 * Uses spring physics for entry/exit and hover/tap interactions.
 */
export const CognitiveItem: React.FC<CognitiveItemProps> = ({
  id,
  children,
  color = "#F97316", // Default: Vibrant Orange
  shadowColor = "#C2410C", // Default: Dark Orange
  className,
  onClick,
  isPopped = false,
  disabled = false,
  variants,
}) => {
  // Default entry/exit pop physics
  const defaultVariants: Variants = {
    hidden: { scale: 0, opacity: 0, y: 20 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 20 }
    },
    popped: {
      scale: 1.2,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <AnimatePresence>
      {!isPopped && (
        <motion.button
          layoutId={`cognitive-item-${id}`}
          variants={variants || defaultVariants}
          initial="hidden"
          animate="visible"
          exit="popped"
          disabled={disabled}
          onClick={onClick}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { 
            scale: 0.95,
            y: 6, // Move down to compress the shadow
            boxShadow: `0 0px 0 ${shadowColor}`, // Flatten the shadow
          } : {}}
          className={cn(
            "relative flex items-center justify-center select-none outline-none",
            "rounded-2xl border-2 border-white/20 px-6 py-4 font-bold text-white shadow-sm",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
            className
          )}
          style={{
            backgroundColor: color,
            // Solid, unblurred bottom drop shadow creates the 3D thickness
            boxShadow: `0 6px 0 ${shadowColor}`,
            textShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        >
          {children}
        </motion.button>
      )}
    </AnimatePresence>
  );
};
