import { useState, useEffect } from 'react';
import type { IProject, IProjectFormData } from '../interfaces/IProject';
import { fetchProjects, addProject, updateProject, deleteProject } from '../api/projectApi';
import { fetchTeamMembers } from '../api/teamApi';
import type { ITeamMember } from '../interfaces/ITeamMember';
import '../styles/TeamManagement.css';
import '../styles/ProjectManagement.css'

export default function ProjectManagement() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentProject, setCurrentProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<IProjectFormData>({ name: '', description: '', teamMembers: [] });
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchProjects(),
      fetchTeamMembers()
    ])
      .then(([projectsData, teamMembersData]) => {
        setProjects(projectsData);
        setTeamMembers(teamMembersData);
      })
      .catch(() => setError('Failed to fetch projects or team members'))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (project: IProject) => {
    setCurrentProject(project);
    setForm({
      name: project.name,
      description: project.description,
      teamMembers: project.teamMembers || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteProject(id);
      setProjects(projects.filter(p => p._id !== id));
    } catch {
      setError('Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (currentProject) {
        const updated = await updateProject(currentProject._id, form);
        setProjects(projects.map(p => p._id === updated._id ? updated : p));
      } else {
        const newProject = await addProject(form);
        setProjects([...projects, newProject]);
      }
      setShowForm(false);
      setCurrentProject(null);
      setForm({ name: '', description: '', teamMembers: [] });
    } catch {
      setError('Failed to save project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>Project Management</h1>
        {!showForm && (
          <button className="add-member-btn" onClick={() => setShowForm(true)}>
            + Add New Project
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <h3>Loading projects...</h3>
          <p>Please wait while we fetch your data</p>
        </div>
      )}

      {error && (
        <div className="management-error">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="management-form">
          <h2>{currentProject ? 'Edit Project' : 'Create New Project'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="project-name">Project Name *</label>
              <input
                id="project-name"
                type="text"
                placeholder="Enter project name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="project-description">Description *</label>
              <input
                id="project-description"
                type="text"
                placeholder="Enter project description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
                minLength={10}
                maxLength={500}
              />
            </div>

            <div>
              <label htmlFor="project-team-members">Assign Team Members</label>
              <select
                id="project-team-members"
                multiple
                value={form.teamMembers}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                  setForm(f => ({ ...f, teamMembers: selected }));
                }}
                className="team-members-select"
              >
                {teamMembers.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.designation})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                onClick={() => { setShowForm(false); setCurrentProject(null); }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {currentProject ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <h3>No projects found</h3>
          <p>Get started by creating your first project!</p>
          <button className="add-member-btn" onClick={() => setShowForm(true)}>
            Create First Project
          </button>
        </div>
      ) : (
        <>
          <div className="management-table-container">
            <div className="overflow-x-auto">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Team Members</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project._id}>
                      <td>
                        <div className="font-medium text-white">
                          {project.name}
                        </div>
                      </td>
                      <td className="text-gray-300">{project.description}</td>
                      <td className="text-gray-400">
                        {Array.isArray(project.teamMembers) && teamMembers.length > 0
                          ? project.teamMembers
                              .map(tm => {
                                if (typeof tm === 'string') {
                                  const member = teamMembers.find(m => m._id === tm);
                                  return member ? member.name : tm;
                                } else if (tm && typeof tm === 'object' && (tm as { name?: string }).name) {
                                  return (tm as { name: string }).name;
                                } else {
                                  return '';
                                }
                              })
                              .filter(Boolean)
                              .join(', ')
                          : 'No team members'}
                      </td>
                      <td>
                        <div className="management-actions">
                          <button 
                            onClick={() => handleEdit(project)}
                            className="edit-btn"
                            aria-label={`Edit ${project.name}`}
                          >
                             Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(project._id)}
                            className="delete-btn"
                            aria-label={`Delete ${project.name}`}
                          >
                             Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}