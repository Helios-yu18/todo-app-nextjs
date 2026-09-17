"use client";

import { useEffect, useState } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

type Filter = "all" | "active" | "completed";

const STORAGE_KEY = "todos";

// サーバーレンダリング時はlocalStorageが無いため、必ず空配列を返す
function loadInitialTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  // クライアントでマウントされてからlocalStorageの内容を反映する（SSRとのHTML不一致を避ける）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ブラウザのlocalStorageという外部システムから初期状態を一度だけ同期している
    setTodos(loadInitialTodos());
    setMounted(true);
  }, []);

  // 変更されるたびにlocalStorageへ保存する（初回読み込み完了後のみ）
  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos, mounted]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() },
      ...prev,
    ]);
    setInput("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const remainingCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - remainingCount;

  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="mb-6 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        ToDoリスト
      </h1>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addTodo();
          }}
          placeholder="やることを入力..."
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          onClick={addTodo}
          className="rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          追加
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-2 text-sm">
        {(
          [
            { key: "all", label: "すべて" },
            { key: "active", label: "未完了" },
            { key: "completed", label: "完了済み" },
          ] as { key: Filter; label: string }[]
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-full px-3 py-1 ${
              filter === key
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ul className="mt-4 flex flex-col gap-2">
        {visibleTodos.length === 0 && (
          <li className="py-8 text-center text-sm text-zinc-400">
            {mounted ? "タスクがありません" : "読み込み中..."}
          </li>
        )}
        {visibleTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="h-5 w-5 cursor-pointer accent-zinc-900 dark:accent-zinc-50"
            />
            <span
              className={`flex-1 break-all ${
                todo.completed
                  ? "text-zinc-400 line-through"
                  : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              aria-label="削除"
              className="text-zinc-400 hover:text-red-500"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <span>残り{remainingCount}件</span>
          {completedCount > 0 && (
            <button onClick={clearCompleted} className="hover:underline">
              完了済みを削除
            </button>
          )}
        </div>
      )}
    </div>
  );
}
