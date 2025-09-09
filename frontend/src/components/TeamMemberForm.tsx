import React, { useState, useEffect } from 'react';
import type { ITeamMember, ITeamMemberFormData } from '../interfaces/ITeamMember';
import '../styles/TeamManagement.css';

interface TeamMemberFormProps {
  initialData?: ITeamMember;
  onSubmit: (data: ITeamMemberFormData) => void;
  onCancel?: () => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ITeamMemberFormData>({
    name: '',
    email: '',
    designation: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        email: initialData.email,
        designation: initialData.designation
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="management-form">
      <h2>
        {initialData ? 'Edit Team Member' : 'Add New Team Member'}
      </h2>
      
      <form onSubmit={handleSubmit} >
        <div>
          <label htmlFor="name">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
            
          />
        </div>
        
        <div>
          <label htmlFor="email">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
          />
        </div>
        
        <div>
          <label htmlFor="designation" >
            Designation *
          </label>
          <input
            type="text"
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            required
            placeholder="Enter job title"
            
          />
        </div>
        
        <div>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className='cancel-btn'
            >
              Cancel
            </button>
          )}
          <button
            type="submit" 
            className='submit-btn'
          >
            {initialData ? 'Update Member' : 'Create Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamMemberForm;