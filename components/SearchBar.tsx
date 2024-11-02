"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { translations } from '@/lib/i18n/translations';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        type="text"
        placeholder={t.search}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  );
}
