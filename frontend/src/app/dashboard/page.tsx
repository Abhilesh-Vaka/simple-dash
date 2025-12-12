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

  const filteredTasks = useMemo(() => tasks, [tasks]);

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

  async function applyFilters() {
    try {
      setLoading(true);
      const res = await fetchTasks(filters);
      setTasks(res.tasks);
    } catch (err: any) {
      setError(err.message || "Failed to filter tasks");
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    clearToken();
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center text-slate-600">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 px-6 py-5 shadow-lg shadow-slate-200/70 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome, {user?.name || "user"}
          </h1>
          <p className="text-sm text-slate-600">Manage profile and tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={logout} className="btn-secondary">
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
            <span className="text-xs text-slate-500">
              Email: {user?.email}
            </span>
          </div>
          <div className="mt-4 grid gap-4">
            <label className="text-sm font-semibold text-slate-800">
              Name
              <input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </label>
            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                className="btn-primary"
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save profile"}
              </button>
              <button
                onClick={loadData}
                className="btn-secondary"
                type="button"
              >
                Refresh
              </button>
            </div>
          </div>
        </section>

        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {editId ? "Edit task" : "New task"}
            </h2>
            {editId && (
              <button
                className="text-sm font-semibold text-indigo-600"
                onClick={() => {
                  setEditId(null);
                  setTaskForm(emptyTask);
                }}
              >
                Cancel edit
              </button>
            )}
          </div>
          <div className="mt-4 grid gap-3">
            <input
              value={taskForm.title}
              onChange={(e) =>
                setTaskForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Task title"
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500"
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
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm outline-none focus:border-indigo-500"
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
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
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
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
              <input
                value={taskForm.tags}
                onChange={(e) =>
                  setTaskForm((prev) => ({ ...prev, tags: e.target.value }))
                }
                placeholder="tags (comma separated)"
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <button onClick={handleSubmitTask} className="btn-primary w-full">
              {editId ? "Update task" : "Create task"}
            </button>
          </div>
        </section>
      </div>

      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
            <p className="text-sm text-slate-600">
              Search, filter, and manage your tasks.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              placeholder="Search"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            >
              <option value="">All</option>
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
            <input
              placeholder="Tag"
              value={filters.tag}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, tag: e.target.value }))
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
            <button onClick={applyFilters} className="btn-secondary">
              Apply
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3">
          {filteredTasks.length === 0 && (
            <div className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-600">
              No tasks yet. Create one above.
            </div>
          )}
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-slate-900">
                    {task.title}
                  </h3>
                  <StatusBadge status={task.status} />
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {task.description && (
                  <p className="mt-1 text-sm text-slate-600">{task.description}</p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-slate-500">
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => startEdit(task)}
                >
                  Edit
                </button>
                <button
                  className="btn-primary bg-rose-600 hover:bg-rose-700"
                  onClick={() => removeTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const colors: Record<Task["status"], string> = {
    todo: "bg-slate-100 text-slate-700",
    "in-progress": "bg-amber-100 text-amber-700",
    done: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
}

