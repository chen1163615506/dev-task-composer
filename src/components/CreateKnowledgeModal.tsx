import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Plus,
  GitBranch,
  Save,
  Upload,
  Link,
  Loader2,
  HelpCircle,
  Users,
  Building,
  User,
  Globe,
  Edit,
  Eye,
  Trash2
} from "lucide-react";
import { KnowledgeItem } from "@/types/knowledge";
import { isValidUrl } from "@/utils/linkToMarkdown";

interface CreateKnowledgeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (knowledge: Omit<KnowledgeItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

interface GitRepo {
  id: string;
  name: string;
  url: string;
}

interface Department {
  id: string;
  name: string;
}

interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
}

interface PermissionRule {
  id: string;
  type: "edit" | "view";
  scope: "all" | "git" | "department" | "user";
  targetId?: string;
  targetName?: string;
}

export default function CreateKnowledgeModal({ open, onClose, onSave }: CreateKnowledgeModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    gitRepos: [] as GitRepo[],
    knowledgeCategory: "" as "" | "platform" | "general" | "process",
    permissionRules: [] as PermissionRule[],
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("");

  // 新增权限规则的状态
  const [newPermission, setNewPermission] = useState({
    type: "view" as "edit" | "view",
    scope: "all" as "all" | "git" | "department" | "user",
    targetId: "",
    targetName: ""
  });

  // 模拟数据
  const availableGitRepos = [
    { id: "1", name: "frontend-project", url: "https://github.com/company/frontend-project" },
    { id: "2", name: "backend-api", url: "https://github.com/company/backend-api" },
    { id: "3", name: "mobile-app", url: "https://github.com/company/mobile-app" },
    { id: "4", name: "data-pipeline", url: "https://github.com/company/data-pipeline" }
  ];

  const availableDepartments = [
    { id: "1", name: "研发部" },
    { id: "2", name: "产品部" },
    { id: "3", name: "设计部" },
    { id: "4", name: "运营部" },
    { id: "5", name: "测试部" }
  ];

  const availableUsers = [
    { id: "1", name: "张三", avatar: "/avatars/zhang.png" },
    { id: "2", name: "李四", avatar: "/avatars/li.png" },
    { id: "3", name: "王五", avatar: "/avatars/wang.png" },
    { id: "4", name: "赵六", avatar: "/avatars/zhao.png" }
  ];

  const knowledgeCategories = [
    {
      id: "platform",
      name: "Platform Rule Skill",
      subtitle: "业务规则",
      description: "与项目无关，但与需求强相关的领域知识，例如：房源、客源、报价等、金融风控规则、订单状态流转、\"如果用户未实名，不允许下单\"这种逻辑"
    },
    {
      id: "general",
      name: "General Rules",
      subtitle: "私域通用规范",
      description: "指导Agent如何接入公司内部私域的通用知识，例如：接入单点登录、调用UC接口、..."
    },
    {
      id: "process",
      name: "Process Rule Skill",
      subtitle: "流程规范",
      description: "关于\"怎么交付/怎么上线/怎么验收\"的知识，例如：验收标准、CR策略、提测流程、PR流程"
    }
  ];

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.knowledgeCategory) {
      alert("请填写完整的标题、内容和知识分类");
      return;
    }

    // 转换为原有格式保存
    onSave({
      title: formData.title,
      content: formData.content,
      type: "shared",
      isPublic: formData.permissionRules.some(rule => rule.scope === "all"),
      gitBound: formData.gitRepos.length > 0,
      gitRepo: formData.gitRepos.length > 0 ? formData.gitRepos[0].url : undefined,
      tags: formData.tags,
      creator: {
        id: "current-user",
        name: "当前用户",
        avatar: "/avatars/current.png"
      }
    });

    // Reset form
    setFormData({
      title: "",
      content: "",
      gitRepos: [],
      knowledgeCategory: "",
      permissionRules: [],
      tags: []
    });
    setNewPermission({
      type: "view",
      scope: "all",
      targetId: "",
      targetName: ""
    });
    setUrlInput("");
    setLoadingStatus("");
    onClose();
  };

  const addGitRepo = (repo: GitRepo) => {
    if (!formData.gitRepos.find(r => r.id === repo.id)) {
      setFormData(prev => ({
        ...prev,
        gitRepos: [...prev.gitRepos, repo]
      }));
    }
  };

  const removeGitRepo = (repoId: string) => {
    setFormData(prev => ({
      ...prev,
      gitRepos: prev.gitRepos.filter(repo => repo.id !== repoId)
    }));
  };

  const addPermissionRule = () => {
    let targetName = "";

    if (newPermission.scope === "all") {
      targetName = "所有人";
    } else if (newPermission.scope === "git") {
      targetName = "Git权限用户";
    } else if (newPermission.scope === "department") {
      const dept = availableDepartments.find(d => d.id === newPermission.targetId);
      targetName = dept ? dept.name : "";
    } else if (newPermission.scope === "user") {
      const user = availableUsers.find(u => u.id === newPermission.targetId);
      targetName = user ? user.name : "";
    }

    if (!targetName || (newPermission.scope !== "all" && newPermission.scope !== "git" && !newPermission.targetId)) {
      alert("请完整选择权限设置");
      return;
    }

    const newRule: PermissionRule = {
      id: Date.now().toString(),
      type: newPermission.type,
      scope: newPermission.scope,
      targetId: newPermission.targetId || undefined,
      targetName
    };

    setFormData(prev => ({
      ...prev,
      permissionRules: [...prev.permissionRules, newRule]
    }));

    // 重置新权限表单
    setNewPermission({
      type: "view",
      scope: "all",
      targetId: "",
      targetName: ""
    });
  };

  const removePermissionRule = (ruleId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionRules: prev.permissionRules.filter(rule => rule.id !== ruleId)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.md')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          title: file.name.replace('.md', ''),
          content: content
        }));
      };
      reader.readAsText(file);
    }
  };

  const handleUrlLoad = async () => {
    const trimmedUrl = urlInput.trim();

    if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
      alert('请输入有效的URL（以http://或https://开头）');
      return;
    }

    setIsLoadingUrl(true);
    setLoadingStatus("正在获取网页内容...");

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoadingStatus("正在解析网页结构...");

      await new Promise(resolve => setTimeout(resolve, 800));
      setLoadingStatus("正在转换为 Markdown 格式...");

      const urlObj = new URL(trimmedUrl);
      const domain = urlObj.hostname;
      let contentType = "网页内容";
      let mockContent = `# ${domain} - ${contentType}

> 来源: ${trimmedUrl}
> 获取时间: ${new Date().toLocaleString()}

## 概述

这是从网页链接自动获取并转换的 Markdown 内容。

## 主要内容

网站 ${domain} 提供了丰富的信息和服务。

### 相关链接

- [原始链接](${trimmedUrl})
- [网站首页](${urlObj.origin})

---

*此内容由系统自动生成，如需更详细的信息，请访问原始链接。*`;

      setFormData(prev => ({
        ...prev,
        title: `${domain} - ${contentType}`,
        content: mockContent
      }));

      setUrlInput("");
      setLoadingStatus("内容填充完成！");

      setTimeout(() => {
        setLoadingStatus("");
      }, 1500);

    } catch (error) {
      console.error('Error loading URL:', error);
      setLoadingStatus("获取失败");
      setTimeout(() => {
        setLoadingStatus("");
      }, 2000);
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleUrlInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUrlLoad();
    }
  };

  const getPermissionIcon = (type: string) => {
    return type === "edit" ? <Edit className="h-3 w-3" /> : <Eye className="h-3 w-3" />;
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case "all": return <Globe className="h-3 w-3" />;
      case "git": return <GitBranch className="h-3 w-3" />;
      case "department": return <Building className="h-3 w-3" />;
      case "user": return <User className="h-3 w-3" />;
      default: return <Users className="h-3 w-3" />;
    }
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>创建知识文件</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* 关联 Git 仓库 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                <Label className="text-base font-medium">关联 Git 仓库</Label>
                <span className="text-sm text-muted-foreground">（可选）</span>
              </div>

              <div className="space-y-3">
                <Select onValueChange={(value) => {
                  const repo = availableGitRepos.find(r => r.id === value);
                  if (repo) addGitRepo(repo);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择要关联的 Git 仓库（可选择多个）" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGitRepos
                      .filter(repo => !formData.gitRepos.find(r => r.id === repo.id))
                      .map((repo) => (
                        <SelectItem key={repo.id} value={repo.id}>
                          <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4" />
                            <span>{repo.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                {formData.gitRepos.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.gitRepos.map((repo) => (
                      <Badge key={repo.id} variant="outline" className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        {repo.name}
                        <button
                          type="button"
                          onClick={() => removeGitRepo(repo.id)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 权限设置 */}
            <div className="space-y-4">
              <Label className="text-base font-medium">权限设置</Label>

              {/* 添加新权限规则 */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-4 gap-4 items-end">
                    {/* 权限类型 */}
                    <div className="space-y-2">
                      <Label className="text-sm">权限类型</Label>
                      <Select
                        value={newPermission.type}
                        onValueChange={(value: "edit" | "view") => setNewPermission(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              <span>仅查看</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="edit">
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              <span>查看&编辑</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 权限范围 */}
                    <div className="space-y-2">
                      <Label className="text-sm">权限范围</Label>
                      <Select
                        value={newPermission.scope}
                        onValueChange={(value: "all" | "git" | "department" | "user") => setNewPermission(prev => ({ ...prev, scope: value, targetId: "", targetName: "" }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              <span>所有人</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="git">
                            <div className="flex items-center gap-2">
                              <GitBranch className="h-4 w-4" />
                              <span>Git权限用户</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="department">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              <span>指定部门</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="user">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>指定用户</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 目标选择 */}
                    <div className="space-y-2">
                      <Label className="text-sm">
                        {newPermission.scope === "department" ? "选择部门" :
                         newPermission.scope === "user" ? "选择用户" : "目标"}
                      </Label>
                      {newPermission.scope === "department" ? (
                        <Select
                          value={newPermission.targetId}
                          onValueChange={(value) => setNewPermission(prev => ({ ...prev, targetId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择部门" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDepartments.map((dept) => (
                              <SelectItem key={dept.id} value={dept.id}>
                                <div className="flex items-center gap-2">
                                  <Building className="h-4 w-4" />
                                  <span>{dept.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : newPermission.scope === "user" ? (
                        <Select
                          value={newPermission.targetId}
                          onValueChange={(value) => setNewPermission(prev => ({ ...prev, targetId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="选择用户" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>{user.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="h-10 flex items-center text-sm text-muted-foreground px-3 border rounded-md bg-muted/50">
                          无需选择
                        </div>
                      )}
                    </div>

                    {/* 添加按钮 */}
                    <Button
                      type="button"
                      onClick={addPermissionRule}
                      disabled={
                        (newPermission.scope === "department" && !newPermission.targetId) ||
                        (newPermission.scope === "user" && !newPermission.targetId)
                      }
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      添加
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 已添加的权限规则 */}
              {formData.permissionRules.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm">已设置的权限</Label>
                  <div className="space-y-2">
                    {formData.permissionRules.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getPermissionIcon(rule.type)}
                            {rule.type === "edit" ? "查看&编辑" : "仅查看"}
                          </Badge>
                          <div className="flex items-center gap-2">
                            {getScopeIcon(rule.scope)}
                            <span className="text-sm font-medium">{rule.targetName}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePermissionRule(rule.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 知识分类 */}
            <div className="space-y-4">
              <Label className="text-base font-medium">知识分类 *</Label>
              <div className="grid grid-cols-3 gap-4">
                {knowledgeCategories.map((category) => (
                  <Card
                    key={category.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      formData.knowledgeCategory === category.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, knowledgeCategory: category.id as "platform" | "general" | "process" }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{category.name}</h3>
                          <p className="text-xs text-muted-foreground">({category.subtitle})</p>
                        </div>
                        {formData.knowledgeCategory === category.id && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3">{category.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 知识内容 */}
            <div className="space-y-4">
              <Label className="text-base font-medium">知识内容</Label>

              {/* 标题 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm">标题 *</Label>
                <Input
                  id="title"
                  placeholder="输入知识文件标题"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              {/* 文件上传和链接输入 */}
              <div className="grid grid-cols-2 gap-4">
                {/* 文件上传 */}
                <div className="space-y-2">
                  <Label className="text-sm">上传文件</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-3">
                    <input
                      type="file"
                      accept=".md"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground text-center">
                        点击上传 .md 文件
                      </span>
                    </label>
                  </div>
                </div>

                {/* 链接输入 */}
                <div className="space-y-2">
                  <Label className="text-sm">从链接创建</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="输入链接 (https://...)"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={handleUrlInputKeyDown}
                        className="flex-1"
                        disabled={isLoadingUrl}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleUrlLoad}
                        disabled={!urlInput.trim() || !isValidUrl(urlInput.trim()) || isLoadingUrl}
                      >
                        {isLoadingUrl ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Link className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* 加载状态显示 */}
                    {loadingStatus && (
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>{loadingStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 内容 */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm">内容 *</Label>
                <Textarea
                  id="content"
                  placeholder="输入知识内容 (支持 Markdown 格式)"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={8}
                  className="resize-none font-mono text-sm"
                />
              </div>

              {/* 标签 */}
              <div className="space-y-2">
                <Label className="text-sm">标签</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="添加标签"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={!formData.title.trim() || !formData.content.trim() || !formData.knowledgeCategory}>
              <Save className="h-4 w-4 mr-1" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}