import { memo, useRef, useState } from 'react';
import { Panel, type ImperativePanelHandle } from 'react-resizable-panels';
import { Terminal, type TerminalRef } from './terminal/Terminal';
import { IconButton } from '~/components/ui/IconButton';
import { workbenchStore } from '~/lib/stores/workbench';
import type { Theme } from '~/types/theme';
import { classNames } from '~/utils/classNames';

interface TerminalPanelProps {
  showTerminal: boolean;
  theme: Theme;
  defaultSize: number;
  terminalToggledByShortcut: React.MutableRefObject<boolean>;
}

const MAX_TERMINALS = 3;

export const TerminalPanel = memo<TerminalPanelProps>(({ showTerminal, theme, defaultSize, terminalToggledByShortcut }) => {
  const terminalRefs = useRef<Array<TerminalRef | null>>([]);
  const terminalPanelRef = useRef<ImperativePanelHandle>(null);
  const [activeTerminal, setActiveTerminal] = useState(0);
  const [terminalCount, setTerminalCount] = useState(1);

  const addTerminal = () => {
    if (terminalCount < MAX_TERMINALS) {
      setTerminalCount(terminalCount + 1);
      setActiveTerminal(terminalCount);
    }
  };

  return (
    <Panel
      ref={terminalPanelRef}
      defaultSize={showTerminal ? defaultSize : 0}
      minSize={10}
      collapsible
      onExpand={() => {
        if (!terminalToggledByShortcut.current) {
          workbenchStore.toggleTerminal(true);
        }
      }}
      onCollapse={() => {
        if (!terminalToggledByShortcut.current) {
          workbenchStore.toggleTerminal(false);
        }
      }}
    >
      <div className="h-full">
        <div className="bg-bolt-elements-terminals-background h-full flex flex-col">
          <div className="flex items-center bg-bolt-elements-background-depth-2 border-y border-bolt-elements-borderColor gap-1.5 min-h-[34px] p-2">
            {Array.from({ length: terminalCount }, (_, index) => {
              const isActive = activeTerminal === index;

              return (
                <button
                  key={index}
                  className={classNames(
                    'flex items-center text-sm cursor-pointer gap-1.5 px-3 py-2 h-full whitespace-nowrap rounded-full',
                    {
                      'bg-bolt-elements-terminals-buttonBackground text-bolt-elements-textPrimary': isActive,
                      'bg-bolt-elements-background-depth-2 text-bolt-elements-textSecondary hover:bg-bolt-elements-terminals-buttonBackground':
                        !isActive,
                    },
                  )}
                  onClick={() => setActiveTerminal(index)}
                >
                  <div className="i-ph:terminal-window-duotone text-lg" />
                  Terminal {terminalCount > 1 && index + 1}
                </button>
              );
            })}
            {terminalCount < MAX_TERMINALS && <IconButton icon="i-ph:plus" size="md" onClick={addTerminal} />}
            <IconButton
              className="ml-auto"
              icon="i-ph:caret-down"
              title="Close"
              size="md"
              onClick={() => workbenchStore.toggleTerminal(false)}
            />
          </div>
          {Array.from({ length: terminalCount }, (_, index) => {
            const isActive = activeTerminal === index;

            return (
              <Terminal
                key={index}
                className={classNames('h-full overflow-hidden', {
                  hidden: !isActive,
                })}
                ref={(ref) => {
                  terminalRefs.current[index] = ref;
                }}
                onTerminalReady={(terminal) => workbenchStore.attachTerminal(terminal)}
                onTerminalResize={(cols, rows) => workbenchStore.onTerminalResize(cols, rows)}
                theme={theme}
              />
            );
          })}
        </div>
      </div>
    </Panel>
  );
}); 