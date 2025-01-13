import type { Message } from 'ai';
import React, { type RefCallback, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { toast } from 'react-toastify';
import styles from './BaseChat.module.scss';
import { Messages } from './Messages.client';
import { SendButton } from './SendButton.client';
import { Menu } from '~/components/sidebar/Menu.client';
import { IconButton } from '~/components/ui/IconButton';
import { Workbench } from '~/components/workbench/Workbench.client';
import { classNames } from '~/utils/classNames';

interface BaseChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement | null> | undefined;
  messageRef?: RefCallback<HTMLDivElement> | undefined;
  scrollRef?: RefCallback<HTMLDivElement> | undefined;
  showChat?: boolean;
  chatStarted?: boolean;
  isStreaming?: boolean;
  messages?: Message[];
  enhancingPrompt?: boolean;
  promptEnhanced?: boolean;
  input?: string;
  handleStop?: () => void;
  sendMessage?: (event: React.UIEvent, messageInput?: string, images?: File[]) => void;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  enhancePrompt?: () => void;
  onSystemPromptChange?: (promptId: string) => void;
  onModelChange?: (modelId: string) => void;
}

const EXAMPLE_PROMPTS = [
  { text: 'Build a todo app in React using Tailwind' },
  { text: 'Build a simple blog using Astro' },
  { text: 'Create a cookie consent form using Material UI' },
  { text: 'Make a space invaders game' },
  { text: 'How do I center a div?' },
];

const SYSTEM_PROMPTS = [
  { id: 'default', name: 'Default', description: 'The default system prompt for Bolt with full capabilities' },
  { id: 'minimal', name: 'Minimal', description: 'A minimal system prompt for simple tasks' },
  { id: 'pirate', name: 'Pirate', description: 'A swashbuckling variant that speaks like a pirate' },
  { id: 'baby-yoda', name: 'Baby Yoda', description: 'A cute and wise variant that speaks like Baby Yoda/Grogu' },
];

