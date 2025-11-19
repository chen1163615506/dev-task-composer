import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  GitBranch,
  Users,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KnowledgeItem } from "@/types/knowledge";

interface GitPermissionModalProps {
  open: boolean;
  onClose: () => void;
  knowledge: KnowledgeItem | null;
  onSave: (updates: Partial<KnowledgeItem>) => void;
}

export default function GitPermissionModal({ open, onClose, knowledge, onSave }: GitPermissionModalProps) {
  const [gitRepo, setGitRepo] = useState(knowledge?.gitRepo || "");
  const [isPublic, setIsPublic] = useState(knowledge?.isPublic || false);
  const [gitBound, setGitBound] = useState(knowledge?.gitBound || false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState("");

  const mockGitRepos = [
    "frontend-docs",
    "backend-docs",
    "team-knowledge",
    "company-wiki",
    "project-docs"
  ];

  const mockUsers = [
    { id: "user-1", name: "张三", email: "zhangsan@example.com" },
    { id: "user-2", name: "李四", email: "lisi@example.com" },
    { id: "user-3", name: "王五", email: "wangwu@example.com" },
    { id: "user-4", name: "赵六", email: "zhaoliu@example.com" },
  ];

  const handleSave = () => {
    onSave({
      gitBound,
      gitRepo: gitBound ? gitRepo : undefined,
      isPublic: gitBound ? isPublic : false,
    });
    onClose();
  };

  const addUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers(prev => [...prev, userId]);
    }
  };

  const removeUser = (userId: string) => {
    setSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  const getPermissionIcon = (hasAccess: boolean) => {
    return hasAccess ? (
      <Unlock className="h-4 w-4 text-green-500" />
    ) : (
      <Lock className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Git 绑定和权限设置
          </DialogTitle>
        </DialogHeader>

        {knowledge && (
          <div className="space-y-6">
            {/* 当前知识信息 */}
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <GitBranch className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{knowledge.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    创建者: {knowledge.creator.name}
                  </p>
                </div>
              </div>
            </Card>

            {/* Git 绑定设置 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    绑定 Git 仓库
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    绑定后可以与团队成员共享知识文件
                  </p>
                </div>
                <Switch
                  checked={gitBound}
                  onCheckedChange={setGitBound}
                />
              </div>

              {gitBound && (
                <div className="space-y-3 ml-6">
                  <div className="space-y-2">
                    <Label>Git 仓库</Label>
                    <Select value={gitRepo} onValueChange={setGitRepo}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择 Git 仓库" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockGitRepos.map((repo) => (
                          <SelectItem key={repo} value={repo}>
                            {repo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        {isPublic ? (
                          <Eye className="h-4 w-4 text-green-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        )}
                        公开设置
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        公开后，有该 Git 仓库权限的人都能看到此知识文件
                      </p>
                    </div>
                    <Switch
                      checked={isPublic}
                      onCheckedChange={setIsPublic}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 权限管理 */}
            {gitBound && isPublic && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <Label>权限管理</Label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">当前有权限的用户</Label>
                    <Badge variant="secondary">
                      {selectedUsers.length} 用户
                    </Badge>
                  </div>

                  {/* 已选择的用户 */}
                  {selectedUsers.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedUsers.map((userId) => {
                        const user = mockUsers.find(u => u.id === userId);
                        return user ? (
                          <Badge key={userId} variant="default" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {user.name}
                            <button
                              type="button"
                              onClick={() => removeUser(userId)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}

                  {/* 添加用户 */}
                  <div className="space-y-2">
                    <Label className="text-sm">添加用户权限</Label>
                    <div className="flex gap-2">
                      <Select value={newUser} onValueChange={setNewUser}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="选择用户" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockUsers
                            .filter(user => !selectedUsers.includes(user.id))
                            .map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (newUser) {
                            addUser(newUser);
                            setNewUser("");
                          }
                        }}
                        disabled={!newUser}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* 权限说明 */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">权限说明</p>
                        <ul className="text-xs space-y-1">
                          <li>• 只有拥有该 Git 仓库权限的用户才能访问公开的知识文件</li>
                          <li>• 私有知识文件只有创建者本人可以访问</li>
                          <li>• 可以手动为特定用户添加访问权限</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            保存设置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}