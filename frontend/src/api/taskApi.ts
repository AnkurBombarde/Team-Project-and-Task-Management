import type { ITask, ITaskFormData } from '../interfaces/ITask';

const API_URL = 'http://localhost:5000/api/tasks';

export async function fetchTasks(): Promise<ITask[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  return data.docs || data; // support both paginated and array response
}

export async function addTask(data: ITaskFormData): Promise<ITask> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add task');
  return res.json();
}

export async function updateTask(id: string, data: ITaskFormData): Promise<ITask> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}
