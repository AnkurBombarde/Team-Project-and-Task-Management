import React from 'react';
import type { ITeamMember } from '../interfaces/ITeamMember';
import Pagination from './Pagination';
import '../styles/TeamManagement.css';

interface TeamMemberListProps {
  teamMembers: ITeamMember[];
  onEdit: (member: ITeamMember) => void;
  onDelete: (id: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAddMember?: () => void;
  isLoading?: boolean;
}

const TeamMemberList: React.FC<TeamMemberListProps> = ({
  teamMembers,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  onAddMember,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="management-container">
        <div className="loading-state">
          <h3>Loading team members...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>Team Management</h1>
        {onAddMember && (
          <button className="add-member-btn" onClick={onAddMember}>
            Add New Team Member
          </button>
        )}
      </div>

      {teamMembers.length === 0 ? (
        <div className="empty-state">
          <h3>No team members found</h3>
          <p>Get started by adding your first team member!</p>
        </div>
      ) : (
        <>
          <div className="management-table-container">
            <div className="overflow-x-auto">
              <table className="management-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Designation</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <tr key={member._id}>
                      <td>
                        <div className="font-medium text-gray-900">{member.name}</div>
                      </td>
                      <td className="text-gray-600">{member.email}</td>
                      <td className="text-gray-600">{member.designation}</td>
                      <td>
                        <div className="management-actions">
                          <button 
                            onClick={() => onEdit(member)}
                            aria-label={`Edit ${member.name}`}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => onDelete(member._id)}
                            aria-label={`Delete ${member.name}`}
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
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
};

export default TeamMemberList;