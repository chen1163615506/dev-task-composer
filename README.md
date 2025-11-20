# Dev Task Composer

A modern, AI-powered task planning and decomposition application built with Vite, React, and TypeScript. This single-page application helps developers describe, plan, and decompose work with intelligent AI assistance and an intuitive interface.

## 📋 Project Overview

Dev Task Composer is designed to streamline the software development planning process by providing:

- **Smart Task Planning**: Describe work using natural language with advanced @-mention capabilities
- **AI-Powered Assistance**: Integrated AI agents to help decompose complex tasks into manageable subtasks
- **Visual Workflow**: Track task progress with an intuitive dashboard and detailed review interface
- **Repository Integration**: Connect with your repositories and branches for contextual task management

## 🚀 Tech Stack

### Core Technologies
- **[Vite](https://vitejs.dev/)** - Lightning-fast build tool and dev server
- **[React 18](https://react.dev/)** - Modern UI library with concurrent features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React Router](https://reactrouter.com/)** - Declarative routing for single-page applications

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn-ui](https://ui.shadcn.com/)** - High-quality, accessible React components
- **[lucide-react](https://lucide.dev/)** - Beautiful, consistent icon library
- **[Sonner](https://sonner.emilkowal.ski/)** - Elegant toast notifications

### State Management
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight client-side state management for task data
- **[React Query](https://tanstack.com/query)** - Powerful async state management and data fetching

## ✨ Key Features

### Advanced MentionInput
- Rich text editing with contentEditable support
- Smart @-mention search across:
  - Requirements and specifications
  - Code files and paths
  - Available tools and integrations
- Keyboard navigation (Up/Down arrows, Enter to select, Escape to close)
- Real-time syntax highlighting

### Home Dashboard
- Intuitive work description interface
- Repository and branch selection
- AI agent selection (Claude Sonnet 4.5, Claude Opus 4, GPT-5)
- Dual execution modes:
  - **Plan**: Generate a task breakdown without execution
  - **Remote**: Execute tasks on remote infrastructure
- Animated sidebar with real-time feedback

### Task Detail View
- Code diff visualization
- Review actions (Approve, Request Changes, Comment)
- Agent chat logs and conversation history
- Task status tracking

### Task Decomposition Workspace
- Split-panel interface with:
  - AI chat panel with mention support
  - Editable task lists
  - Requirement documentation viewer
  - Code snippet browser
- Real-time collaboration with AI agents
- Task hierarchy management

### Responsive Navigation
- Collapsible sidebar with task history
- Quick access to recent tasks and requirements
- Mobile-friendly responsive design

## 📁 Project Structure

```
dev-task-composer/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn-ui components
│   │   ├── Layout.tsx      # Main layout wrapper
│   │   ├── AppSidebar.tsx  # Sidebar navigation with task history
│   │   └── MentionInput.tsx # Advanced mention input component
│   ├── pages/              # Route pages
│   │   ├── HomePage.tsx    # Main dashboard for task creation
│   │   ├── TaskDetailPage.tsx # Task review and detail view
│   │   ├── TaskDecomposePage.tsx # Task decomposition workspace
│   │   └── NotFound.tsx    # 404 page
│   ├── data/               # Mock data and types
│   │   └── mockData.ts     # Repositories, requirements, tasks, agents
│   ├── store/              # Zustand state stores
│   │   └── taskStore.ts    # Task state management
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── App.tsx             # Root application component
│   └── main.tsx            # Application entry point
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** 18.x or higher ([Download Node.js](https://nodejs.org/))
- **npm** 9.x or higher (comes with Node.js)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dev-task-composer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

## 📖 Usage

### Creating a New Task

1. **Navigate to the Home Dashboard** (`/`)
   
2. **Describe Your Work**
   - Use the MentionInput field to describe what you want to accomplish
   - Type `@` to trigger the mention menu and search for:
     - **Requirements**: Reference existing specifications
     - **Files**: Link to specific code files
     - **Tools**: Mention available development tools

3. **Configure Task Settings**
   - **Select Repository**: Choose the target repository from the dropdown
   - **Select Branch**: Pick the branch where work should be performed
   - **Select AI Agent**: Choose an AI agent (Claude Sonnet 4.5, Claude Opus 4, or GPT-5)

4. **Execute**
   - Click **"Plan Task"** to generate a task breakdown without execution
   - Click **"Run Remotely"** to execute the task on remote infrastructure

### Reviewing Task Details

1. **Access from Sidebar**: Click any task from the sidebar history
2. **Review Changes**: View code diffs and modifications
3. **Take Action**:
   - **Approve**: Accept the changes
   - **Request Changes**: Ask for modifications
   - **Comment**: Add feedback without approval/rejection
4. **View Agent Logs**: Expand the chat section to see the AI's reasoning

### Decomposing Tasks

1. **Navigate to Decomposition Workspace** (`/decompose`)
2. **Use the Chat Panel** (left side):
   - Discuss task breakdown with the AI agent
   - Use @-mentions to reference requirements and files
3. **Manage Task Lists** (right side):
   - View generated subtasks
   - Edit task descriptions
   - Reorder tasks by priority
4. **Reference Documentation**:
   - Switch to the "Requirements" tab to view specifications
   - Switch to the "Code" tab to browse relevant code snippets

### Keyboard Shortcuts in MentionInput

- **`@`**: Open mention menu
- **`↑` / `↓`**: Navigate mention suggestions
- **`Enter`**: Select highlighted mention
- **`Escape`**: Close mention menu

## 📜 Available Scripts

### Development

```bash
npm run dev
```
Starts the development server with hot module replacement (HMR) at `http://localhost:5173`.

### Build

```bash
npm run build
```
Creates an optimized production build in the `dist/` directory.

```bash
npm run build:dev
```
Creates a development build (useful for debugging production issues).

### Preview

```bash
npm run preview
```
Locally preview the production build. Run `npm run build` first.

### Lint

```bash
npm run lint
```
Runs ESLint to check code quality and identify potential issues.

## 🎨 Customization

### Adding New AI Agents

Edit `src/data/mockData.ts` and add to the `mockAgents` array:

```typescript
export const mockAgents: Agent[] = [
  { id: '4', name: 'Your Agent', model: 'your-model' },
  // ... existing agents
];
```

### Adding New Repositories

Edit `src/data/mockData.ts` and add to the `mockRepositories` array:

```typescript
export const mockRepositories: Repository[] = [
  { id: '4', name: 'your-repo', url: 'https://github.com/your/repo' },
  // ... existing repositories
];
```

### Customizing Theme

Tailwind configuration is in `tailwind.config.ts`. Modify the theme object to customize colors, spacing, fonts, and more.

shadcn-ui components can be customized via `src/index.css` CSS variables.

## 🏗️ Architecture

### State Management Strategy

- **Zustand** (`taskStore`): Manages client-side task creation and history
  - Tasks created by users are stored locally
  - Persists task history for sidebar navigation
  
- **React Query**: Handles async operations and server state
  - (Currently using mock data, ready for API integration)
  - Provides caching, refetching, and optimistic updates

### Routing Structure

- **`/`**: Home dashboard (task creation)
- **`/task/:taskId`**: Task detail and review page
- **`/decompose`**: Task decomposition workspace
- **`*`**: 404 Not Found page

All routes except `/decompose` are wrapped in the `Layout` component, which provides the sidebar navigation.

## 🔮 Future Enhancements

- [ ] Real API integration (replace mock data)
- [ ] User authentication and authorization
- [ ] Real-time collaboration features
- [ ] Task scheduling and reminders
- [ ] Advanced code diff tools
- [ ] Integration with GitHub/GitLab APIs
- [ ] Persistent backend storage
- [ ] Team workspace features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Built with ❤️ using modern web technologies**
