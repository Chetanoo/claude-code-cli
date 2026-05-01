import { afterEach, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ToolInvocationStatus } from "../ToolInvocationStatus";
import { ToolInvocation } from "ai";

afterEach(() => cleanup());

function makeInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "call" | "result" = "result",
  result: unknown = "Success"
): ToolInvocation {
  if (state === "result") {
    return { toolCallId: "test", toolName, args, state, result } as ToolInvocation;
  }
  return { toolCallId: "test", toolName, args, state } as ToolInvocation;
}

// str_replace_editor labels
test("shows 'Creating <file>' for str_replace_editor create command", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" })} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("shows 'Editing <file>' for str_replace_editor str_replace command", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("str_replace_editor", { command: "str_replace", path: "/components/Button.jsx" })} />);
  expect(screen.getByText("Editing Button.jsx")).toBeDefined();
});

test("shows 'Editing <file>' for str_replace_editor insert command", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("str_replace_editor", { command: "insert", path: "/App.jsx" })} />);
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Reading <file>' for str_replace_editor view command", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("str_replace_editor", { command: "view", path: "/lib/utils.ts" })} />);
  expect(screen.getByText("Reading utils.ts")).toBeDefined();
});

test("shows 'Undoing edit in <file>' for str_replace_editor undo_edit command", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })} />);
  expect(screen.getByText("Undoing edit in App.jsx")).toBeDefined();
});

// file_manager labels
test("shows 'Renaming <file>' for file_manager rename command", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("file_manager", { command: "rename", path: "/OldName.jsx", new_path: "/NewName.jsx" })} />);
  expect(screen.getByText("Renaming OldName.jsx")).toBeDefined();
});

test("shows 'Deleting <file>' for file_manager delete command", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("file_manager", { command: "delete", path: "/App.jsx" })} />);
  expect(screen.getByText("Deleting App.jsx")).toBeDefined();
});

// Fallback cases
test("shows raw tool name for unknown tool", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("some_other_tool", { command: "do_something", path: "/App.jsx" })} />);
  expect(screen.getByText("some_other_tool")).toBeDefined();
});

test("shows raw tool name when args has no command", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("str_replace_editor", {})} />);
  expect(screen.getByText("str_replace_editor")).toBeDefined();
});

// State: pending vs completed
test("shows spinner when state is call (pending)", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "call")} />);
  const spinner = document.querySelector(".animate-spin");
  expect(spinner).toBeDefined();
  expect(document.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when state is result with result value", () => {
  render(<ToolInvocationStatus toolInvocation={makeInvocation("str_replace_editor", { command: "create", path: "/App.jsx" }, "result", "Success")} />);
  expect(document.querySelector(".bg-emerald-500")).toBeDefined();
  expect(document.querySelector(".animate-spin")).toBeNull();
});
