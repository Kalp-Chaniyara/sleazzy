import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Enable gradient border effect (wrapper with gradient border) */
  gradientBorder?: boolean;
  /** Disable entrance animation */
  noAnimate?: boolean;
  children?: React.ReactNode;
}

/**
 * Glassmorphism card: rounded-2xl, backdrop-blur-xl, semi-transparent.
 * Optional gradient border using bg-gradient-to-r trick.
 */
const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, gradientBorder = false, noAnimate = false, children, ...props }, ref) => {
    const glassStyles = cn(
      'rounded-2xl backdrop-blur-xl text-textPrimary',
      'border border-white/10 dark:border-white/10',
      'bg-white/90 dark:bg-[#0A0F1F]/95',
      'shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.08)]'
    );

    const content = gradientBorder ? (
      <div
        ref={ref}
        className={cn(
          'p-[1px] rounded-2xl',
          'bg-gradient-to-r from-indigo-500/80 via-purple-500/80 to-blue-500/80',
          'dark:from-indigo-400/50 dark:via-violet-500/50 dark:to-blue-400/50',
          className
        )}
      >
        <div className={cn('rounded-2xl overflow-hidden min-h-full', glassStyles)} {...props}>
          {children}
        </div>
      </div>
    ) : (
      <div ref={ref} className={cn(glassStyles, className)} {...props}>
        {children}
      </div>
    );

    if (noAnimate) return content;

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {content}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

const GlassCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-2 p-6', className)} {...props} />
));
GlassCardHeader.displayName = 'GlassCardHeader';

const GlassCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-tight tracking-tight text-textPrimary', className)}
    {...props}
  />
));
GlassCardTitle.displayName = 'GlassCardTitle';

const GlassCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-textMuted', className)} {...props} />
));
GlassCardDescription.displayName = 'GlassCardDescription';

const GlassCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0 space-y-4', className)} {...props} />
));
GlassCardContent.displayName = 'GlassCardContent';

const GlassCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
GlassCardFooter.displayName = 'GlassCardFooter';

export { GlassCard, GlassCardHeader, GlassCardTitle, GlassCardDescription, GlassCardContent, GlassCardFooter };
