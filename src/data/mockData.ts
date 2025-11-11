export interface Repository {
  id: string;
  name: string;
  url: string;
}

export interface Branch {
  id: string;
  name: string;
  repositoryId: string;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent: string;
  createdAt: string;
  parentId?: string;
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  document?: string;
  codeFiles?: Array<{
    path: string;
    content: string;
  }>;
}

export const mockRepositories: Repository[] = [
  { id: '1', name: 'pika-website', url: 'https://github.com/example/pika-website' },
  { id: '2', name: 'ai-platform', url: 'https://github.com/example/ai-platform' },
  { id: '3', name: 'backend-api', url: 'https://github.com/example/backend-api' },
];

export const mockBranches: Branch[] = [
  { id: '1', name: 'main', repositoryId: '1' },
  { id: '2', name: 'develop', repositoryId: '1' },
  { id: '3', name: 'feature/new-ui', repositoryId: '1' },
  { id: '4', name: 'main', repositoryId: '2' },
  { id: '5', name: 'develop', repositoryId: '2' },
  { id: '6', name: 'main', repositoryId: '3' },
];

export const mockAgents: Agent[] = [
  { id: '1', name: 'Claude Sonnet 4.5', model: 'claude-sonnet-4-5' },
  { id: '2', name: 'Claude Opus 4', model: 'claude-opus-4' },
  { id: '3', name: 'GPT-5', model: 'gpt-5' },
];

export const mockCodeContent = `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 实现登录逻辑
    console.log('登录:', { email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">用户登录</h1>
        <Input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          登录
        </Button>
      </form>
    </div>
  );
};
`;

export const mockRequirements: Requirement[] = [
  {
    id: '1',
    title: '优化用户登录流程',
    description: '当前登录流程用户体验较差，需要优化登录页面UI和加载速度',
    createdAt: '2024-01-15 14:30',
    document: `# 用户登录流程优化需求文档

## 背景
当前登录流程存在以下问题：
1. 页面加载速度慢，用户等待时间长
2. UI设计不够友好，缺少视觉反馈
3. 表单验证不完善，容易出错

## 目标
- 将登录页面加载时间从3秒降低到1秒以内
- 优化UI设计，提升用户体验
- 完善表单验证，减少错误提交

## 技术方案
1. 重构登录页面组件，使用React.memo优化渲染
2. 优化API请求，使用并行请求和缓存
3. 添加完整的表单验证逻辑`,
    codeFiles: [
      {
        path: 'src/pages/LoginPage.tsx',
        content: mockCodeContent,
      },
    ],
    tasks: [
      {
        id: '1-1',
        title: '重构登录页面组件',
        status: 'completed',
        agent: 'Claude Sonnet 4.5',
        createdAt: '2024-01-15 14:32',
        parentId: '1',
      },
      {
        id: '1-2',
        title: '优化API请求性能',
        status: 'completed',
        agent: 'Claude Sonnet 4.5',
        createdAt: '2024-01-15 14:35',
        parentId: '1',
      },
      {
        id: '1-3',
        title: '添加表单验证',
        status: 'running',
        agent: 'Claude Sonnet 4.5',
        createdAt: '2024-01-15 14:38',
        parentId: '1',
      },
    ],
  },
  {
    id: '2',
    title: '实现代码审查功能',
    description: '需要一个自动化的代码审查工具，支持多种编程语言',
    createdAt: '2024-01-14 10:20',
    document: `# 代码审查功能需求文档

## 功能描述
实现一个自动化的代码审查工具，能够：
- 检测代码质量问题
- 识别潜在的bug
- 提供优化建议

## 支持的语言
- JavaScript/TypeScript
- Python
- Java
- Go`,
    tasks: [
      {
        id: '2-1',
        title: '设计代码分析引擎',
        status: 'completed',
        agent: 'GPT-5',
        createdAt: '2024-01-14 10:25',
        parentId: '2',
      },
      {
        id: '2-2',
        title: '集成语法检查工具',
        status: 'completed',
        agent: 'GPT-5',
        createdAt: '2024-01-14 11:00',
        parentId: '2',
      },
    ],
  },
];

export const mockSingleTasks: Task[] = [
  {
    id: 's-1',
    title: '修复导航栏响应式问题',
    status: 'completed',
    agent: 'Claude Opus 4',
    createdAt: '2024-01-13 16:45',
  },
  {
    id: 's-2',
    title: '更新依赖包版本',
    status: 'failed',
    agent: 'Claude Sonnet 4.5',
    createdAt: '2024-01-12 09:15',
  },
  {
    id: 's-3',
    title: '实现双因素认证功能',
    status: 'completed',
    agent: 'Claude Sonnet 4.5',
    createdAt: '2024-01-16 10:30',
  },
];




