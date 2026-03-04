import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"

const CardContext = React.createContext<{ variant?: CardProps['variant'] }>({})

const cardVariants = cva(
  "card relative flex flex-col bg-card dark:bg-card/70 border border-md shadow-lg text-card-foreground overflow-hidden backdrop-blur-md outline-none origin-bottom-right transition-all duration-150 [transition-property:width_0s,height_0s,transform_0s]",
  {
    variants: {
      variant: {
        default:
          "shadow-border",
        muted:
          "!border-muted shadow-muted",
        accent:
          "!border-ring shadow-ring",
        fill:
          "!bg-muted/70 !border-muted/40 !shadow-none",
        ghost:
          "!border-transparent !bg-transparent shadow-none backdrop-blur-none ![--card-padding:0.25rem]"
      },
      size: {
        default: "rounded-md [--card-padding:1rem]",
        lg: "rounded-lg [--card-padding:1.5rem]",
        sm: "rounded-sm [--card-padding:0.5rem] shadow-md",
        xs: "rounded-xs [--card-padding:0.25rem] shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
}

const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(({ className, variant, size, ...props }, ref) => (
  <CardContext.Provider value={{ variant }}>
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, className }), "flex flex-col")}
      {...props}
    />
  </CardContext.Provider>
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(CardContext);

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-1 p-[var(--card-padding)] transition-all duration-100",
        variant === 'ghost' && "!p-2",
        className
      )}
      {...props}
    />
  );
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("inline-flex items-start font-semibold leading-[120%] font-bold w-full", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-3 text-sm opacity-secondary", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(CardContext);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex flex-col flex-1 min-h-0 p-[var(--card-padding)] gap-2 transition-all duration-100",
        variant === 'ghost' && "px-1",
        className
      )}
      {...props}
    />
  );
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    asButton?: boolean
  }
>(({ className, asButton, ...props }, ref) => {
  const { variant } = React.useContext(CardContext);

  return (
    <div
      ref={ref}
      className={cn(
        "flex gap-1 items-center shrink-0 h-8 transition-all duration-100 text-muted-foreground text-xs px-[var(--card-padding)]",
        variant === 'ghost' && "px-1 !bg-transparent",
        "bg-secondary/30 [&_svg]:size-3.5",
        asButton && "px-0",
        className
      )}
      {...props}
    />
  );
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
