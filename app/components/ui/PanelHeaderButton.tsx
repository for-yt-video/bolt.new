import type { ButtonHTMLAttributes } from 'react';
import { memo } from 'react';
import { classNames } from '~/utils/classNames';

interface PanelHeaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

export const PanelHeaderButton = memo(({ className, children, ...props }: PanelHeaderButtonProps) => {
  return (
    <button
      type="button"
      className={classNames(
        'flex items-center gap-2 rounded-md px-2 py-1 text-bolt-text-primary transition-colors duration-200 hover:bg-bolt-elements-background-depth-1 active:bg-bolt-elements-background-depth-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
