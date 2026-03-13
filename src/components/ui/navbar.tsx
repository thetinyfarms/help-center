'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Orbie } from '@/components/ai/Orbie';
import { AutoBreadcrumb } from '@/components/ui/breadcrumb';
import { routeConfig } from "@/app/config/routes";
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useAiChatContext } from '@/components/ai/AiChat';
import { useScrollDetection } from '@/app/hooks/useScrollDetection';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../auth/SupabaseAuthProvider';
import { Button } from '@/components/ui/button';
import { ChevronDown, CircleUser, FlaskConical, LogOut, Users } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase';
import { LanguageSelector } from '../lang/LanguageSelector';

export const NavbarBreadcrumbs = ({
  title,
}: {
  title?: string
}) => {
  const pathname = usePathname();
  const t = useTranslations();
  const currentPageConfig = routeConfig[pathname];
  const hasScrolled = useScrollDetection(50);

  return (
    <div
      className={cn(
        "z-[48] fixed w-full lg:w-screen flex items-start justify-start bottom-2 mt-4 md:bottom-auto md:top-6 left-2 md:left-[6.25rem] pr-[9rem] transition-all duration-150",
        hasScrolled && "mt-0"
      )}
    >
      <AutoBreadcrumb
        current={title}
        hasScrolled={hasScrolled}
        className="max-w-full md:max-w-[calc(100vw-20rem)] p-1 bg-secondary/50 dark:bg-secondary/30 rounded-xs backdrop-blur-md transition-all duration-150"
      />
    </div>
  );
}
NavbarBreadcrumbs.displayName = "NavbarBreadcrumbs"

export const Navbar = ({
  children
}: {
  children?: React.ReactNode;
}) => {
  const { orbieState, chatOpen} = useAiChatContext();

  return (
    <header className="flex items-center justify-center mx-auto w-full py-3 md:py-5 px-5 lg:px-8">
      <div className="flex items-center justify-between mx-auto w-full">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img src="/assets/logos/logo-tiny.svg" alt="tiny logo" className="size-10 md:size-12" />
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/">
              <Button variant="secondary" size="xs">
                Help Center
              </Button>
            </Link>
            <Button variant="secondary" size="xs">
              <img src="/assets/logos/logo-tinyverse-wordmark.svg" alt="tiny logo" className="h-[0.875rem] mt-0.5" />
              <ChevronDown className="opacity-secondary" />
            </Button>
            <Button variant="secondary" size="xs" className="font-medium">
              v1.5
              <ChevronDown className="opacity-secondary" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-semibold sm:block">Tinyverse</span>
          <LanguageSelector variant="ghost" size="sm" subtle dropdownAlign="end" />
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
