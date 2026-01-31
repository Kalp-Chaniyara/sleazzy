import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-borderSoft bg-hoverSoft text-textPrimary",
        secondary: "border-borderSoft bg-hoverSoft text-textSecondary",
        destructive: "bg-error/10 text-error border-0",
        outline: "border border-borderSoft text-textPrimary",
        success: "bg-success/10 text-success border-0 px-2 py-1 text-xs font-medium rounded-md",
        warning: "bg-warning/10 text-warning border-0 px-2 py-1 text-xs font-medium rounded-md",
        pending: "bg-warning/10 text-warning border-0 px-2 py-1 text-xs font-medium rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = React.ComponentProps<"div"> &
  VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
