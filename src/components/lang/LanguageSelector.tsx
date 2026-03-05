'use client';

import React from 'react';
import { useLanguage } from '@/app/context/LanguageContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Button, type ButtonProps } from '@/components/ui/button';
import { getLanguageOptions } from '@/i18n';
import { ChevronDown, Languages } from 'lucide-react';

const supportedLanguages = getLanguageOptions();

interface LanguageSelectorProps {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  icon?: boolean;
  subtle?: boolean;
  dropdownAlign?: "center" | "start" | "end";
  className?: string;
}

export function LanguageSelector({ variant = 'secondary', size = 'default', icon = true, subtle = false, dropdownAlign = "start", className = '' }: LanguageSelectorProps) {
  const { locale, setLocale } = useLanguage();

  const handleLanguageChange = async (value: string) => {
    await setLocale(value as any);
  };

  const currentLanguage = supportedLanguages.find(lang => lang.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size={size}
          variant={variant}
          className={className}
        >
          {icon && <Languages />}
          {!size?.includes("icon") &&
            <>
              <span className="flex-1 text-left">
                {subtle ? currentLanguage?.code.toUpperCase() || 'EN' : currentLanguage?.name || "English"}
              </span>
              <ChevronDown className="opacity-secondary"/>
            </>
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dropdownAlign}>
        {supportedLanguages.map((language) => (
          <DropdownMenuCheckboxItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            checked={locale === language.code}
          >
            {language.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
