import { cn } from "@/lib/utils";

interface KnowledgeSidebarProps {
  className?: string;
}

export default function KnowledgeSidebar({ className }: KnowledgeSidebarProps) {
  return (
    <div className={cn("w-80 border-r bg-background flex flex-col", className)}>
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">知识库</h2>
        <p className="text-sm text-muted-foreground">知识库功能开发中...</p>
      </div>
    </div>
  );
}