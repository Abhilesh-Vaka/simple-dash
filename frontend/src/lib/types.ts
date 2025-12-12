export type User = {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done";
  tags: string[];
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

