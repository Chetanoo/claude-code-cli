"use client";

import { ToolInvocation } from "ai";
import { Loader2 } from "lucide-react";

interface ToolInvocationStatusProps {
  toolInvocation: ToolInvocation;
}

function getBasename(path: string): string {
  return path.split("/").filter(Boolean).pop() ?? path;
}

function getLabel(toolInvocation: ToolInvocation): string {
  const { toolName, args } = toolInvocation;
  const path = typeof args?.path === "string" ? args.path : "";
  const filename = path ? getBasename(path) : "";

  if (toolName === "str_replace_editor") {
    if (typeof args?.command !== "string") return toolName;
    switch (args.command) {
      case "create":
        return `Creating ${filename}`;
      case "str_replace":
      case "insert":
        return `Editing ${filename}`;
      case "view":
        return `Reading ${filename}`;
      case "undo_edit":
        return `Undoing edit${filename ? ` in ${filename}` : ""}`;
      default:
        return toolName;
    }
  }

  if (toolName === "file_manager") {
    if (typeof args?.command !== "string") return toolName;
    switch (args.command) {
      case "rename":
        return `Renaming ${filename}`;
      case "delete":
        return `Deleting ${filename}`;
      default:
        return toolName;
    }
  }

  return toolName;
}

export function ToolInvocationStatus({ toolInvocation }: ToolInvocationStatusProps) {
  const label = getLabel(toolInvocation);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isDone = toolInvocation.state === "result" && (toolInvocation as any).result;

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
