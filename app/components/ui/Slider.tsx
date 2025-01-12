import type { ButtonHTMLAttributes } from 'react';
import { memo } from 'react';
import { classNames } from '~/utils/classNames';

export interface SliderOptions<T extends string> {
  left: {
    value: T;
    text: string;
  };
  right: {
    value: T;
    text: string;
  };
}

interface SliderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export interface SliderProps<T extends string> {
  selected: T;
  options: SliderOptions<T>;
  setSelected: (value: T) => void;
}

const SliderButton = memo(({ selected, children, ...props }: SliderButtonProps) => {
  return (
    <button
      type="button"
      className={classNames(
        'flex items-center gap-2 rounded-md px-2 py-1 text-bolt-text-primary transition-colors duration-200 hover:bg-bolt-elements-background-depth-1 active:bg-bolt-elements-background-depth-2 disabled:cursor-not-allowed disabled:opacity-50',
        selected ? 'bg-bolt-elements-background-depth-1' : undefined,
      )}
      {...props}
    >
      {children}
    </button>
  );
});

export const Slider = memo(<T extends string>({ selected, options, setSelected }: SliderProps<T>) => {
  return (
    <div className="flex items-center gap-1">
      <SliderButton selected={selected === options.left.value} onClick={() => setSelected(options.left.value)}>
        {options.left.text}
      </SliderButton>
      <SliderButton selected={selected === options.right.value} onClick={() => setSelected(options.right.value)}>
        {options.right.text}
      </SliderButton>
    </div>
  );
});
