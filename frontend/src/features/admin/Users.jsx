import React, { useState } from 'react';
import { Search, UserPlus, Shield, Key, Edit, Trash2 } from 'lucide-react';
import { userRolesList } from '../../data/dummyData';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, login } = useAuth();
  const { success } = useToast();

  const filteredUsers = userRolesList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Administration</h1>
          <p className="page-subtitle">Manage system users, roles, and access control permissions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Shield size={16} />}>Roles Matrix</Button>
          <Button icon={<UserPlus size={16} />}>Provision User</Button>
        </div>
      </div>

      <div className="card mb-6">
        <div className="p-4 border-b border-subtle flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-slate-800">
          <div className="search-bar w-full md:w-80">
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder="Search by Name or Role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-secondary">
            <span className="font-semibold text-primary">Demo Mode:</span> Switch roles to simulate different user experiences.
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Assigned Role</th>
                <th>System Permissions</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => {
                  const isActive = (user?.role || 'Principal Investigator') === u.role;
                  return (
                  <tr key={u.id} className={isActive ? 'bg-primary-50 dark:bg-slate-800' : ''}>
                    <td>
                      <div className="font-bold text-primary">{u.name} {isActive && <span className="ml-2 text-xs badge badge-primary">Current You</span>}</div>
                      <div className="text-xs text-secondary">{u.id}@aiia.gov.in</div>
                    </td>
                    <td>
                      <span className="font-semibold text-sm">{u.role}</span>
                    </td>
                    <td>
                      <div className="text-sm truncate max-w-sm text-secondary" title={u.permissions}>
                        {u.permissions}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-success">Active</span>
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {!isActive ? (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            icon={<Key size={14} />}
                            onClick={() => {
                              login({
                                name: u.name,
                                role: u.role,
                                email: `${u.id}@aiia.gov.in`
                              });
                              success(`Role switched to ${u.role}`);
                              // Small delay before reload for toast to show
                              setTimeout(() => window.location.reload(), 1000);
                            }}
                          >
                            Switch to Role
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>Active Session</Button>
                        )}
                        <Button variant="outline" size="sm" icon={<Edit size={14} />} />
                      </div>
                    </td>
                  </tr>
                )})
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-secondary">
                    No users found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
