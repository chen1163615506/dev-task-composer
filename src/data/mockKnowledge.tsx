import { KnowledgeItem } from "@/types/knowledge";
import { FileText, Users, GitBranch } from "lucide-react";

export const mockMyKnowledge: KnowledgeItem[] = [
  {
    id: "my-knowledge-1",
    title: "React最佳实践指南.md",
    content: "# React最佳实践指南\n\n## 组件设计原则\n\n1. 单一职责原则\n2. 组件应该尽可能小\n3. 使用函数组件和Hooks\n\n## 状态管理\n\n- 本地状态使用useState\n- 复杂状态使用useReducer\n- 全局状态考虑使用Context或Redux\n\n## 性能优化\n\n- 使用React.memo避免不必要的重渲染\n- 使用useCallback和useMemo缓存函数和计算值\n- 懒加载组件和路由",
    type: "my",
    createdAt: "2023-05-15T08:30:00Z",
    updatedAt: "2023-06-20T14:45:00Z",
    isPublic: false,
    gitBound: false,
    creator: {
      id: "user-1",
      name: "当前用户",
      avatar: "/avatars/user1.png"
    },
    tags: ["React", "前端", "最佳实践"],
    permission: "owner"
  },
  {
    id: "my-knowledge-2",
    title: "TypeScript类型体操.md",
    content: "# TypeScript类型体操\n\n## 基础类型\n\n- Partial<T>\n- Required<T>\n- Readonly<T>\n- Record<K, T>\n\n## 高级类型技巧\n\n- 条件类型\n- 映射类型\n- 模板字面量类型\n- infer关键字\n\n## 实战案例\n\n- 实现DeepPartial\n- 实现Flatten\n- 类型安全的事件系统",
    type: "my",
    createdAt: "2023-07-10T10:15:00Z",
    updatedAt: "2023-08-05T16:20:00Z",
    isPublic: true,
    gitBound: true,
    gitRepo: "my-typescript-notes",
    creator: {
      id: "user-1",
      name: "当前用户",
      avatar: "/avatars/user1.png"
    },
    tags: ["TypeScript", "类型", "前端"],
    permission: "owner"
  }
];

export const mockSharedKnowledge = {
  created: [
    {
      id: "shared-created-1",
      title: "团队Git工作流规范.md",
      content: "# 团队Git工作流规范\n\n## 分支管理\n\n- main: 主分支，与生产环境保持一致\n- develop: 开发分支，所有特性开发完成后合并到此分支\n- feature/*: 特性分支，从develop分支创建\n- hotfix/*: 紧急修复分支，从main分支创建\n\n## 提交规范\n\n- feat: 新功能\n- fix: 修复bug\n- docs: 文档更新\n- style: 代码风格修改\n- refactor: 代码重构\n- test: 测试相关\n- chore: 构建过程或辅助工具的变动",
      type: "shared",
      createdAt: "2023-04-20T09:00:00Z",
      updatedAt: "2023-09-12T11:30:00Z",
      isPublic: true,
      gitBound: true,
      gitRepo: "team-workflow",
      creator: {
        id: "user-1",
        name: "当前用户",
        avatar: "/avatars/user1.png"
      },
      tags: ["Git", "工作流", "规范"],
      permission: "owner"
    }
  ],
  added: [
    {
      id: "shared-added-1",
      title: "微前端架构设计.md",
      content: "# 微前端架构设计\n\n## 概述\n\n微前端是一种类似于微服务的架构，它将微服务的理念应用于浏览器端，即将单页面应用（SPA）拆分成多个小型前端应用，每个应用可以独立开发、测试和部署。\n\n## 实现方式\n\n1. 基于路由分发\n2. 使用iFrame\n3. 使用Web Components\n4. 基于JavaScript模块化\n\n## 常见框架\n\n- single-spa\n- qiankun\n- micro-app\n- module federation",
      type: "shared",
      createdAt: "2023-03-05T14:20:00Z",
      updatedAt: "2023-08-18T17:45:00Z",
      isPublic: true,
      gitBound: true,
      gitRepo: "micro-frontend-docs",
      creator: {
        id: "user-2",
        name: "张三",
        avatar: "/avatars/user2.png"
      },
      tags: ["微前端", "架构", "前端"],
      permission: "edit"
    },
    {
      id: "shared-added-2",
      title: "CI/CD最佳实践.md",
      content: "# CI/CD最佳实践\n\n## 持续集成(CI)\n\n- 频繁提交代码\n- 自动化测试\n- 代码质量检查\n- 构建制品\n\n## 持续交付(CD)\n\n- 自动化部署\n- 环境一致性\n- 回滚策略\n- 灰度发布\n\n## 工具链\n\n- Jenkins\n- GitLab CI\n- GitHub Actions\n- CircleCI\n- ArgoCD",
      type: "shared",
      createdAt: "2023-02-15T11:10:00Z",
      updatedAt: "2023-07-30T09:25:00Z",
      isPublic: false,
      gitBound: true,
      gitRepo: "devops-practices",
      creator: {
        id: "user-3",
        name: "李四",
        avatar: "/avatars/user3.png"
      },
      tags: ["DevOps", "CI/CD", "自动化"],
      permission: "view"
    }
  ]
};

