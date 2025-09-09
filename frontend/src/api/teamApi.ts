import type { ITeamMember, ITeamMemberFormData } from '../interfaces/ITeamMember';

const API_URL = 'http://localhost:5000/api/teams';

export async function fetchTeamMembers(): Promise<ITeamMember[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch team members');
  const data = await res.json();
  return data.docs;
}

export async function addTeamMember(data: ITeamMemberFormData): Promise<ITeamMember> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add team member');
  return res.json();
}

export async function updateTeamMember(id: string, data: ITeamMemberFormData): Promise<ITeamMember> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update team member');
  return res.json();
}

export async function deleteTeamMember(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete team member');
}