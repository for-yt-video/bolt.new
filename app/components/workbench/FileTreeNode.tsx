import { memo } from 'react';
import type { FileNode, FolderNode } from '~/utils/fileTree';
import { NODE_PADDING_LEFT } from '~/utils/fileTree';
import { classNames } from '~/utils/classNames';

interface NodeButtonProps {
  depth: number;
  iconClasses: string;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

export const NodeButton = memo(({ depth, iconClasses, onClick, className, children }: NodeButtonProps) => (
  <button
    type="button"
    className={classNames('w-full flex items-center gap-1.5 px-2 py-1 text-left', className)}
    style={{ paddingLeft: depth * NODE_PADDING_LEFT + 8 }}
    onClick={onClick}
  >
    <span className={iconClasses} />
    {children}
  </button>
));

interface FolderProps {
  folder: FolderNode;
  collapsed: boolean;
  selected?: boolean;
  onClick: () => void;
}

export const Folder = memo(({ folder: { depth, name }, collapsed, selected = false, onClick }: FolderProps) => {
  return (
    <NodeButton
      className={classNames('group', {
        'bg-transparent text-bolt-elements-item-contentDefault hover:text-bolt-elements-item-contentActive hover:bg-bolt-elements-item-backgroundActive':
          !selected,
        'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': selected,
      })}
      depth={depth}
      iconClasses={classNames({
        'i-ph:caret-right scale-98': collapsed,
        'i-ph:caret-down scale-98': !collapsed,
      })}
      onClick={onClick}
    >
      {name}
    </NodeButton>
  );
});

interface FileProps {
  file: FileNode;
  selected: boolean;
  unsavedChanges?: boolean;
  onClick: () => void;
}

export const File = memo(({ file: { depth, name }, onClick, selected, unsavedChanges = false }: FileProps) => {
  return (
    <NodeButton
      className={classNames('group', {
        'bg-transparent hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-item-contentDefault': !selected,
        'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': selected,
      })}
      depth={depth}
      iconClasses={classNames('i-ph:file-duotone scale-98', {
        'group-hover:text-bolt-elements-item-contentActive': !selected,
      })}
      onClick={onClick}
    >
      <div
        className={classNames('flex items-center', {
          'group-hover:text-bolt-elements-item-contentActive': !selected,
        })}
      >
        <div className="flex-1 truncate pr-2">{name}</div>
        {unsavedChanges && <span className="i-ph:circle-fill scale-68 shrink-0 text-orange-500" />}
      </div>
    </NodeButton>
  );
}); 