export const mockMarketKnowledge: KnowledgeItem[] = [
  {
    id: "market-1",
    title: "React性能优化指南.md",
    content: "# React性能优化指南\n\n## 常见性能问题\n\n1. 不必要的重渲染\n2. 大型列表渲染\n3. 昂贵的计算\n4. 网络请求优化\n\n## 优化技巧\n\n- 使用React.memo、useMemo和useCallback\n- 虚拟列表和分页\n- Web Workers处理复杂计算\n- 数据预取与缓存\n- 代码分割与懒加载",
    type: "market",
    createdAt: "2023-01-10T10:00:00Z",
    updatedAt: "2023-06-15T15:30:00Z",
    isPublic: true,
    gitBound: true,
    gitRepo: "react-performance",
    creator: {
      id: "user-4",
      name: "王五",
      avatar: "/avatars/user4.png"
    },
    tags: ["React", "性能优化", "前端"],
    permission: "view"
  },
  {
    id: "market-2",
    title: "GraphQL实战指南.md",
    content: "# GraphQL实战指南\n\n## 基础概念\n\n- Schema和类型系统\n- 查询和变更\n- 解析器\n- 订阅\n\n## 最佳实践\n\n- 设计Schema\n- N+1问题处理\n- 缓存策略\n- 错误处理\n- 安全性考虑\n\n## 常用工具\n\n- Apollo Client/Server\n- Relay\n- urql\n- GraphQL Code Generator",
    type: "market",
    createdAt: "2023-03-20T13:45:00Z",
    updatedAt: "2023-08-10T11:20:00Z",
    isPublic: true,
    gitBound: true,
    gitRepo: "graphql-guide",
    creator: {
      id: "user-5",
      name: "赵六",
      avatar: "/avatars/user5.png"
    },
    tags: ["GraphQL", "API", "后端"],
    permission: "view"
  },
  {
    id: "market-3",
    title: "Docker容器化应用指南.md",
    content: "# Docker容器化应用指南\n\n## 基础概念\n\n- 镜像和容器\n- Dockerfile\n- 容器网络\n- 数据卷\n\n## 最佳实践\n\n- 构建轻量级镜像\n- 多阶段构建\n- 安全性考虑\n- 资源限制\n\n## 常用命令\n\n- docker build\n- docker run\n- docker-compose\n- docker network\n- docker volume",
    type: "market",
    createdAt: "2023-04-05T09:30:00Z",
    updatedAt: "2023-09-01T14:15:00Z",
    isPublic: true,
    gitBound: true,
    gitRepo: "docker-guide",
    creator: {
      id: "user-6",
      name: "孙七",
      avatar: "/avatars/user6.png"
    },
    tags: ["Docker", "容器化", "DevOps"],
    permission: "view"
  }
];

export const getKnowledgeIcon = (item: KnowledgeItem) => {
  if (item.type === "my") {
    return <FileText className="h-5 w-5 text-blue-500" />;
  } else if (item.type === "shared") {
    return <Users className="h-5 w-5 text-purple-500" />;
  } else {
    return <GitBranch className="h-5 w-5 text-green-500" />;
  }
};