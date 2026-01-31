import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  asChild?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'gradient' | 'outline' | 'ghost';
  children?: React.ReactNode;
}

/**
 * Gradient button with glow shadow, hover gradient shift, Framer Motion tap.
 */
const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  (
    {
      className,
      asChild = false,
      size = 'default',
      variant = 'gradient',
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : motion.button;

    const sizeClasses = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-lg px-3 text-sm',
      lg: 'h-11 rounded-xl px-6 text-base',
      icon: 'h-10 w-10',
    };

    const baseClasses =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1F] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

    const variantClasses = {
      gradient:
        'relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white shadow-[0_0_30px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_40px_-5px_rgba(139,92,246,0.6)] hover:scale-[1.02] active:scale-[0.98]',
      outline:
        'border border-white/20 text-textPrimary hover:bg-white/5 hover:border-white/30 dark:border-white/20 dark:hover:bg-white/10',
      ghost:
        'text-textPrimary hover:bg-white/5 dark:hover:bg-white/10',
    };

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)}
          {...(props as React.ComponentPropsWithoutRef<typeof Slot>)}
        >
          {children}
        </Slot>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, sizeClasses[size], variantClasses[variant], 'relative', className)}
        whileHover={variant === 'gradient' ? { scale: 1.02 } : {}}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </motion.button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export { GradientButton };
