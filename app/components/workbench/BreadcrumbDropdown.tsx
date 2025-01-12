import { memo } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { AnimatePresence, motion } from 'framer-motion';
import { FileTree } from './FileTree';
import type { FileMap } from '~/lib/stores/files';

const contextMenuVariants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', duration: 0.2 },
  },
  close: {
    opacity: 0,
    scale: 0.9,
    transition: { type: 'spring', duration: 0.2 },
  },
};

interface BreadcrumbDropdownProps {
  isActive: boolean;
  path: string;
  segment: string;
  files: FileMap;
  contextMenuRef: (ref: HTMLDivElement | null) => void;
  onFileSelect?: (filePath: string) => void;
  onClose: () => void;
}

export const BreadcrumbDropdown = memo<BreadcrumbDropdownProps>(
  ({ isActive, path, segment, files, contextMenuRef, onFileSelect, onClose }) => {
    return (
      <AnimatePresence>
        {isActive && (
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="z-file-tree-breadcrumb" asChild align="start" side="bottom" avoidCollisions={false}>
              <motion.div ref={contextMenuRef} initial="close" animate="open" exit="close" variants={contextMenuVariants}>
                <div className="rounded-lg overflow-hidden">
                  <div className="max-h-[50vh] min-w-[300px] overflow-scroll bg-bolt-elements-background-depth-1 border border-bolt-elements-borderColor shadow-sm rounded-lg">
                    <FileTree
                      files={files}
                      hideRoot
                      rootFolder={path}
                      collapsed
                      allowFolderSelection
                      selectedFile={`${path}/${segment}`}
                      onFileSelect={(filePath) => {
                        onClose();
                        onFileSelect?.(filePath);
                      }}
                    />
                  </div>
                </div>
                <DropdownMenu.Arrow className="fill-bolt-elements-borderColor" />
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    );
  },
); 