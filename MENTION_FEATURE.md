# @ 提及功能使用说明

## 功能概述

在输入框中输入 `@` 符号，可以快速引用各种资源到对话上下文中，包括：

- 📄 **需求文档** - PRD 和需求规格
- 📚 **Wiki 文档** - 内部知识库文档
- 📝 **飞书文档** - 飞书云文档
- 🔧 **落兵台接口** - API 接口文档
- 🛠️ **MCP 工具** - 各种集成工具

## 使用方法

### 1. 在首页使用

在首页的任务描述输入框中：
1. 输入 `@` 符号
2. 弹出资源选择菜单
3. 输入关键词搜索或直接选择
4. 选中的资源会以标签形式显示在输入框上方

### 2. 在任务拆解页使用

在任务拆解页的聊天输入框中：
1. 同样输入 `@` 触发菜单
2. 选择需要引用的资源
3. AI 会根据引用的资源提供更准确的建议

## 技术实现

### 核心组件

- `MentionInput.tsx` - @ 提及输入组件
  - 支持 @ 触发
  - 实时搜索过滤
  - 资源标签管理
  - 上下文跟踪

### 集成位置

1. **HomePage.tsx** - 主页任务输入框
2. **TaskDecomposePage.tsx** - 任务拆解聊天框

### 资源类型


interface MentionResource {
  id: string;
  type: 'requirement' | 'wiki' | 'feishu' | 'weapons' | 'tool';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  data?: Record<string, unknown>;
}


## 后续扩展

- [ ] 连接真实的 MCP 服务器
- [ ] 实现飞书文档 API 集成
- [ ] 实现落兵台 API 集成
- [ ] 添加资源预览功能
- [ ] 支持多选和批量引用
