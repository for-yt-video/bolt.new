import { memo, useEffect, useRef, useState } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { BreadcrumbSegment } from './BreadcrumbSegment';
import { BreadcrumbDropdown } from './BreadcrumbDropdown';
import type { FileMap } from '~/lib/stores/files';
import { WORK_DIR_REGEX } from '~/utils/constants';
import { renderLogger } from '~/utils/logger';

interface FileBreadcrumbProps {
  files?: FileMap;
  pathSegments?: string[];
  onFileSelect?: (filePath: string) => void;
}

export const FileBreadcrumb = memo<FileBreadcrumbProps>(({ files, pathSegments = [], onFileSelect }) => {
  renderLogger.trace('FileBreadcrumb');

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const segmentRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const handleSegmentClick = (index: number) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        activeIndex !== null &&
        !contextMenuRef.current?.contains(event.target as Node) &&
        !segmentRefs.current.some((ref) => ref?.contains(event.target as Node))
      ) {
        setActiveIndex(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeIndex]);

  if (files === undefined || pathSegments.length === 0) {
    return null;
  }

  return (
    <div className="flex">
      {pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;
        const path = pathSegments.slice(0, index).join('/');

        if (!WORK_DIR_REGEX.test(path)) {
          return null;
        }

        const isActive = activeIndex === index;

        return (
          <div key={index} className="relative flex items-center">
            <DropdownMenu.Root open={isActive} modal={false}>
              <BreadcrumbSegment
                segment={segment}
                isLast={isLast}
                isActive={isActive}
                onClick={() => handleSegmentClick(index)}
                segmentRef={(ref) => {
                  segmentRefs.current[index] = ref;
                  return undefined;
                }}
              />
              <BreadcrumbDropdown
                isActive={isActive}
                path={path}
                segment={segment}
                files={files}
                contextMenuRef={(ref) => {
                  if (contextMenuRef.current !== ref) {
                    contextMenuRef.current = ref;
                  }
                }}
                onFileSelect={onFileSelect}
                onClose={() => setActiveIndex(null)}
              />
            </DropdownMenu.Root>
          </div>
        );
      })}
    </div>
  );
});
