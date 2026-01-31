import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  /** Main heading */
  title: string;
  /** Subtitle/description */
  subtitle?: string;
  /** Optional CTA element */
  cta?: React.ReactNode;
  /** Optional floating mock card element */
  floatingCard?: React.ReactNode;
  /** Additional class names */
  className?: string;
}

/**
 * Hero section with animated gradient glow behind text,
 * heading fades up using Framer Motion,
 * optional floating UI element with subtle y-axis motion.
 */
export function HeroSection({ title, subtitle, cta, floatingCard, className }: HeroSectionProps) {
  return (
    <section
      className={cn(
        'relative py-16 sm:py-24 lg:py-32 overflow-hidden',
        className
      )}
    >
      {/* Animated gradient glow behind text */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="w-[600px] h-[400px] rounded-full blur-[120px] opacity-30"
          style={{
            background:
              'radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, rgba(139, 92, 246, 0.3) 40%, rgba(56, 189, 248, 0.2) 70%, transparent 100%)',
          }}
        />
      </motion.div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-textPrimary"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="mt-6 text-lg sm:text-xl text-textSecondary max-w-2xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {subtitle}
            </motion.p>
          )}
          {cta && (
            <motion.div
              className="mt-10 flex flex-wrap gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {cta}
            </motion.div>
          )}
        </div>

        {/* Floating UI mock card with subtle y-axis motion */}
        {floatingCard && (
          <motion.div
            className="flex-shrink-0 w-full max-w-md lg:max-w-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 0.6, delay: 0.2 },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            {floatingCard}
          </motion.div>
        )}
      </div>
    </section>
  );
}
