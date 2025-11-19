import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  GitBranch,
  Edit,
  Save,
  X,
  FileText,
  User,
  Calendar,
  Tag
} from "lucide-react";
import { KnowledgeItem } from "@/types/knowledge";
import { cn } from "@/lib/utils";

interface KnowledgeViewModalProps {
  open: boolean;
  onClose: () => void;
  knowledge: KnowledgeItem | null;
  mode: 'view' | 'edit';
  onSave?: (updates: Partial<KnowledgeItem>) => void;
}

export default function KnowledgeViewModal({
  open,
  onClose,
  knowledge,
  mode,
  onSave
}: KnowledgeViewModalProps) {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [title, setTitle] = useState(knowledge?.title || '');
  const [content, setContent] = useState(knowledge?.content || '');
  const [tags, setTags] = useState(knowledge?.tags?.join(', ') || '');

  // 当knowledge变化时更新本地状态
  useEffect(() => {
    if (knowledge) {
      setTitle(knowledge.title);
      setContent(knowledge.content);
      setTags(knowledge.tags?.join(', ') || '');
      setIsEditing(mode === 'edit');
    }
  }, [knowledge, mode]);

  const handleSave = () => {
    if (onSave && knowledge) {
      const updates = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
        updatedAt: new Date().toISOString()
      };
      onSave(updates);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (knowledge) {
      setTitle(knowledge.title);
      setContent(knowledge.content);
      setTags(knowledge.tags?.join(', ') || '');
    }
    setIsEditing(false);
  };

  const canEdit = knowledge?.permission === 'owner' || knowledge?.permission === 'edit';

  if (!knowledge) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0"
                  placeholder="知识库标题"
                />
              ) : (
                <span>{knowledge.title}</span>
              )}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!isEditing && canEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  编辑
                </Button>
              )}
              {isEditing && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-1" />
                    取消
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    保存
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex gap-4 min-h-0">
          {/* 主内容区域 */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 min-h-0">
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="输入知识库内容..."
                  className="h-full resize-none"
                />
              ) : (
                <ScrollArea className="h-full">
                  <div className="prose prose-sm max-w-none p-4 bg-muted/30 rounded-lg">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {knowledge.content}
                    </pre>
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* 标签编辑 */}
            {isEditing && (
              <div className="mt-4 flex-shrink-0">
                <label className="text-sm font-medium mb-2 block">标签</label>
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="输入标签，用逗号分隔"
                />
              </div>
            )}
          </div>

          {/* 侧边信息栏 */}
          <div className="w-64 flex-shrink-0 border-l pl-4">
            <div className="space-y-4">
              {/* 权限信息 */}
              <div>
                <h4 className="text-sm font-medium mb-2">权限</h4>
                <div className="flex items-center gap-2">
                  {knowledge.permission === 'owner' && (
                    <Badge variant="default" className="text-xs">拥有者</Badge>
                  )}
                  {knowledge.permission === 'edit' && (
                    <Badge variant="secondary" className="text-xs">可编辑</Badge>
                  )}
                  {knowledge.permission === 'view' && (
                    <Badge variant="outline" className="text-xs">只读</Badge>
                  )}
                </div>
              </div>

              <Separator />

              {/* 基本信息 */}
              <div>
                <h4 className="text-sm font-medium mb-2">基本信息</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">创建者:</span>
                    <span>{knowledge.creator.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">创建时间:</span>
                    <span>{new Date(knowledge.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">更新时间:</span>
                    <span>{new Date(knowledge.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 可见性 */}
              <div>
                <h4 className="text-sm font-medium mb-2">可见性</h4>
                <div className="flex items-center gap-2">
                  {knowledge.isPublic ? (
                    <>
                      <Eye className="h-4 w-4 text-green-500" />
                      <span className="text-sm">公开</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">私密</span>
                    </>
                  )}
                </div>
              </div>

              {/* Git绑定 */}
              {knowledge.gitBound && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2">Git绑定</h4>
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{knowledge.gitRepo}</span>
                    </div>
                  </div>
                </>
              )}

              {/* 标签 */}
              {knowledge.tags && knowledge.tags.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      标签
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {knowledge.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}