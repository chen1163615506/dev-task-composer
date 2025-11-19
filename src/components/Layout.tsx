import { useEffect, useState, useRef } from "react";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Menu, Book, Plus, Search, FileText, Users, GitBranch, Eye, EyeOff, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import CreateKnowledgeModal from "@/components/CreateKnowledgeModal";
import KnowledgeViewModal from "@/components/KnowledgeViewModal";

// 创建一个 Context 来共享知识库状态
import { createContext, useContext } from "react";

const KnowledgeContext = createContext<{
  showKnowledgeSidebar: boolean;
  setShowKnowledgeSidebar: (show: boolean) => void;
}>({
  showKnowledgeSidebar: false,
  setShowKnowledgeSidebar: () => {},
});

export const useKnowledge = () => useContext(KnowledgeContext);

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { setOpen, isMobile } = useSidebar();
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [showKnowledgeSidebar, setShowKnowledgeSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedKnowledge, setSelectedKnowledge] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'view' | 'edit'>('view');
  const knowledgeSidebarRef = useRef<HTMLDivElement>(null);

  // 处理保存新知识库
  const handleSaveKnowledge = (knowledgeData: any) => {
    console.log('保存知识库:', knowledgeData);
    // 这里可以添加实际的保存逻辑，比如调用 API
    // 暂时只是打印到控制台
  };

  // 模拟知识库数据
  const mockKnowledge = {
    my: [
      { id: '1', title: 'React最佳实践.md', creator: '我', isPublic: false, gitBound: false, tags: ['React', '前端'], permission: 'owner' },
      { id: '2', title: 'TypeScript指南.md', creator: '我', isPublic: true, gitBound: true, tags: ['TypeScript'], permission: 'owner' }
    ],
    shared: {
      created: [
        { id: '3', title: 'Git工作流规范.md', creator: '我', isPublic: true, gitBound: true, tags: ['Git', '规范'], permission: 'owner' }
      ],
      added: [
        { id: '4', title: '微前端架构.md', creator: '张三', isPublic: true, gitBound: true, tags: ['架构'], permission: 'edit' },
        { id: '5', title: 'CI/CD最佳实践.md', creator: '李四', isPublic: false, gitBound: true, tags: ['DevOps'], permission: 'view' }
      ]
    },
    market: [
      { id: '6', title: 'React性能优化.md', creator: '王五', isPublic: true, gitBound: true, tags: ['React', '性能'], permission: 'view' },
      { id: '7', title: 'Docker指南.md', creator: '赵六', isPublic: true, gitBound: true, tags: ['Docker', 'DevOps'], permission: 'view' }
    ]
  };

  const handleEditKnowledge = (item: any) => {
    setSelectedKnowledge(item);
    setViewMode('edit');
    setShowViewModal(true);
  };

  const handleViewKnowledge = (item: any) => {
    setSelectedKnowledge(item);
    setViewMode('view');
    setShowViewModal(true);
  };

  const handleSaveKnowledgeUpdate = (updates: any) => {
    console.log("保存知识库更新:", updates);
    // TODO: 实现保存知识库的逻辑
    setShowViewModal(false);
  };

  const KnowledgeItemCard = ({ item }: { item: any }) => {
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
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
            <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium truncate">{item.title}</h4>
                {getPermissionBadge()}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{item.creator}</span>
                {item.isPublic ? (
                  <Eye className="h-3 w-3 text-green-500" />
                ) : (
                  <EyeOff className="h-3 w-3 text-gray-500" />
                )}
                {item.gitBound && <GitBranch className="h-3 w-3 text-blue-500" />}
              </div>
              {item.tags && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {getActionButton()}
        </div>
      </Card>
    );
  };

  const MarketKnowledgeItemCard = ({ item }: { item: any }) => (
    <Card className="p-3 hover:bg-accent/50 transition-colors group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">{item.title}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{item.creator}</span>
              {item.isPublic ? (
                <Eye className="h-3 w-3 text-green-500" />
              ) : (
                <EyeOff className="h-3 w-3 text-gray-500" />
              )}
              {item.gitBound && <GitBranch className="h-3 w-3 text-blue-500" />}
            </div>
            {item.tags && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}
            <div className="mt-3">
              <Button size="sm" variant="outline" className="w-full">
                添加到知识库
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const KnowledgeSidebar = () => (
    <div ref={knowledgeSidebarRef} className="knowledge-sidebar-container w-80 border-r bg-background flex flex-col">
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b px-4 h-12">
          <TabsTrigger value="my">我的</TabsTrigger>
          <TabsTrigger value="market">市场</TabsTrigger>
        </TabsList>

        <TabsContent value="my" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* 我创建的 */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  我创建的 ({mockKnowledge.my.length})
                </h3>
                <div className="space-y-3">
                  {mockKnowledge.my.map((item) => (
                    <KnowledgeItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>

              {/* 我添加的 */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  我添加的 ({mockKnowledge.shared.added.length})
                </h3>
                <div className="space-y-3">
                  {mockKnowledge.shared.added.map((item) => (
                    <KnowledgeItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="market" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {mockKnowledge.market.map((item) => (
                <MarketKnowledgeItemCard key={item.id} item={item} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );

  useEffect(() => {
    if (isMobile) return;
    if (isHomePage) {
      setOpen(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 10) {
        setOpen(true);
      } else if (e.clientX > 280) {
        setOpen(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [setOpen, isMobile, isHomePage]);

  // 添加点击外部区域关闭知识库侧边栏的逻辑
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!showKnowledgeSidebar) return;

      const target = event.target as Element;

      // 检查是否点击的是知识库按钮
      const isKnowledgeButton = target.closest('[data-knowledge-button]');
      if (isKnowledgeButton) return;

      // 检查是否点击的是知识库侧边栏内容 - 使用更宽松的检查
      const isInsideKnowledgeSidebar = target.closest('.knowledge-sidebar-container');
      if (isInsideKnowledgeSidebar) return;

      // 点击了其他地方，关闭知识库侧边栏
      setShowKnowledgeSidebar(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showKnowledgeSidebar]);

  return (
    <KnowledgeContext.Provider value={{ showKnowledgeSidebar, setShowKnowledgeSidebar }}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        {/* 知识库侧边栏 */}
        {showKnowledgeSidebar && (
          <>
            <KnowledgeSidebar />
            <div className="w-px bg-border" />
          </>
        )}

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-card flex items-center px-4 sticky top-0 z-10">
            <SidebarTrigger className="mr-4">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            <h1 className="text-lg font-semibold">AI 研发平台</h1>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>

      {/* 创建知识库模态框 */}
      <CreateKnowledgeModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleSaveKnowledge}
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
        onSave={handleSaveKnowledgeUpdate}
      />
    </KnowledgeContext.Provider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}











































