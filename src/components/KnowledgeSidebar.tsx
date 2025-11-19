import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Users,
  Plus,
  Search,
  FileText,
  GitBranch,
  Eye,
  EyeOff,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Settings,
  Lock,
  Unlock
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockMyKnowledge,
  mockSharedKnowledge,
  mockMarketKnowledge,
  getKnowledgeIcon
} from "@/data/mockKnowledge";
import { KnowledgeItem } from "@/types/knowledge";
import GitPermissionModal from "@/components/GitPermissionModal";
import CreateKnowledgeModal from "@/components/CreateKnowledgeModal";
import KnowledgeViewModal from "@/components/KnowledgeViewModal";

interface KnowledgeSidebarProps {
  className?: string;
}

export default function KnowledgeSidebar({ className }: KnowledgeSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGitModal, setShowGitModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<KnowledgeItem | null>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');

  const handleEditKnowledge = (item: KnowledgeItem) => {
    setSelectedKnowledge(item);
    setViewMode('edit');
    setShowViewModal(true);
  };

  const handleViewKnowledge = (item: KnowledgeItem) => {
    setSelectedKnowledge(item);
    setViewMode('view');
    setShowViewModal(true);
  };

  const handleSaveKnowledge = (updates: Partial<KnowledgeItem>) => {
    console.log("保存知识库更新:", updates);
    // TODO: 实现保存知识库的逻辑
    setShowViewModal(false);
  };

  const filterKnowledge = (items: KnowledgeItem[]) => {
    return items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const filteredMyKnowledge = filterKnowledge(mockMyKnowledge);
  const filteredSharedCreated = filterKnowledge(mockSharedKnowledge.created);
  const filteredSharedAdded = filterKnowledge(mockSharedKnowledge.added);
  const filteredMarketKnowledge = filterKnowledge(mockMarketKnowledge);

  const KnowledgeItemCard = ({ item, showActions = true }: { item: KnowledgeItem; showActions?: boolean }) => {
    const getPermissionBadge = () => {
      switch (item.permission) {
        case 'owner':
          return <Badge variant="default" className="text-xs">拥有者</Badge>;
        case 'edit':
          return <Badge variant="secondary" className="text-xs">可编辑</Badge>;
        case 'view':
          return <Badge variant="outline" className="text-xs">只读</Badge>;
        default:
          return null;
      }
    };

    const getActionButton = () => {
      if (item.permission === 'owner' || item.permission === 'edit') {
        return (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => handleEditKnowledge(item)}
            title="编辑"
          >
            <Edit className="h-3 w-3" />
          </Button>
        );
      } else {
        return (
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0"
            onClick={() => handleViewKnowledge(item)}
            title="查看"
          >
            <Eye className="h-3 w-3" />
          </Button>
        );
      }
    };

    return (
      <Card className="p-3 hover:bg-accent/50 transition-colors cursor-pointer group">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {getKnowledgeIcon(item)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium truncate">{item.title}</h4>
                {getPermissionBadge()}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {item.creator.name}
                </span>
                {item.isPublic ? (
                  <Eye className="h-3 w-3 text-green-500" />
                ) : (
                  <EyeOff className="h-3 w-3 text-gray-500" />
                )}
                {item.gitBound && (
                  <GitBranch className="h-3 w-3 text-blue-500" />
                )}
                {item.gitBound && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {item.gitRepo}
                  </Badge>
                )}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {getActionButton()}
              {item.gitBound && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={() => {
                    setSelectedKnowledge(item);
                    setShowGitModal(true);
                  }}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              )}
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className={cn("w-80 border-r bg-background flex flex-col", className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Book className="h-5 w-5" />
            知识库
          </h2>
          <Button size="sm" onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-1" />
            新建
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索知识..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b px-4 h-12">
          <TabsTrigger value="my" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
            我的
          </TabsTrigger>
          <TabsTrigger value="market" className="data-[state=active]:border-b-2 data-[state=active]:border-primary">
            市场
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* 我创建的 */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  我创建的 ({filteredMyKnowledge.length})
                </h3>
                <div className="space-y-3">
                  {filteredMyKnowledge.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">暂无创建的知识文件</p>
                      <p className="text-xs mt-1">点击"新建"创建第一个知识文件</p>
                    </div>
                  ) : (
                    filteredMyKnowledge.map((item) => (
                      <KnowledgeItemCard key={item.id} item={item} />
                    ))
                  )}
                </div>
              </div>

              {/* 我添加的 */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  我添加的 ({filteredSharedAdded.length})
                </h3>
                <div className="space-y-3">
                  {filteredSharedAdded.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p className="text-sm">暂无添加的知识</p>
                      <p className="text-xs mt-1">从市场中选择知识添加到你的知识库</p>
                    </div>
                  ) : (
                    filteredSharedAdded.map((item) => (
                      <KnowledgeItemCard key={item.id} item={item} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="market" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {filteredMarketKnowledge.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <GitBranch className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">暂无市场知识</p>
                  <p className="text-xs mt-1">市场知识正在更新中...</p>
                </div>
              ) : (
                filteredMarketKnowledge.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <KnowledgeItemCard item={item} showActions={false} />
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        // TODO: 添加到我的知识库
                        console.log("添加知识到库:", item.id);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      添加到知识库
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Create Knowledge Modal */}
      <CreateKnowledgeModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={(knowledge) => {
          // TODO: 实现保存知识的逻辑
          console.log("创建知识:", knowledge);
        }}
      />

      {/* Git Permission Modal */}
      <GitPermissionModal
        open={showGitModal}
        onClose={() => {
          setShowGitModal(false);
          setSelectedKnowledge(null);
        }}
        knowledge={selectedKnowledge}
        onSave={(updates) => {
          // TODO: 实现更新Git权限的逻辑
          console.log("更新Git权限:", updates);
          setShowGitModal(false);
          setSelectedKnowledge(null);
        }}
      />

      {/* Knowledge View/Edit Modal */}
      <KnowledgeViewModal
        open={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setSelectedKnowledge(null);
        }}
        knowledge={selectedKnowledge}
        mode={viewMode}
        onSave={handleSaveKnowledge}
      />
    </div>
  );
}