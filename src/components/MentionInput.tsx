import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FileText, Book, Wrench, Database, GitBranch, ListTodo } from "lucide-react";
import { cn } from "@/lib/utils";
import { mockRequirements } from "@/data/mockData";

export interface MentionResource {
  id: string;
  type: 'requirement' | 'file' | 'tool';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  category?: string;
  data?: Record<string, unknown>;
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onMentionSelect?: (resource: MentionResource) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
}

export interface MentionInputRef {
  focus: () => void;
  blur: () => void;
}

const MentionInput = forwardRef<MentionInputRef, MentionInputProps>(({
  value,
  onChange,
  onMentionSelect,
  placeholder,
  rows = 3,
  className,
  onKeyDown,
  disabled
}, ref) => {
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const [mentionSearch, setMentionSearch] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [activeTab, setActiveTab] = useState<'all' | 'requirement' | 'file' | 'tool'>('all');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const [selectedResources, setSelectedResources] = useState<MentionResource[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [highlightedTabIndex, setHighlightedTabIndex] = useState(0);
  const [useRichText, setUseRichText] = useState(false);
  const highlightedItemRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => {
      if (useRichText) {
        editableRef.current?.focus();
      } else {
        textareaRef.current?.focus();
      }
    },
    blur: () => {
      if (useRichText) {
        editableRef.current?.blur();
      } else {
        textareaRef.current?.blur();
      }
    },
  }));

  const requirementResources: MentionResource[] = mockRequirements.map(req => ({
    id: req.id,
    type: 'requirement' as const,
    title: req.title,
    description: req.description,
    category: '需求列表',
    icon: <ListTodo className="h-5 w-5 text-purple-500" />,
    data: req,
  }));

  const fileResources: MentionResource[] = [
    {
      id: 'file-1',
      type: 'file',
      title: '开启你和AI共用的收藏夹.md',
      category: '收藏夹文件',
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 'file-2',
      type: 'file',
      title: '技术架构设计文档',
      category: '收藏夹文件',
      icon: <FileText className="h-5 w-5 text-blue-500" />,
    },
    {
      id: 'file-3',
      type: 'file',
      title: 'React 最佳实践',
      category: '收藏夹文件',
      icon: <Book className="h-5 w-5 text-green-500" />,
    },
  ];

  const toolResources: MentionResource[] = [
    {
      id: 'tool-1',
      type: 'tool',
      title: '飞书云文档',
      description: '搜索和引用飞书文档',
      category: '工具',
      icon: <div className="h-5 w-5 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">飞</div>,
    },
    {
      id: 'tool-2',
      type: 'tool',
      title: 'Wiki',
      description: '内部知识库文档',
      category: '工具',
      icon: <Book className="h-5 w-5 text-green-500" />,
    },
    {
      id: 'tool-3',
      type: 'tool',
      title: '落兵台',
      description: 'API 接口文档和测试',
      category: '工具',
      icon: <Wrench className="h-5 w-5 text-orange-500" />,
    },
    {
      id: 'tool-4',
      type: 'tool',
      title: 'GitLab',
      description: '代码仓库和 MR 管理',
      category: '工具',
      icon: <GitBranch className="h-5 w-5 text-orange-600" />,
    },
  ];

  const mockResources: MentionResource[] = [
    ...requirementResources,
    ...fileResources,
    ...toolResources,
  ];

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(mentionSearch.toLowerCase()) ||
      resource.description?.toLowerCase().includes(mentionSearch.toLowerCase());
    const matchesTab = activeTab === 'all' || resource.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPos = e.target.selectionStart;

    onChange(newValue);
    setCursorPosition(cursorPos);

    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);

      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionSearch(textAfterAt);
        setShowMentionMenu(true);
        setHighlightedIndex(0);

        if (textareaRef.current) {
          const rect = textareaRef.current.getBoundingClientRect();
          const lines = textBeforeCursor.split('\n');
          const currentLine = lines.length;
          const lineHeight = 24;

          setMenuPosition({
            top: rect.top + (currentLine * lineHeight) - textareaRef.current.scrollTop,
            left: rect.left + 10,
          });
        }
      } else {
        setShowMentionMenu(false);
      }
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleSelectResource = (resource: MentionResource) => {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    const newValue =
      value.slice(0, lastAtIndex) +
      `@${resource.title}  ` +
      textAfterCursor;

    onChange(newValue);
    setShowMentionMenu(false);
    setMentionSearch("");
    setUseRichText(true);

    setSelectedResources(prev => {
      if (!prev.find(r => r.id === resource.id)) {
        return [...prev, resource];
      }
      return prev;
    });

    if (onMentionSelect) {
      onMentionSelect(resource);
    }

    setTimeout(() => {
      const newCursorPos = lastAtIndex + resource.title.length + 3;

      if (editableRef.current) {
        editableRef.current.focus();

        const setCursorPosition = (element: HTMLElement, position: number) => {
          const range = document.createRange();
          const sel = window.getSelection();
          let currentPos = 0;

          const findTextNode = (node: Node): { node: Node; offset: number } | null => {
            if (node.nodeType === Node.TEXT_NODE) {
              const textLength = node.textContent?.length || 0;
              if (currentPos + textLength >= position) {
                return { node, offset: position - currentPos };
              }
              currentPos += textLength;
            } else {
              for (let i = 0; i < node.childNodes.length; i++) {
                const result = findTextNode(node.childNodes[i]);
                if (result) return result;
              }
            }
            return null;
          };

          const result = findTextNode(element);
          if (result) {
            range.setStart(result.node, result.offset);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        };

        setCursorPosition(editableRef.current, newCursorPos);
      } else if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 50);
  };

  const removeResource = (resourceId: string) => {
    setSelectedResources(prev => prev.filter(r => r.id !== resourceId));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(e.target as Node)) {
        setShowMentionMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      requirement: '需求',
      file: '文件',
      tool: '工具',
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      requirement: 'bg-purple-500/10 text-purple-600 border-purple-200',
      file: 'bg-blue-500/10 text-blue-600 border-blue-200',
      tool: 'bg-orange-500/10 text-orange-600 border-orange-200',
    };
    return colors[type] || colors.file;
  };

  const groupedResources = filteredResources.reduce((acc, resource) => {
    const category = resource.category || '其他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, MentionResource[]>);

  const tabs = ['all', 'requirement', 'file', 'tool'] as const;

  const renderTextWithMentions = useMemo(() => {
    if (!value) return '';

    const mentionPattern = /@([^\s]+)/g;
    let result = value;
    const matches: Array<{ start: number; end: number; text: string; isResource: boolean }> = [];

    let match;
    while ((match = mentionPattern.exec(value)) !== null) {
      const mentionText = match[0];
      const mentionTitle = match[1];
      const resource = selectedResources.find(r => r.title === mentionTitle);

      if (resource) {
        matches.push({
          start: match.index,
          end: match.index + mentionText.length,
          text: mentionText,
          isResource: true
        });
      }
    }

    let offset = 0;
    matches.forEach(m => {
      const before = result.slice(0, m.start + offset);
      const after = result.slice(m.end + offset);
      const replacement = `<span class="text-blue-600 font-medium">${m.text}</span>`;
      result = before + replacement + after;
      offset += replacement.length - m.text.length;
    });

    return result;
  }, [value, selectedResources]);

  const saveCursorPosition = (): number => {
    const selection = window.getSelection();
    if (!selection || !editableRef.current || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editableRef.current);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  };

  const restoreCursorPosition = (position: number) => {
    if (!editableRef.current) return;

    const range = document.createRange();
    const sel = window.getSelection();
    let currentPos = 0;

    const findPosition = (node: Node): { node: Node; offset: number } | null => {
      if (node.nodeType === Node.TEXT_NODE) {
        const textLength = node.textContent?.length || 0;
        if (currentPos + textLength >= position) {
          return { node, offset: position - currentPos };
        }
        currentPos += textLength;
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          const result = findPosition(node.childNodes[i]);
          if (result) return result;
        }
      }
      return null;
    };

    const result = findPosition(editableRef.current);
    if (result) {
      range.setStart(result.node, result.offset);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  };

  const handleEditableInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (isComposing) return;

    const newValue = e.currentTarget.textContent || '';
    const cursorPos = saveCursorPosition();

    onChange(newValue);
    setCursorPosition(cursorPos);

    requestAnimationFrame(() => {
      restoreCursorPosition(cursorPos);
    });

    const textBeforeCursor = newValue.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);

      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionSearch(textAfterAt);
        setShowMentionMenu(true);
        setHighlightedIndex(0);

        if (editableRef.current) {
          const rect = editableRef.current.getBoundingClientRect();
          const lines = textBeforeCursor.split('\n');
          const currentLine = lines.length;
          const lineHeight = 24;

          setMenuPosition({
            top: rect.top + (currentLine * lineHeight) - editableRef.current.scrollTop,
            left: rect.left + 10,
          });
        }
      } else {
        setShowMentionMenu(false);
      }
    } else {
      setShowMentionMenu(false);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLDivElement>) => {
    setIsComposing(false);
    handleEditableInput(e as any);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
    if (!showMentionMenu) {
      if (onKeyDown) onKeyDown(e);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const newIndex = prev < filteredResources.length - 1 ? prev + 1 : prev;
        setTimeout(() => {
          highlightedItemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, 0);
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const newIndex = prev > 0 ? prev - 1 : 0;
        setTimeout(() => {
          highlightedItemRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }, 0);
        return newIndex;
      });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const newTabIndex = highlightedTabIndex > 0 ? highlightedTabIndex - 1 : 0;
      setHighlightedTabIndex(newTabIndex);
      setActiveTab(tabs[newTabIndex]);
      setHighlightedIndex(0);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const newTabIndex = highlightedTabIndex < tabs.length - 1 ? highlightedTabIndex + 1 : highlightedTabIndex;
      setHighlightedTabIndex(newTabIndex);
      setActiveTab(tabs[newTabIndex]);
      setHighlightedIndex(0);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const nextTabIndex = (highlightedTabIndex + 1) % tabs.length;
      setHighlightedTabIndex(nextTabIndex);
      setActiveTab(tabs[nextTabIndex]);
      setHighlightedIndex(0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResources[highlightedIndex]) {
        handleSelectResource(filteredResources[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowMentionMenu(false);
    } else {
      if (onKeyDown) onKeyDown(e);
    }
  };

  return (
    <div className="relative w-full">
      {useRichText ? (
        <div className="relative">
          {!value && placeholder && (
            <div className="absolute top-2 left-3 text-sm text-muted-foreground pointer-events-none">
              {placeholder}
            </div>
          )}
          <div
            ref={editableRef}
            contentEditable={!disabled}
            onInput={handleEditableInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            onKeyDown={handleKeyDown}
            className={cn(
              "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "whitespace-pre-wrap break-words",
              className
            )}
            style={{ minHeight: `${rows * 24}px` }}
            dangerouslySetInnerHTML={{ __html: renderTextWithMentions }}
          />
        </div>
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={rows}
          className={cn("resize-none", className)}
          disabled={disabled}
        />
      )}

      {showMentionMenu && (
        <div
          className="fixed z-50"
          style={{
            top: `${menuPosition.top + 30}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          <div className="w-[500px] bg-popover border rounded-lg shadow-lg overflow-hidden">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="搜索需求/文件/工具"
                value={mentionSearch}
                onValueChange={setMentionSearch}
                className="border-b"
              />

              <div className="flex items-center gap-1 px-3 py-2 border-b bg-muted/30">
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setHighlightedTabIndex(0);
                    setHighlightedIndex(0);
                  }}
                  className={cn(
                    "px-4 py-1.5 text-sm rounded-md transition-colors",
                    activeTab === 'all'
                      ? "bg-background shadow-sm font-medium"
                      : "text-muted-foreground hover:text-foreground",
                    highlightedTabIndex === 0 && showMentionMenu && "ring-2 ring-primary"
                  )}
                >
                  全部
                </button>
                <button
                  onClick={() => {
                    setActiveTab('requirement');
                    setHighlightedTabIndex(1);
                    setHighlightedIndex(0);
                  }}
                  className={cn(
                    "px-4 py-1.5 text-sm rounded-md transition-colors",
                    activeTab === 'requirement'
                      ? "bg-background shadow-sm font-medium"
                      : "text-muted-foreground hover:text-foreground",
                    highlightedTabIndex === 1 && showMentionMenu && "ring-2 ring-primary"
                  )}
                >
                  需求
                </button>
                <button
                  onClick={() => {
                    setActiveTab('file');
                    setHighlightedTabIndex(2);
                    setHighlightedIndex(0);
                  }}
                  className={cn(
                    "px-4 py-1.5 text-sm rounded-md transition-colors",
                    activeTab === 'file'
                      ? "bg-background shadow-sm font-medium"
                      : "text-muted-foreground hover:text-foreground",
                    highlightedTabIndex === 2 && showMentionMenu && "ring-2 ring-primary"
                  )}
                >
                  文件
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tool');
                    setHighlightedTabIndex(3);
                    setHighlightedIndex(0);
                  }}
                  className={cn(
                    "px-4 py-1.5 text-sm rounded-md transition-colors",
                    activeTab === 'tool'
                      ? "bg-background shadow-sm font-medium"
                      : "text-muted-foreground hover:text-foreground",
                    highlightedTabIndex === 3 && showMentionMenu && "ring-2 ring-primary"
                  )}
                >
                  工具
                </button>
              </div>

              <CommandList className="max-h-[400px]">
                <CommandEmpty>未找到相关资源</CommandEmpty>

                {Object.entries(groupedResources).map(([category, resources]) => (
                  <CommandGroup key={category} heading={category}>
                    {resources.map((resource, idx) => {
                      const globalIndex = filteredResources.findIndex(r => r.id === resource.id);
                      const isHighlighted = globalIndex === highlightedIndex;
                      return (
                        <CommandItem
                          key={resource.id}
                          ref={isHighlighted ? highlightedItemRef : null}
                          onSelect={() => handleSelectResource(resource)}
                          className={cn(
                            "cursor-pointer py-3",
                            "data-[selected=true]:bg-transparent data-[selected=true]:text-foreground",
                            isHighlighted && "!bg-accent !text-accent-foreground"
                          )}
                        >
                          <div className="flex items-center gap-3 w-full">
                            {resource.icon}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{resource.title}</div>
                              {resource.description && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {resource.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </div>
        </div>
      )}
    </div>
  );
});

MentionInput.displayName = "MentionInput";

export default MentionInput;














































