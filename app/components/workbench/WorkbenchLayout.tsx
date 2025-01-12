import { motion, type Variants } from 'framer-motion';
import { memo } from 'react';
import { classNames } from '~/utils/classNames';
import { cubicEasingFn } from '~/utils/easings';

const workbenchVariants: Variants = {
  closed: {
    width: 0,
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
  open: {
    width: 'var(--workbench-width)',
    transition: {
      duration: 0.2,
      ease: cubicEasingFn,
    },
  },
};

interface WorkbenchLayoutProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const WorkbenchLayout = memo(({ isOpen, children }: WorkbenchLayoutProps) => {
  return (
    <motion.div
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      variants={workbenchVariants}
      className="z-workbench"
    >
      <div
        className={classNames(
          'fixed top-[calc(var(--header-height)+1.5rem)] bottom-6 w-[var(--workbench-inner-width)] mr-4 z-0 transition-[left,width] duration-200 bolt-ease-cubic-bezier',
          {
            'left-[var(--workbench-left)]': isOpen,
            'left-[100%]': !isOpen,
          },
        )}
      >
        <div className="absolute inset-0 px-6">
          <div className="h-full flex flex-col bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor shadow-sm rounded-lg overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}); 