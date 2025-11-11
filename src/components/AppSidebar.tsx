import { useState } from "react";
import { ChevronRight, FileText, CheckCircle, Clock, XCircle, Loader2, Plus, Home } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { mockRequirements, mockSingleTasks, Task } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useTaskStore } from "@/store/taskStore";

const StatusIcon = ({ status }: { status: Task['status'] }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'running':
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'failed':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();
  const tasks = useTaskStore((state) => state.tasks);
  const [expandedRequirements, setExpandedRequirements] = useState<Set<string>>(new Set(['1']));

  const toggleRequirement = (id: string) => {
    const newExpanded = new Set(expandedRequirements);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRequirements(newExpanded);
  };

  const handleNewTask = () => {
    navigate("/");
  };

  return (
    <Sidebar className={cn("border-r", collapsed ? "w-16" : "w-64")}>
      <SidebarHeader className="border-b p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 hover:bg-sidebar-accent",
            collapsed && "justify-center px-2"
          )}
          onClick={() => navigate("/")}
        >
          <Home className="h-5 w-5 shrink-0" />
          {!collapsed && <span className="font-semibold">AI 研发平台</span>}
        </Button>
      </SidebarHeader>
      <SidebarContent className="bg-sidebar">
        <div className="p-2">
          <Button
            className={cn(
              "w-full gap-2",
              collapsed && "px-2"
            )}
            onClick={handleNewTask}
          >
            <Plus className="h-4 w-4 shrink-0" />
            {!collapsed && <span>新建任务</span>}
          </Button>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 px-3 py-2">
            {!collapsed && "历史记录"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {/* 需求分组 */}
              {mockRequirements.map((req) => (
                <div key={req.id} className="space-y-0.5">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => toggleRequirement(req.id)}
                      className="group hover:bg-sidebar-accent"
                    >
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedRequirements.has(req.id) && "rotate-90"
                        )}
                      />
                      {!collapsed && (
                        <>
                          <FileText className="h-4 w-4" />
                          <span className="flex-1 truncate text-sm">{req.title}</span>
                          <span className="text-xs text-sidebar-foreground/50">
                            {req.tasks.length}
                          </span>
                        </>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* 子任务 */}
                  {expandedRequirements.has(req.id) && !collapsed && (
                    <div className="ml-6 space-y-0.5">
                      {req.tasks.map((task) => (
                        <SidebarMenuItem key={task.id}>
                          <SidebarMenuButton asChild>
                            <NavLink
                              to={`/task/${task.id}`}
                              className={({ isActive }) =>
                                cn(
                                  "flex items-center gap-2 text-sm",
                                  isActive && "bg-sidebar-accent"
                                )
                              }
                            >
                              <StatusIcon status={task.status} />
                              <span className="flex-1 truncate">{task.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* 新创建的任务 */}
              <div data-sidebar-task-target></div>
              {tasks.map((task) => (
                <SidebarMenuItem
                  key={task.id}
                  className="animate-in slide-in-from-top-2 fade-in duration-300"
                >
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/task/${task.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2",
                          isActive && "bg-sidebar-accent"
                        )
                      }
                    >
                      <StatusIcon status={task.status} />
                      {!collapsed && (
                        <span className="flex-1 truncate text-sm">{task.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* 单个任务 */}
              {mockSingleTasks.map((task) => (
                <SidebarMenuItem key={task.id}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={`/task/${task.id}`}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-2",
                          isActive && "bg-sidebar-accent"
                        )
                      }
                    >
                      <StatusIcon status={task.status} />
                      {!collapsed && (
                        <span className="flex-1 truncate text-sm">{task.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}






