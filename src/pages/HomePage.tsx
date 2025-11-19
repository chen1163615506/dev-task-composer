import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { mockRepositories, mockBranches, mockAgents } from "@/data/mockData";
import { toast } from "sonner";
import { GitBranch, FolderGit2, Sparkles, Send, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";
import { useSidebar } from "@/components/ui/sidebar";
import MentionInput, { MentionResource } from "@/components/MentionInput";

export default function HomePage() {
  const navigate = useNavigate();
  const addTask = useTaskStore((state) => state.addTask);
  const { setOpen } = useSidebar();
  const [selectedRepo, setSelectedRepo] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(mockAgents[0].id);
  const [task, setTask] = useState("");
  const [taskMode, setTaskMode] = useState<"agent" | "plan">("plan");
  const [flyingTask, setFlyingTask] = useState<{ id: string; title: string; startX: number; startY: number; endX: number; endY: number } | null>(null);
  const [mentionedResources, setMentionedResources] = useState<MentionResource[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const availableBranches = mockBranches.filter(
    (branch) => branch.repositoryId === selectedRepo
  );

  const currentAgent = mockAgents.find(a => a.id === selectedAgent);
  const currentRepo = mockRepositories.find(r => r.id === selectedRepo);
  const currentBranch = availableBranches.find(b => b.id === selectedBranch);

  const handleSubmit = () => {
    if (!selectedRepo || !selectedBranch || !selectedAgent) {
      toast.error("请选择仓库、分支和 AI 模型");
      return;
    }

    if (!task) {
      toast.error("请输入任务描述");
      return;
    }

    if (taskMode === "plan") {
      navigate(`/decompose?requirement=custom&repo=${selectedRepo}&branch=${selectedBranch}&agent=${selectedAgent}&customTask=${encodeURIComponent(task)}`);
      return;
    }

    const newTask = {
      id: `task-${Date.now()}`,
      title: task.slice(0, 50) + (task.length > 50 ? '...' : ''),
      status: 'running' as const,
      agent: currentAgent?.name || '',
      createdAt: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
    };

    if (textareaRef.current) {
      const rect = textareaRef.current.getBoundingClientRect();

      setOpen(true);

      setTimeout(() => {
        const sidebarTaskElement = document.querySelector('[data-sidebar-task-target]');
        const endRect = sidebarTaskElement?.getBoundingClientRect();

        setFlyingTask({
          id: newTask.id,
          title: newTask.title,
          startX: rect.left + rect.width / 2,
          startY: rect.top + rect.height / 2,
          endX: endRect ? endRect.left + endRect.width / 2 : 100,
          endY: endRect ? endRect.top + endRect.height / 2 : 100,
        });

        setTimeout(() => {
          setFlyingTask(null);
          addTask(newTask);
          toast.success("任务已创建，正在异步执行...");
        }, 600);
      }, 100);
    } else {
      addTask(newTask);
      toast.success("任务已创建，正在异步执行...");
    }

    setTask("");
  };

  const handleMentionSelect = (resource: MentionResource) => {
    setMentionedResources(prev => {
      if (!prev.find(r => r.id === resource.id)) {
        return [...prev, resource];
      }
      return prev;
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">AI 研发平台</h1>
        <p className="text-muted-foreground">描述您的需求，AI 将帮助您完成开发任务</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <MentionInput
            value={task}
            onChange={setTask}
            onMentionSelect={handleMentionSelect}
            placeholder="请详细描述您的开发需求... (输入 @ 可引用资源)"
            rows={8}
            className="resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {/* 模式切换和 Agent 选择 - 左下角 */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {/* 模式切换 */}
            <div className="relative bg-muted/50 rounded-md p-0.5 flex h-8">
              <div
                className={cn(
                  "absolute top-0.5 bottom-0.5 bg-background rounded-sm shadow-sm transition-all duration-200 ease-in-out",
                  taskMode === "plan" ? "left-0.5 right-[50%]" : "left-[50%] right-0.5"
                )}
              />
              <button
                type="button"
                onClick={() => setTaskMode("plan")}
                className={cn(
                  "px-3 text-xs font-medium rounded-sm transition-colors relative z-10",
                  taskMode === "plan" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Plan
              </button>
              <button
                type="button"
                onClick={() => setTaskMode("agent")}
                className={cn(
                  "px-3 text-xs font-medium rounded-sm transition-colors relative z-10",
                  taskMode === "agent" ? "text-foreground" : "text-muted-foreground"
                )}
              >
                Remote
              </button>
            </div>

            {/* Agent 选择 */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-2 h-8"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs">{currentAgent?.name}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64 p-2">
                <div className="space-y-1">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    选择 AI 模型
                  </div>
                  {mockAgents.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => setSelectedAgent(agent.id)}
                      className={cn(
                        "w-full text-left px-2 py-2 rounded-md text-sm transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        selectedAgent === agent.id && "bg-accent font-medium"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>{agent.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 发送按钮 - 右下角 */}
          <Button
            type="button"
            size="icon"
            className="absolute bottom-3 right-3 h-8 w-8"
            onClick={handleSubmit}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* 仓库、分支选择 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 仓库选择 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 h-8 text-muted-foreground"
              >
                <FolderGit2 className="h-4 w-4" />
                <span className="text-xs">{currentRepo?.name || "选择仓库"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  选择代码仓库
                </div>
                {mockRepositories.map((repo) => (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => {
                      setSelectedRepo(repo.id);
                      setSelectedBranch("");
                    }}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      selectedRepo === repo.id && "bg-accent font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="h-4 w-4" />
                      <span>{repo.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* 分支选择 */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-2 h-8 text-muted-foreground"
                disabled={!selectedRepo}
              >
                <GitBranch className="h-4 w-4" />
                <span className="text-xs">{currentBranch?.name || "选择分支"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2">
              <div className="space-y-1">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  选择分支
                </div>
                {availableBranches.map((branch) => (
                  <button
                    key={branch.id}
                    type="button"
                    onClick={() => setSelectedBranch(branch.id)}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      selectedBranch === branch.id && "bg-accent font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <GitBranch className="h-4 w-4" />
                      <span>{branch.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {flyingTask && (
        <div
          className="fixed z-50 pointer-events-none transition-all duration-600 ease-out"
          style={{
            left: flyingTask.startX,
            top: flyingTask.startY,
            transform: `translate(${flyingTask.endX - flyingTask.startX}px, ${flyingTask.endY - flyingTask.startY}px) scale(0.3)`,
            opacity: 0,
          }}
        >
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
            {flyingTask.title}
          </div>
        </div>
      )}
    </div>
  );
}















