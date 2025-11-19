import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockRequirements, mockAgents, mockRepositories, mockBranches } from "@/data/mockData";
import { toast } from "sonner";
import { Plus, Trash2, FileText, Code, ArrowLeft, Send, Home, GitBranch, FolderGit2, Sparkles, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import MentionInput, { MentionResource, UploadedFile } from "@/components/MentionInput";
import { Textarea } from "@/components/ui/textarea";

interface Task {
  id: string;
  title: string;
  priority: string;
  content: string;
}

export default function TaskDecomposePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requirementId = searchParams.get("requirement");
  const repoId = searchParams.get("repo");
  const branchId = searchParams.get("branch");
  const agentId = searchParams.get("agent");
  const customTask = searchParams.get("customTask");

  const requirement = requirementId !== 'custom' ? mockRequirements.find((r) => r.id === requirementId) : null;
  const agent = mockAgents.find((a) => a.id === agentId);
  const repo = mockRepositories.find((r) => r.id === repoId);
  const branch = mockBranches.find((b) => b.id === branchId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [mentionedResources, setMentionedResources] = useState<MentionResource[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    if (!requirement && !customTask) {
      toast.error("未找到需求信息");
      navigate("/");
    }
    if (customTask) {
      setChatHistory([{ role: 'user', content: decodeURIComponent(customTask) }]);
    }
  }, [requirement, customTask, navigate]);

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    toast.success("任务已删除");
  };

  const updateTask = (taskId: string, field: keyof Task, value: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t));
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;

    setChatHistory([...chatHistory, { role: 'user', content: chatMessage }]);

    setTimeout(() => {
      const mockResponse = "我已经分析了您的需求，建议拆分为以下任务：\n1. 优化登录页面UI组件\n2. 实现表单验证逻辑\n3. 优化API请求性能";
      setChatHistory(prev => [...prev, { role: 'assistant', content: mockResponse }]);

      const newTasks: Task[] = [
        { id: Date.now().toString(), title: "优化登录页面UI组件", priority: "P1", content: "重构登录页面组件，使用React.memo优化渲染性能" },
        { id: (Date.now() + 1).toString(), title: "实现表单验证逻辑", priority: "P2", content: "添加完整的表单验证，包括邮箱格式、密码强度等" },
        { id: (Date.now() + 2).toString(), title: "优化API请求性能", priority: "P1", content: "使用并行请求和缓存机制优化登录API性能" },
      ];
      setTasks(newTasks);
    }, 1000);

    setChatMessage("");
  };

  const handleMentionSelect = (resource: MentionResource) => {
    setMentionedResources(prev => {
      if (!prev.find(r => r.id === resource.id)) {
        return [...prev, resource];
      }
      return prev;
    });
  };

  const handleFileUpload = (files: UploadedFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`已上传 ${files.length} 个文件`);
  };

  const addNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "",
      priority: "P2",
      content: ""
    };
    setTasks([...tasks, newTask]);
  };

  const handleSubmitAllTasks = () => {
    if (tasks.length === 0) {
      toast.error("请至少添加一个任务");
      return;
    }

    toast.success(`已下发 ${tasks.length} 个任务`);
    navigate("/");
  };

  if (!requirement && !customTask) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <Home className="h-5 w-5" />
            </Button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                <span>{repo?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <span>{branch?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">需求名称:</span>
                <span className="font-medium">{requirement?.title || '自定义需求'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：聊天区域 */}
        <div className="w-1/2 border-r flex flex-col">
          <div className="border-b p-4">
            <h3 className="font-semibold">AI 对话</h3>
            <p className="text-sm text-muted-foreground">与 AI 交流，拆解和优化任务</p>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-3",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-3 text-sm",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <MentionInput
                  placeholder="描述您想要添加或修改的任务... (输入 @ 可引用资源)"
                  value={chatMessage}
                  onChange={setChatMessage}
                  onMentionSelect={handleMentionSelect}
                  onFileUpload={handleFileUpload}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <Button size="icon" onClick={handleSendMessage} className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* 右侧：任务列表和文档 */}
        <div className="w-1/2 flex flex-col">
          <Tabs defaultValue="tasks" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b px-4">
              <TabsTrigger value="tasks">任务列表</TabsTrigger>
              <TabsTrigger value="document" className="gap-2">
                <FileText className="h-4 w-4" />
                wiki文档
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code className="h-4 w-4" />
                代码
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="flex-1 m-0 flex flex-col">
              <div className="border-b p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">任务列表</h3>
                  <Badge variant="secondary">{tasks.length}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={addNewTask}>
                    <Plus className="h-4 w-4 mr-1" />
                    新增任务
                  </Button>
                  <Button size="sm" onClick={handleSubmitAllTasks} disabled={tasks.length === 0}>
                    下发全部任务({tasks.length})
                  </Button>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>暂无任务</p>
                      <p className="text-sm mt-2">在左侧聊天框中描述需求，AI 将帮您拆解任务</p>
                      <p className="text-sm">或点击上方"新增任务"按钮手动添加</p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <Card key={task.id} className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <Input
                            value={task.title}
                            onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                            className="font-medium"
                            placeholder="任务标题"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeTask(task.id)}
                            className="shrink-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="mb-3">
                          <label className="text-xs text-muted-foreground mb-1 block">优先级</label>
                          <select
                            value={task.priority}
                            onChange={(e) => updateTask(task.id, 'priority', e.target.value)}
                            className="w-24 h-8 px-2 rounded-md border bg-background text-sm"
                          >
                            <option value="P0">P0</option>
                            <option value="P1">P1</option>
                            <option value="P2">P2</option>
                            <option value="P3">P3</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs text-muted-foreground mb-1 block">任务内容</label>
                          <Textarea
                            value={task.content}
                            onChange={(e) => updateTask(task.id, 'content', e.target.value)}
                            placeholder="详细描述任务内容..."
                            rows={4}
                            className="resize-none text-sm"
                          />
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="document" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-6 prose prose-sm max-w-none">
                  {requirement?.document ? (
                    <pre className="whitespace-pre-wrap font-sans">
                      {requirement.document}
                    </pre>
                  ) : (
                    <p className="text-muted-foreground">暂无需求文档</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="flex-1 m-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {requirement?.codeFiles && requirement.codeFiles.length > 0 ? (
                    requirement.codeFiles.map((file, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="bg-muted px-4 py-2 text-sm font-mono">
                          {file.path}
                        </div>
                        <pre className="p-4 text-xs overflow-x-auto">
                          <code>{file.content}</code>
                        </pre>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      暂无相关代码
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

















