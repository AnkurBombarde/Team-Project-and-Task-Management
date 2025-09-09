import { useState, useEffect } from 'react';
import type { ITask, ITaskFormData } from '../interfaces/ITask';
import { fetchTasks, addTask, updateTask, deleteTask } from '../api/taskApi';
import { fetchTeamMembers } from '../api/teamApi';
import type { ITeamMember } from '../interfaces/ITeamMember';
import '../styles/TeamManagement.css';
import '../styles/TaskManagement.css';

export default function TaskManagement() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ITaskFormData>({ 
    title: '', 
    description: '', 
    deadline: '', 
    assignedMembers: [], 
    status: 'to-do' 
  });
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTasks(),
      fetchTeamMembers()
    ])
      .then(([tasksData, teamMembersData]) => {
        setTasks(tasksData);
        setTeamMembers(teamMembersData);
      })
      .catch(() => setError('Failed to fetch tasks or team members'))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (task: ITask) => {
    setCurrentTask(task);
    setForm({
      title: task.title,
      description: task.description,
      deadline: task.deadline ? task.deadline.slice(0, 10) : '',
      assignedMembers: task.assignedMembers || [],
      status: task.status || 'to-do',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t._id !== id));
    } catch {
      setError('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (currentTask) {
        const updated = await updateTask(currentTask._id, form);
        setTasks(tasks.map(t => t._id === updated._id ? updated : t));
      } else {
        const newTask = await addTask(form);
        setTasks([...tasks, newTask]);
      }
      setShowForm(false);
      setCurrentTask(null);
      setForm({ 
        title: '', 
        description: '', 
        deadline: '', 
        assignedMembers: [], 
        status: 'to-do' 
      });
    } catch {
      setError('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'to-do': return 'status-todo';
      case 'in-progress': return 'status-in-progress';
      case 'done': return 'status-done';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };
  const getDeadlineClass = (deadline: string | undefined) => {
  if (!deadline) return '';
  
  const today = new Date();
  const taskDate = new Date(deadline);
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'deadline-passed';
  if (diffDays === 0) return 'deadline-urgent';
  if (diffDays <= 3) return 'deadline-warning';
  return 'deadline-normal';
};

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>Task Management</h1>
        {!showForm && (
          <button className="add-member-btn" onClick={() => setShowForm(true)}>
            + Add New Task
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-state">
          <h3>Loading tasks...</h3>
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
          <h2>{currentTask ? 'Edit Task' : 'Create New Task'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="task-title">Title *</label>
              <input
                id="task-title"
                type="text"
                placeholder="Enter task title"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
                minLength={3}
                maxLength={100}
              />
            </div>

            <div>
              <label htmlFor="task-description">Description *</label>
              <input
                id="task-description"
                type="text"
                placeholder="Enter task description"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                required
                minLength={10}
                maxLength={500}
              />
            </div>

            <div>
              <label htmlFor="task-deadline">Deadline *</label>
              <input
                id="task-deadline"
                type="date"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                required
                className="date-input"
              />
            </div>



            <div>
              <label htmlFor="task-members">Assign Team Members</label>
              <select
                id="task-members"
                multiple
                value={form.assignedMembers}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                  setForm(f => ({ ...f, assignedMembers: selected }));
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

            <div>
              <label htmlFor="task-status">Status *</label>
              <select
                id="task-status"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}
                required
                className="task-status-select"
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                onClick={() => { setShowForm(false); setCurrentTask(null); }}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {currentTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Get started by creating your first task!</p>
          <button className="add-member-btn" onClick={() => setShowForm(true)}>
            Create First Task
          </button>
        </div>
      ) : (
        <>
          <div className="management-table-container">
            <div className="overflow-x-auto">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Assigned Members</th>
                    
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task._id} className={getDeadlineClass(task.deadline)}>
                      <td>
                        <div className="font-medium text-white">
                          {task.title}
                        </div>
                      </td>
                      <td className="text-gray-300">{task.description}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="text-gray-400">
                        {Array.isArray(task.assignedMembers) && teamMembers.length > 0
                          ? task.assignedMembers
                              .map(am => {
                                if (typeof am === 'string') {
                                  const member = teamMembers.find(m => m._id === am);
                                  return member ? member.name : am;
                                } else if (am && typeof am === 'object' && (am as { name?: string }).name) {
                                  return (am as { name: string }).name;
                                } else {
                                  return '';
                                }
                              })
                              .filter(Boolean)
                              .join(', ')
                          : 'No members assigned'}
                      </td>
                      
                      <td className="deadline-cell">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                      </td>
                      <td>
                        <div className="management-actions">
                          <button 
                            onClick={() => handleEdit(task)}
                            className="edit-btn"
                            aria-label={`Edit ${task.title}`}
                          >
                             Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(task._id)}
                            className="delete-btn"
                            aria-label={`Delete ${task.title}`}
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