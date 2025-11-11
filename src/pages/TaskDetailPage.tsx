import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTaskStore } from "@/store/taskStore";
import { mockSingleTasks, mockRequirements } from "@/data/mockData";
import { ArrowLeft, GitBranch, FolderGit2, GitPullRequest, Eye, ExternalLink, CheckCircle, Clock, Loader2, Bot } from "lucide-react";

interface DiffFile {
  path: string;
  additions: number;
  deletions: number;
  diff: string;
}

interface AgentLog {
  id: string;
  timestamp: string;
  content: string;
  type: 'info' | 'success' | 'error';
}

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const tasks = useTaskStore((state) => state.tasks);

  let currentTask = tasks.find(t => t.id === taskId);

  if (!currentTask) {
    currentTask = mockSingleTasks.find(t => t.id === taskId);
  }

  if (!currentTask) {
    for (const req of mockRequirements) {
      const task = req.tasks.find(t => t.id === taskId);
      if (task) {
        currentTask = task;
        break;
      }
    }
  }

  const [diffFiles] = useState<DiffFile[]>([
    {
      path: 'src/auth.ts',
      additions: 48,
      deletions: 13,
      diff: `@@ -1,7 +1,7 @@
import { User } from '@/types/user';
import { generateToken } from '@/utils/crypto';
+import { validatePassword } from '@/utils/crypto';

export class AuthService {
  private userRepository: UserRepository;
  
  constructor(userRepository: UserRepository) {
    this.userRepository = new UserRepository();
  }

- async login(email: string, password: string): string {
+ async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const isValid = await validatePassword(password, user.passwordHash);
    
    if (!isValid) {
      throw new Error('Invalid credentials');
    }
    
+   // Check if 2FA is enabled
+   const isValid2FA = await verify2FA(user.totpSecret, totpCode);
+   
+   if (!isValid2FA) {
+     throw new Error('Invalid 2FA code');
+   }
    
    return this.generateToken(user);
  }
}`
    },
    {
      path: 'src/components/LoginForm.tsx',
      additions: 25,
      deletions: 5,
      diff: `@@ -10,6 +10,7 @@
export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
+ const [totpCode, setTotpCode] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
-     await authService.login(email, password);
+     await authService.login(email, password, totpCode);
      toast.success('登录成功');
    } catch (error) {
      toast.error('登录失败');
    }
  };
}`
    },
    {
      path: 'src/utils/crypto.ts',
      additions: 15,
      deletions: 0,
      diff: `@@ -45,0 +45,15 @@
+export async function verify2FA(secret: string, token: string): Promise<boolean> {
+  const authenticator = new Authenticator();
+  return authenticator.verify({ token, secret });
+}
+
+export function generate2FASecret(): string {
+  const authenticator = new Authenticator();
+  return authenticator.generateSecret();
+}`
    }
  ]);

  const [agentLogs] = useState<AgentLog[]>([
    {
      id: '1',
      timestamp: '11月3日 16:14',
      content: '开始，我将分析现有双因素认证功能，并基本完成TOP1的整合',
      type: 'info'
    },
    {
      id: '2',
      timestamp: '11月3日 16:15',
      content: '1. src/services/auth.ts - 修改登录逻辑\n2. src/components/LoginForm.tsx - 添加2FA输入框\n3. src/utils/crypto.ts - 新建TOTP工具类\n4. src/types/user.ts - 扩展用户模型',
      type: 'info'
    },
    {
      id: '3',
      timestamp: '11月3日 16:16',
      content: '正在创建 src/utils/crypto.ts 文件，实现双因素认证...',
      type: 'info'
    },
    {
      id: '4',
      timestamp: '11月3日 16:18',
      content: '✓ 已创建 totp.ts，包含以下功能：\n- generateOTP: 生成6位动态码\n- verifyOTP: 验证动态码（支持时间窗口）',
      type: 'success'
    },
    {
      id: '5',
      timestamp: '11月3日 16:19',
      content: '正在修改 src/services/auth.ts...',
      type: 'info'
    },
    {
      id: '6',
      timestamp: '11月3日 16:21',
      content: '✓ 已修改 AuthService.login 方法：\n- 添加TOTP验证步骤\n- verifyOTP: 验证动态码（支持时间窗口）\n- 使用新的MAC-SHA1算法，兼容Google Authenticator等主流应用',
      type: 'success'
    },
    {
      id: '7',
      timestamp: '11月3日 16:22',
      content: '准备修改 src/components/LoginForm.tsx...',
      type: 'info'
    }
  ]);

  if (!currentTask) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">任务不存在</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b bg-card">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-8 w-px bg-border" />
            <h1 className="text-lg font-semibold">{currentTask.title}</h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground ml-14">
            <div className="flex items-center gap-2">
              <FolderGit2 className="h-4 w-4" />
              <span>user-service</span>
            </div>
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              <span>feature/2fa-auth</span>
            </div>
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>{currentTask.agent}</span>
            </div>
          </div>
        </div>

        <div className="border-t px-4 py-2 flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-4 w-4" />
            PR Review
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <GitPullRequest className="h-4 w-4" />
            Create PR
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open in IDE
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/2 border-r flex flex-col">
          <Tabs defaultValue="diff" className="flex-1 flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b px-4">
              <TabsTrigger value="diff">代码变更</TabsTrigger>
              <TabsTrigger value="review">Review提醒</TabsTrigger>
            </TabsList>

            <TabsContent value="diff" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <Accordion type="multiple" defaultValue={diffFiles.map((_, i) => `file-${i}`)} className="space-y-2">
                    {diffFiles.map((file, index) => (
                      <AccordionItem key={index} value={`file-${index}`} className="border rounded-lg">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                          <div className="flex items-center justify-between w-full pr-4">
                            <span className="font-mono text-sm">{file.path}</span>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-green-600">+{file.additions}</span>
                              <span className="text-red-600">-{file.deletions}</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 pb-0">
                          <div className="font-mono text-xs overflow-x-auto">
                            {file.diff.split('\n').map((line, idx) => {
                              let bgColor = 'bg-background';
                              let textColor = 'text-foreground';

                              if (line.startsWith('+') && !line.startsWith('+++')) {
                                bgColor = 'bg-green-50 dark:bg-green-950/30';
                                textColor = 'text-green-700 dark:text-green-400';
                              } else if (line.startsWith('-') && !line.startsWith('---')) {
                                bgColor = 'bg-red-50 dark:bg-red-950/30';
                                textColor = 'text-red-700 dark:text-red-400';
                              } else if (line.startsWith('@@')) {
                                bgColor = 'bg-blue-50 dark:bg-blue-950/30';
                                textColor = 'text-blue-700 dark:text-blue-400';
                              }

                              return (
                                <div key={idx} className={`px-4 py-0.5 ${bgColor} ${textColor}`}>
                                  <pre className="whitespace-pre">{line}</pre>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="review" className="flex-1 m-0 p-6">
              <p className="text-sm text-muted-foreground">暂无 Review 提醒</p>
            </TabsContent>
          </Tabs>
        </div>

        <div className="w-1/2 flex flex-col bg-muted/30">
          <div className="border-b p-4 bg-card flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Agent 对话</h3>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {agentLogs.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {log.type === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : log.type === 'error' ? (
                      <Clock className="h-4 w-4 text-red-500" />
                    ) : (
                      <Loader2 className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <Card className="p-3 bg-card">
                      <p className="text-sm whitespace-pre-wrap">{log.content}</p>
                    </Card>
                    <span className="text-xs text-muted-foreground mt-1 block">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}





