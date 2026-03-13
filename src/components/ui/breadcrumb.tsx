import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { ChevronDown, Home, LibraryBig, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Button } from "./button"
// import { routeConfig } from "@/app/config/routes"
import Link from "next/link"
// import ThemedLogo from "@/app/components/theme/ThemedLogo"

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode
    className?: string
  }
>(({ className, ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" className={cn(className, "flex flex-col gap-1")} {...props} />)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-1 break-words",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => (
  <Button
    variant="ghost"
    size="xs"
    className={cn("font-normal text-base", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      className={cn("flex transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbPage = ({
  className,
  ...props
}: React.ComponentProps<"button">) => (
  <Button
    variant="ghost"
    size="xs"
    className={cn(className, "font-normal pointer-events-none justify-start truncate")}
    {...props}
  />
)
BreadcrumbPage.displayName = "BreadcrumbPage"

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("hidden", className)}
    {...props}
  >
    {children}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipsis"

// Auto-generate breadcrumbs based on URL
// const AutoBreadcrumb = React.forwardRef<
//   HTMLElement,
//   React.ComponentPropsWithoutRef<"nav"> & {
//     className?: string
//     current?: string
//     hasScrolled?: boolean
//   }
// >(({ className, current, hasScrolled, ...props }, ref) => {
//   const pathname = usePathname()
//   const t = useTranslations()

//   // Helper function to match dynamic routes
//   const matchRoute = React.useCallback((path: string) => {
//     // First try exact match
//     if (routeConfig[path]) {
//       return routeConfig[path]
//     }

//     // Try matching dynamic routes
//     for (const [routePattern, config] of Object.entries(routeConfig)) {
//       // Convert route pattern to regex (e.g., /community/experiment/[id] -> /community/experiment/[^/]+)
//       const pattern = routePattern.replace(/\[.*?\]/g, '[^/]+')
//       const regex = new RegExp(`^${pattern}$`)

//       if (regex.test(path)) {
//         return config
//       }
//     }

//     return null
//   }, [])

//   // Generate breadcrumb segments from pathname
//   const segments = React.useMemo(() => {
//     const paths = pathname.split('/').filter(Boolean)
//     const breadcrumbs: Array<{
//       path: string
//       config: typeof routeConfig[string]
//       isLast: boolean
//     }> = []

//     // Build cumulative paths
//     let currentPath = ''
//     paths.forEach((segment, index) => {
//       currentPath += `/${segment}`
//       const config = matchRoute(currentPath)

//       if (config) {
//         breadcrumbs.push({
//           path: currentPath,
//           config,
//           isLast: index === paths.length - 1
//         })
//       }
//     })

//     return breadcrumbs
//   }, [pathname, matchRoute])

//   // Filter secondary breadcrumbs (all segments except the last one)
//   const secondaryBreadcrumbs = segments.filter(s => !s.isLast)
//   const currentPage = matchRoute(pathname);
//   const isHome = pathname === "/";

//   // Check if route is not found by looking at all defined routes
//   const isValidRoute = React.useMemo(() => {
//     if (isHome) return true;
//     if (currentPage) return true;

//     // Check if pathname matches any route pattern in routeConfig
//     const routePatterns = Object.keys(routeConfig);
//     return routePatterns.some(pattern => {
//       const regex = new RegExp(`^${pattern.replace(/\[.*?\]/g, '[^/]+')}$`);
//       return regex.test(pathname);
//     });
//   }, [pathname, isHome, currentPage]);

//   const isNotFound = !isValidRoute;

//   return (
//     (isHome || isNotFound) ?
//       <>
//         <ThemedLogo className={cn(
//           "z-[48] fixed left-16 sm:left-[5.75rem] md:left-[6.5rem] top-[1.6rem] sm:top-9 md:top-12 max-h-5 sm:max-h-6 -mt-0.5 transition-all duration-150",
//           hasScrolled && "opacity-0 pointer-events-none -mt-2"
//         )}/>
//         <Breadcrumb
//           className={cn(
//             "z-[48] fixed bottom-2 left-2 md:top-6 md:bottom-auto md:left-[6.25rem] p-1 bg-secondary/50 dark:bg-secondary/30 rounded-xs backdrop-blur-md transition-all duration-150",
//             !hasScrolled && "opacity-0 pointer-events-none mt-2"
//           )}>
//           <BreadcrumbList>
//             <BreadcrumbLink href="/">
//               <Button variant="ghost" size="xs">
//                 <ThemedLogo className="h-[0.875rem] mt-0.5" />
//               </Button>
//             </BreadcrumbLink>
//           </BreadcrumbList>
//         </Breadcrumb>
//       </>
//     :
//       <>
//         <Breadcrumb ref={ref} className={className} {...props}>
//           <BreadcrumbList>
//             <BreadcrumbLink href="/" className="shrink-0">
//               <Button variant="ghost" size="xs">
//                 <ThemedLogo className="h-[0.875rem] mt-0.5" />
//               </Button>
//             </BreadcrumbLink>
//             <span className="text-sm disabled text-secondary-foreground">/</span>
//             {secondaryBreadcrumbs.length > 0 && (
//               <>
//                 {secondaryBreadcrumbs.map((breadcrumb) => {
//                   const Icon = breadcrumb.config.icon

//                   return (
//                     <React.Fragment key={breadcrumb.path}>
//                       <Link href={breadcrumb.path} className="flex">
//                         <BreadcrumbItem>
//                           <Icon />
//                           <span className="hidden md:inline">{t(breadcrumb.config.labelKey)}</span>
//                           {/* <ChevronDown className="opacity-secondary" /> */}
//                         </BreadcrumbItem>
//                       </Link>
//                     </React.Fragment>
//                   )
//                 })}
//                 <span className="text-sm disabled text-secondary-foreground">/</span>
//               </>
//             )}

//             {!isHome && currentPage && (
//               <BreadcrumbPage>
//                 {React.createElement(currentPage.icon)}
//                 <span className="truncate flex-1">{current ? current : t(currentPage.labelKey)}</span>
//               </BreadcrumbPage>
//             )}
//           </BreadcrumbList>
//         </Breadcrumb>
//       </>
//   )
// })
// AutoBreadcrumb.displayName = "AutoBreadcrumb"

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  // AutoBreadcrumb,
}
