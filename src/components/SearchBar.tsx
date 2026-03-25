import { Search } from 'lucide-react';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <label className="group flex h-12 w-full cursor-text items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-sm text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition duration-200 hover:border-white/15 focus-within:border-neon-cyan/50 focus-within:bg-white/[0.05] focus-within:shadow-[0_0_0_1px_rgba(77,226,255,0.18)]">
      <Search className="h-4 w-4 text-slate-500 transition group-focus-within:text-neon-cyan" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Поиск по владельцу, компании, ИНН..."
        className="h-full w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
      />
    </label>
  );
}
