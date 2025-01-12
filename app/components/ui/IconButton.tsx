import type { ButtonHTMLAttributes } from 'react';
import { memo } from 'react';
import { classNames } from '~/utils/classNames';

type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: IconSize;
  children?: React.ReactNode | React.ReactNode[];
  iconClassName?: string;
  disabledClassName?: string;
}

const sizeToClassName: Record<IconSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  xxl: 'text-2xl',
};

export const IconButton = memo(
  ({
    icon,
    size = 'md',
    className,
    iconClassName,
    disabledClassName,
    disabled,
    children,
    ...props
  }: IconButtonProps) => {
    return (
      <button
        type="button"
        className={classNames(
          'flex items-center gap-2 rounded-md px-2 py-1 text-bolt-text-primary transition-colors duration-200 hover:bg-bolt-elements-background-depth-1 active:bg-bolt-elements-background-depth-2 disabled:cursor-not-allowed disabled:opacity-50',
          sizeToClassName[size],
          className,
          disabled ? disabledClassName : undefined,
        )}
        disabled={disabled}
        {...props}
      >
        <div className={classNames(icon, iconClassName)} />
        {children}
      </button>
    );
  },
);
