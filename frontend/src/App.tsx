import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { ITeamMember, ITeamMemberFormData } from './interfaces/ITeamMember';
import { fetchTeamMembers, addTeamMember, updateTeamMember, deleteTeamMember } from './api/teamApi';
import TeamMemberList from './components/TeamMemberList';
import TeamMemberForm from './components/TeamMemberForm';
import ProjectManagement from './components/ProjectManagement';
import TaskManagement from './components/TaskManagement';
import './styles/TeamManagement.css';
import './App.css'


function App() {
  const [currentMember, setCurrentMember] = useState<ITeamMember | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [teamMembers, setTeamMembers] = useState<ITeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchTeamMembers()
      .then(data => setTeamMembers(data))
      .catch(_ => setError('Failed to fetch team members'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddMember = () => {
    setCurrentMember(null);
    setShowForm(true);
  };

  const handleEditMember = (member: ITeamMember) => {
    setCurrentMember(member);
    setShowForm(true);
  };

  const handleDeleteMember = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteTeamMember(id);
      setTeamMembers(teamMembers.filter(member => member._id !== id));
    } catch (err) {
      setError('Failed to delete team member');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitMember = async (memberData: ITeamMemberFormData) => {
    setLoading(true);
    setError(null);
    try {
      if (currentMember) {
        // Update existing member
        const updated = await updateTeamMember(currentMember._id, memberData);
        setTeamMembers(teamMembers.map(member => member._id === updated._id ? updated : member));
      } else {
        // Add new member
        const newMember = await addTeamMember(memberData);
        setTeamMembers([...teamMembers, newMember]);
      }
      setShowForm(false);
    } catch (err) {
      setError('Failed to save team member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <nav className="app-nav">
          <div className="nav-container">
            <h1 className="nav-logo">Task Manager</h1>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/teams" className="nav-link">
                   Teams
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/projects" className="nav-link">
                   Projects
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/tasks" className="nav-link">
                  Tasks
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="app-content">
          <Routes>
            <Route path="/teams" element={
              <div className="management-container">
                {showForm ? (
                  <div className="form-section">
                    <TeamMemberForm 
                      initialData={currentMember || undefined}
                      onSubmit={handleSubmitMember}
                      onCancel={() => setShowForm(false)}
                    />
                  </div>
                ) : (
                  <TeamMemberList
                    teamMembers={teamMembers}
                    onEdit={handleEditMember}
                    onDelete={handleDeleteMember}
                    currentPage={1}
                    totalPages={1}
                    onPageChange={() => {}}
                    onAddMember={handleAddMember}
                    isLoading={loading}
                  />
                )}
                {error && (
                  <div className="app-error">
                    {error}
                  </div>
                )}
              </div>
            } />
            <Route path="/projects" element={<ProjectManagement />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/" element={
              <div className="welcome-container">
                <div className="welcome-content">
                  <h1>Welcome to Task Management App</h1>
                  <p>Manage your teams, projects, and tasks efficiently</p>
                  <div className="welcome-features">
                    <div className="feature-card">
                     
                      <h3>Team Management</h3>
                      <p>Organize your team members with ease</p>
                    </div>
                    <div className="feature-card">
                      
                      <h3>Project Tracking</h3>
                      <p>Manage multiple projects efficiently</p>
                    </div>
                    <div className="feature-card">
                      <h3>Task Management</h3>
                      <p>Track tasks and their progress</p>
                    </div>
                  </div>
                  <div className="welcome-actions">
                    <Link to="/teams" className="welcome-btn primary">
                      Get Started
                    </Link>
                    <Link to="/projects" className="welcome-btn secondary">
                      View Projects
                    </Link>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;