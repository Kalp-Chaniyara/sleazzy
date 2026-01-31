import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar p-6 rounded-xl [--cell-size:2.75rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 rounded-lg text-textMuted hover:text-textPrimary hover:bg-hoverSoft aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 rounded-lg text-textMuted hover:text-textPrimary hover:bg-hoverSoft aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-brand border-borderSoft has-focus:ring-2 has-focus:ring-brand/30 relative rounded-lg",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-semibold text-textPrimary",
          captionLayout === "label"
            ? "text-base"
            : "[&>svg]:text-textMuted flex h-8 items-center gap-1 rounded-lg pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-textMuted flex-1 select-none rounded-lg text-xs font-medium uppercase tracking-wider",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-textMuted select-none text-xs",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-brand/10 rounded-l-lg",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-brand/5", defaultClassNames.range_middle),
        range_end: cn("bg-brand/10 rounded-r-lg", defaultClassNames.range_end),
        today: cn(
          "bg-brand/5 text-brand font-semibold rounded-lg border-2 border-brand/30 data-[selected=true]:bg-brand data-[selected=true]:text-white data-[selected=true]:border-brand data-[selected=true]:rounded-lg",
          defaultClassNames.today
        ),
        outside: cn(
          "text-textMuted/70 aria-selected:text-textMuted/70",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-textMuted/50 opacity-60 cursor-not-allowed",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isSelected = modifiers.selected && 
    !modifiers.range_start && 
    !modifiers.range_end && 
    !modifiers.range_middle
  const isRangeStart = modifiers.range_start
  const isRangeEnd = modifiers.range_end
  const isRangeMiddle = modifiers.range_middle
  const isDisabled = modifiers.disabled || modifiers.outside
  const isToday = modifiers.today

  return (
    <motion.div
      whileHover={!isDisabled && !isSelected && !isRangeStart && !isRangeEnd ? {
        scale: 1.05,
        transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] }
      } : {}}
      whileTap={!isDisabled && !isSelected ? {
        scale: 0.95,
        transition: { duration: 0.1 }
      } : {}}
      className="w-full h-full flex items-center justify-center"
    >
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        data-day={day.date.toLocaleDateString()}
        data-selected-single={isSelected}
        data-range-start={isRangeStart}
        data-range-end={isRangeEnd}
        data-range-middle={isRangeMiddle}
        className={cn(
          // Base styles
          "flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-0.5 font-medium leading-none rounded-lg transition-all duration-200 relative text-textPrimary",
          // Selected state
          "data-[selected-single=true]:bg-brand data-[selected-single=true]:text-white data-[selected-single=true]:font-semibold data-[selected-single=true]:shadow-sm",
          // Range states
          "data-[range-middle=true]:bg-brand/10 data-[range-middle=true]:text-brand data-[range-middle=true]:rounded-none",
          "data-[range-start=true]:bg-brand data-[range-start=true]:text-white data-[range-start=true]:font-semibold data-[range-start=true]:rounded-l-lg data-[range-start=true]:shadow-sm",
          "data-[range-end=true]:bg-brand data-[range-end=true]:text-white data-[range-end=true]:font-semibold data-[range-end=true]:rounded-r-lg data-[range-end=true]:shadow-sm",
          // Focus state
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:z-10",
          // Hover state
          !isSelected && !isRangeStart && !isRangeEnd && !isDisabled && "hover:bg-hoverSoft hover:text-textPrimary",
          // Today indicator
          isToday && !isSelected && "border-2 border-brand/50 bg-brand/5",
          // Disabled
          isDisabled && "opacity-50",
          // Text styling
          "[&>span]:text-[10px] [&>span]:opacity-80 data-[selected-single=true]:[&>span]:opacity-100 data-[selected-single=true]:[&>span]:font-semibold",
          defaultClassNames.day,
          className
        )}
        {...props}
      />
    </motion.div>
  )
}

export { Calendar, CalendarDayButton }
