import type { IProject, IProjectFormData } from '../interfaces/IProject';

const API_URL = 'http://localhost:5000/api/projects';

export async function fetchProjects(): Promise<IProject[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch projects');
  const data = await res.json();
  return data.docs || data; // support both paginated and array response
}

export async function addProject(data: IProjectFormData): Promise<IProject> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add project');
  return res.json();
}

export async function updateProject(id: string, data: IProjectFormData): Promise<IProject> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update project');
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete project');
}
