import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export function Button({
  className,
  variant = 'ghost',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-2xl border text-sm font-medium transition duration-200 active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary'
          ? 'border-white/10 bg-white/10 px-4 py-2.5 text-white shadow-neon hover:-translate-y-0.5 hover:border-neon-cyan/40 hover:bg-white/14'
          : 'border-white/8 bg-white/[0.03] px-3.5 py-2 text-slate-200 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.06]',
        className,
      )}
      type={type}
      {...props}
    />
  );
}
