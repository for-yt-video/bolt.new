import { memo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { classNames } from '~/utils/classNames';

interface BreadcrumbSegmentProps {
  segment: string;
  isLast: boolean;
  isActive: boolean;
  onClick: () => void;
  segmentRef: (ref: HTMLSpanElement | null) => void;
}

export const BreadcrumbSegment = memo<BreadcrumbSegmentProps>(({ segment, isLast, isActive, onClick, segmentRef }) => {
  return (
    <>
      <DropdownMenu.Trigger asChild>
        <span
          ref={segmentRef}
          className={classNames('flex items-center gap-1.5 cursor-pointer shrink-0', {
            'text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary': !isActive,
            'text-bolt-elements-textPrimary underline': isActive,
            'pr-4': isLast,
          })}
          onClick={onClick}
        >
          {isLast && <div className="i-ph:file-duotone" />}
          {segment}
        </span>
      </DropdownMenu.Trigger>
      {!isLast && <span className="i-ph:caret-right inline-block mx-1" />}
    </>
  );
}); 