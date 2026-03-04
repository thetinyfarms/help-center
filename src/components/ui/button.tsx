import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap max-w-full font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_>_svg]:!pointer-events-none [&_>_svg]:!shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        success:
          "bg-success text-success-foreground hover:bg-success/80",
        secondary:
          "bg-secondary/60 dark:bg-secondary/30 text-secondary-foreground backdrop-blur-md hover:bg-secondary/80 dark:hover:bg-secondary/50",
        secondaryDestructive:
          "bg-secondary-destructive/50 text-secondary-destructive-foreground backdrop-blur-md hover:bg-destructive hover:text-destructive-foreground",
        secondarySuccess:
          "bg-secondary-success/50 text-secondary-success-foreground backdrop-blur-md hover:bg-success hover:text-success-foreground",
        ghost:
          "text-secondary-foreground hover:bg-secondary/60 hover:backdrop-blur-md dark:hover:bg-secondary/30",
        ghostDestructive:
          "text-secondary-destructive-foreground hover:bg-destructive hover:text-destructive-foreground",
        ghostSuccess:
          "text-secondary-success-foreground hover:bg-success hover:text-success-foreground",
        link:
          "!p-0 !gap-1 !h-auto !min-h-0 [&_>_svg]:!size-3 !rounded-none text-secondary-foreground underline underline-offset-2 hover:opacity-70",
        outline:
          "rounded-sm border-md !border-input hover:bg-secondary/80"
      },
      size: {
        default: "h-10 min-h-10 px-3 rounded-sm text-base [&_>_svg]:!size-5",
        sm: "h-8 min-h-8 px-2 rounded-xs gap-1 text-sm [&_>_svg]:!size-4",
        xs: "h-6 min-h-6 px-1.5 rounded-2xs gap-1 text-sm [&_>_svg]:!size-3.5",
        icon: "size-10 min-h-10 shrink-0 rounded-sm [&_>_svg]:!size-5",
        "icon-sm": "size-8 min-h-8 shrink-0 rounded-xs [&_>_svg]:!size-4",
        "icon-xs": "size-6 min-h-6 shrink-0 rounded-2xs [&_>_svg]:!size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  active?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, active = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), active && "active")}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