const MODELS = [
  { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
];

const TEXTAREA_MIN_HEIGHT = 76;

const MAX_IMAGE_SIZE = 300; // Maximum width/height in pixels
const JPEG_QUALITY = 0.6; // JPEG quality (0.0 to 1.0)

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height && width > MAX_IMAGE_SIZE) {
        height = Math.round((height * MAX_IMAGE_SIZE) / width);
        width = MAX_IMAGE_SIZE;
      } else if (height > MAX_IMAGE_SIZE) {
        width = Math.round((width * MAX_IMAGE_SIZE) / height);
        height = MAX_IMAGE_SIZE;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }
          resolve(blob);
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      textareaRef,
      messageRef,
      scrollRef,
      showChat = true,
      chatStarted = false,
      isStreaming = false,
      enhancingPrompt = false,
      promptEnhanced = false,
      messages,
      input = '',
      sendMessage,
      handleInputChange,
      enhancePrompt,
      handleStop,
      onSystemPromptChange,
      onModelChange,
    },
    ref,
  ) => {
    const TEXTAREA_MAX_HEIGHT = chatStarted ? 400 : 200;
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [selectedPrompt, setSelectedPrompt] = useState('default');
    const [selectedModel, setSelectedModel] = useState('claude-3-5-sonnet-20241022');

    const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || []);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      try {
        // Compress images and convert to Files
        const compressedImages = await Promise.all(
          imageFiles.map(async (file) => {
            const compressedBlob = await compressImage(file);
            return new File([compressedBlob], file.name, { type: 'image/jpeg' });
          })
        );
        
        setSelectedImages(prev => [...prev, ...compressedImages]);
        
        // Create preview URLs for the compressed images
        const newPreviewUrls = compressedImages.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
      } catch (error) {
        console.error('Error compressing images:', error);
        toast.error('Failed to process images');
      }
    };

    const removeImage = (index: number) => {
      setSelectedImages(prev => prev.filter((_, i) => i !== index));
      URL.revokeObjectURL(previewUrls[index]);
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    return (
      <div
        ref={ref}
        className={classNames(
          styles.BaseChat,
          'relative flex h-full w-full overflow-hidden bg-bolt-elements-background-depth-1',
        )}
        data-chat-visible={showChat}
      >
        <ClientOnly>{() => <Menu />}</ClientOnly>
        <div ref={scrollRef} className="flex overflow-y-auto w-full h-full">
          <div className={classNames(styles.Chat, 'flex flex-col flex-grow min-w-[var(--chat-min-width)] h-full')}>
            {!chatStarted && (
              <div id="intro" className="mt-[20vh] max-w-chat mx-auto">
                <h1 className="text-5xl text-center font-bold text-bolt-elements-textPrimary mb-2">
                  Where ideas begin
                </h1>
                <p className="mb-4 text-center text-bolt-elements-textSecondary">
                  Bring ideas to life in seconds or get help on existing projects.
                </p>
              </div>
            )}
            <div
              className={classNames('pt-6 px-6', {
                'h-full flex flex-col': chatStarted,
              })}
            >
              <ClientOnly>
                {() => {
                  return chatStarted ? (
                    <Messages
                      ref={messageRef}
                      className="flex flex-col w-full flex-1 max-w-chat px-4 pb-6 mx-auto z-1"
                      messages={messages}
                      isStreaming={isStreaming}
                    />
                  ) : null;
                }}
              </ClientOnly>
              <div
                className={classNames('relative w-full max-w-chat mx-auto z-prompt', {
                  'sticky bottom-0': chatStarted,
                })}
              >
                <div
                  className={classNames(
                    'shadow-sm border border-bolt-elements-borderColor bg-bolt-elements-prompt-background backdrop-filter backdrop-blur-[8px] rounded-lg overflow-hidden',
                  )}
                >
                  {selectedImages.length > 0 && (
                    <div className="flex gap-2 p-4 overflow-x-auto">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={url} 
                            alt={`Preview ${index + 1}`} 
                            className="h-20 w-20 object-cover rounded"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-bolt-elements-background-depth-1 rounded-full p-1"
                          >
                            <div className="i-ph:x text-bolt-elements-textPrimary text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    ref={textareaRef}
                    className={`w-full pl-4 pt-4 pr-16 focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent`}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        if (event.shiftKey) {
                          return;
                        }

                        event.preventDefault();

                        sendMessage?.(event, undefined, selectedImages);
                        setSelectedImages([]);
                        setPreviewUrls(prev => {
                          prev.forEach(url => URL.revokeObjectURL(url));
                          return [];
                        });
                      }
                    }}
                    value={input}
                    onChange={(event) => {
                      handleInputChange?.(event);
                    }}
                    style={{
                      minHeight: TEXTAREA_MIN_HEIGHT,
                      maxHeight: TEXTAREA_MAX_HEIGHT,
                    }}
                    placeholder="How can Bolt help you today?"
                    translate="no"
                  />
                  <div className="flex justify-between text-sm p-4 pt-2">
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageSelect}
                      />
                      <IconButton
                        icon="i-ph:image"
                        title="Add images"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      />
                      <IconButton
                        icon="i-ph:sparkle"
                        title="Enhance prompt"
                        disabled={input.length === 0 || enhancingPrompt}
                        className={classNames({
                          'opacity-100!': enhancingPrompt,
                          'text-bolt-elements-item-contentAccent! pr-1.5 enabled:hover:bg-bolt-elements-item-backgroundAccent!':
                            promptEnhanced,
                        })}
                        onClick={() => enhancePrompt?.()}
                      >
                        {enhancingPrompt ? (
                          <>
                            <div className="i-svg-spinners:90-ring-with-bg text-bolt-elements-loader-progress text-xl"></div>
                            <div className="ml-1.5">Enhancing prompt...</div>
                          </>
                        ) : (
                          <>
                            {promptEnhanced && <div className="ml-1.5">Prompt enhanced</div>}
                          </>
                        )}
                      </IconButton>
                      <select
                        value={selectedModel}
                        onChange={(e) => {
                          setSelectedModel(e.target.value);
                          onModelChange?.(e.target.value);
                        }}
                        className="bg-transparent border border-bolt-elements-borderColor rounded-md px-2 py-1 text-bolt-elements-textPrimary focus:outline-none focus:border-bolt-elements-borderColorActive"
                      >
                        {MODELS.map((model) => (
                          <option key={model.id} value={model.id} className="bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary">
                            {model.name}
                          </option>
                        ))}
                      </select>
                      <select
                        value={selectedPrompt}
                        onChange={(e) => {
                          setSelectedPrompt(e.target.value);
                          onSystemPromptChange?.(e.target.value);
                        }}
                        className="bg-transparent border border-bolt-elements-borderColor rounded-md px-2 py-1 text-bolt-elements-textPrimary focus:outline-none focus:border-bolt-elements-borderColorActive"
                      >
                        {SYSTEM_PROMPTS.map((prompt) => (
                          <option key={prompt.id} value={prompt.id} title={prompt.description} className="bg-bolt-elements-background-depth-1 text-bolt-elements-textPrimary">
                            {prompt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <ClientOnly>
                      {() => (
                        <SendButton
                          show={input.length > 0 || selectedImages.length > 0 || isStreaming}
                          isStreaming={isStreaming}
                          onClick={(event) => {
                            if (isStreaming) {
                              handleStop?.();
                              return;
                            }

                            sendMessage?.(event, undefined, selectedImages);
                            setSelectedImages([]);
                            setPreviewUrls(prev => {
                              prev.forEach(url => URL.revokeObjectURL(url));
                              return [];
                            });
                          }}
                        />
                      )}
                    </ClientOnly>
                    {input.length > 3 ? (
                      <div className="text-xs text-bolt-elements-textTertiary">
                        Use <kbd className="kdb">Shift</kbd> + <kbd className="kdb">Return</kbd> for a new line
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="bg-bolt-elements-background-depth-1 pb-6">{/* Ghost Element */}</div>
              </div>
            </div>
            {!chatStarted && (
              <div id="examples" className="relative w-full max-w-xl mx-auto mt-8 flex justify-center">
                <div className="flex flex-col space-y-2 [mask-image:linear-gradient(to_bottom,black_0%,transparent_180%)] hover:[mask-image:none]">
                  {EXAMPLE_PROMPTS.map((examplePrompt, index) => {
                    return (
                      <button
                        key={index}
                        onClick={(event) => {
                          sendMessage?.(event, examplePrompt.text);
                        }}
                        className="group flex items-center w-full gap-2 justify-center bg-transparent text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary transition-theme"
                      >
                        {examplePrompt.text}
                        <div className="i-ph:arrow-bend-down-left" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <ClientOnly>{() => <Workbench chatStarted={chatStarted} isStreaming={isStreaming} />}</ClientOnly>
        </div>
      </div>
    );
  },
);
