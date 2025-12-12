"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearToken,
  createTask,
  deleteTask,
  fetchProfile,
  fetchTasks,
  getToken,
  updateProfile,
  updateTask,
} from "@/lib/api";
import { Task, User } from "@/lib/types";

type TaskFormState = {
  title: string;
  description: string;
  status: Task["status"];
  tags: string;
  dueDate: string;
};

const emptyTask: TaskFormState = {
  title: "",
  description: "",
  status: "todo",
  tags: "",
  dueDate: "",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ search: "", status: "", tag: "" });
  const [taskForm, setTaskForm] = useState<TaskFormState>(emptyTask);
  const [editId, setEditId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        !filters.search ||
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesTag =
        !filters.tag ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(filters.tag.toLowerCase())
        );
      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [tasks, filters]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [profileRes, tasksRes] = await Promise.all([
        fetchProfile(),
        fetchTasks(),
      ]);
      setUser(profileRes.user);
      setProfileName(profileRes.user.name);
      setTasks(tasksRes.tasks);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard");
      if (err.message?.toLowerCase().includes("token")) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    if (!profileName.trim()) return;
    try {
      setSavingProfile(true);
      const res = await updateProfile({ name: profileName.trim() });
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSubmitTask() {
    if (!taskForm.title.trim()) {
      setError("Title is required");
      return;
    }
    const payload: Partial<Task> = {
      title: taskForm.title.trim(),
      description: taskForm.description,
      status: taskForm.status,
      tags: taskForm.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      dueDate: taskForm.dueDate ? new Date(taskForm.dueDate).toISOString() : undefined,
    };
    try {
      setError(null);
      if (editId) {
        const res = await updateTask(editId, payload);
        setTasks((prev) =>
          prev.map((t) => (t.id === editId ? res.task : t))
        );
      } else {
        const res = await createTask(payload);
        setTasks((prev) => [res.task, ...prev]);
      }
      setTaskForm(emptyTask);
      setEditId(null);
    } catch (err: any) {
      setError(err.message || "Failed to save task");
    }
  }

  function startEdit(task: Task) {
    setEditId(task.id);
    setTaskForm({
      title: task.title,
      description: task.description || "",
      status: task.status,
      tags: task.tags.join(", "),
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
    });
  }

  async function removeTask(id: string) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
    }
  }


  const logout = () => {
    clearToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/10">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/10">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <header className="mb-8 rounded-3xl border border-white/20 bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-indigo-600/10 p-8 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-lg">
                Dashboard
              </div>
              <h1 className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-4xl font-extrabold text-transparent">
                Welcome back, {user?.name || "user"} 👋
              </h1>
              <p className="text-slate-600">Manage your profile and tasks efficiently.</p>
            </div>
            <button
              onClick={logout}
              className="group rounded-xl border-2 border-slate-200 bg-white/80 px-6 py-3 font-semibold text-slate-700 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-slate-300 hover:bg-white hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                Logout
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </button>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-slate-900">{taskStats.total}</div>
              <div className="text-xs text-slate-600">Total Tasks</div>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-slate-600">{taskStats.todo}</div>
              <div className="text-xs text-slate-600">To Do</div>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-amber-600">{taskStats.inProgress}</div>
              <div className="text-xs text-slate-600">In Progress</div>
            </div>
            <div className="rounded-xl border border-white/20 bg-white/60 p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-emerald-600">{taskStats.done}</div>
              <div className="text-xs text-slate-600">Done</div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 animate-shake rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Profile Card */}
          <section className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Profile</h2>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                👤
              </div>
            </div>
            <div className="mb-4 rounded-xl bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</div>
              <div className="mt-1 text-sm font-medium text-slate-900">{user?.email}</div>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
                <input
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/60 disabled:opacity-50"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving..." : "Save Profile"}
                </button>
                <button
                  onClick={loadData}
                  className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-md"
                  type="button"
                >
                  ↻
                </button>
              </div>
            </div>
          </section>

          {/* Task Form Card */}
          <section className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                {editId ? "Edit Task" : "New Task"}
              </h2>
              {editId && (
                <button
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100"
                  onClick={() => {
                    setEditId(null);
                    setTaskForm(emptyTask);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="space-y-4">
              <input
                value={taskForm.title}
                onChange={(e) =>
                  setTaskForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Task title"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <textarea
                value={taskForm.description}
                onChange={(e) =>
                  setTaskForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Description"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                rows={3}
              />
              <div className="grid gap-3 sm:grid-cols-3">
                <select
                  value={taskForm.status}
                  onChange={(e) =>
                    setTaskForm((prev) => ({
                      ...prev,
                      status: e.target.value as Task["status"],
                    }))
                  }
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="todo">To do</option>
                  <option value="in-progress">In progress</option>
                  <option value="done">Done</option>
                </select>
                <input
                  type="date"
                  value={taskForm.dueDate}
                  onChange={(e) =>
                    setTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <input
                  value={taskForm.tags}
                  onChange={(e) =>
                    setTaskForm((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  placeholder="tags (comma separated)"
                  className="rounded-xl border border-slate-200 bg-white/80 px-3 py-2.5 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <button
                onClick={handleSubmitTask}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/60"
              >
                {editId ? "Update Task" : "Create Task"}
              </button>
            </div>
          </section>
        </div>

        {/* Tasks Section */}
        <section className="mt-6 rounded-2xl border border-white/20 bg-white/70 p-6 shadow-xl backdrop-blur-xl">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Tasks</h2>
              <p className="mt-1 text-sm text-slate-600">
                Search, filter, and manage your tasks efficiently.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <input
                  placeholder="🔍 Search tasks..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-48 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">All Status</option>
                <option value="todo">To do</option>
                <option value="in-progress">In progress</option>
                <option value="done">Done</option>
              </select>
              <input
                placeholder="Filter by tag"
                value={filters.tag}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, tag: e.target.value }))
                }
                className="rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 && (
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/30 px-8 py-12 text-center">
                <div className="mb-3 text-4xl">📋</div>
                <p className="text-sm font-medium text-slate-600">No tasks yet. Create one above!</p>
              </div>
            )}
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="group animate-fade-in-delay-2 rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:scale-[1.01] hover:border-indigo-200 hover:bg-white hover:shadow-lg"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                      <StatusBadge status={task.status} />
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {task.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600">{task.description}</p>
                    )}
                    {task.dueDate && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span>📅</span>
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-300 hover:scale-105 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md"
                      onClick={() => startEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-500/60"
                      onClick={() => removeTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const config: Record<
    Task["status"],
    { bg: string; text: string; emoji: string }
  > = {
    todo: {
      bg: "bg-gradient-to-r from-slate-100 to-slate-200",
      text: "text-slate-700",
      emoji: "⏳",
    },
    "in-progress": {
      bg: "bg-gradient-to-r from-amber-100 to-yellow-100",
      text: "text-amber-700",
      emoji: "🚀",
    },
    done: {
      bg: "bg-gradient-to-r from-emerald-100 to-green-100",
      text: "text-emerald-700",
      emoji: "✅",
    },
  };
  const { bg, text, emoji } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${bg} ${text} shadow-sm`}
    >
      <span>{emoji}</span>
      <span className="capitalize">{status.replace("-", " ")}</span>
    </span>
  );
}

