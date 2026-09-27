import React, { useState } from 'react';
import { Shield, ShieldCheck, UserCog, CheckCircle2, Lock, Save, X } from 'lucide-react';
import { ROLE_PERMISSIONS, PERMISSIONS } from '../../config/permissions';
import DemoBadge from '../../components/common/DemoBadge';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const ROLE_DESCRIPTIONS = {
  ADMIN:             'System Administrator with full access to all platform features, user management, and security configurations.',
  PI:                'Principal Investigator responsible for overall study conduct, safety oversight, and major protocol approvals.',
  COORDINATOR:       'Study Coordinator managing day-to-day operations, participant screening, visit scheduling, and operational queries.',
  MONITOR:           'Clinical Research Associate (CRA) providing site monitoring, Source Data Verification (SDV), and query management.',
  ETHICS:            'Institutional Ethics Committee member reviewing regulatory documents, compliance milestones, and SAE reports.',
  PHARMACOVIGILANCE: 'Safety Officer conducting medical reviews of adverse events, tracking causality, and generating CIOMS line listings.',
  REGULATOR:         'Regulatory Authority inspector with read-only access for auditing clinical trial compliance and safety data.',
};

const Roles = () => {
  const [selectedRole, setSelectedRole] = useState('PI');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { success, error } = useToast();

  const handleSaveMatrix = (e) => {
    e.preventDefault();
    success(`Access matrix for ${selectedRole.replace('_', ' ')} updated successfully.`);
    setIsEditModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">Roles & Access Management</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Configure Role-Based Access Control (RBAC) schemas for clinical personnel</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 250px' }}>
          <div className="card">
            <div className="card-header border-b border-gray-100 pb-3 mb-2">
              <h3 className="card-title text-sm"><Shield size={16} /> System Roles</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 0.5rem 0.5rem 0.5rem' }}>
              {Object.keys(ROLE_PERMISSIONS).map(role => (
                <button
                  key={role}
                  style={{
                    textAlign: 'left',
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'background-color 0.2s',
                    cursor: 'pointer',
                    border: '1px solid transparent',
                    outline: 'none',
                    backgroundColor: selectedRole === role ? 'var(--primary-light)' : 'transparent',
                    color: selectedRole === role ? 'var(--primary-color)' : 'var(--text-secondary)',
                  }}
                  onMouseOver={(e) => { if(selectedRole !== role) e.currentTarget.style.backgroundColor = 'var(--bg-hover)' }}
                  onMouseOut={(e) => { if(selectedRole !== role) e.currentTarget.style.backgroundColor = 'transparent' }}
                  onClick={() => setSelectedRole(role)}
                >
                  {role.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: '3 1 500px' }}>
          <div className="card">
            <div className="card-header flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {selectedRole === 'ADMIN' ? <ShieldCheck className="text-danger" size={24}/> : <UserCog className="text-primary" size={24}/>}
                  {selectedRole.replace('_', ' ')} Access Profile
                </h2>
                <p className="text-sm text-gray-500 mt-1">{ROLE_DESCRIPTIONS[selectedRole]}</p>
              </div>
              {selectedRole !== 'ADMIN' && (
                <Button variant="outline" size="sm" icon={<Lock size={14} />} onClick={() => setIsEditModalOpen(true)}>Edit Matrix</Button>
              )}
            </div>

            <div className="card-body">
              <h3 className="text-sm font-semibold mb-3">Allocated Permissions ({ROLE_PERMISSIONS[selectedRole].length})</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem 1rem' }}>
                {ROLE_PERMISSIONS[selectedRole].map(perm => (
                  <div key={perm} className="flex items-start gap-2 p-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
                    <CheckCircle2 size={16} className="text-success mt-0.5" style={{ flexShrink: 0 }} />
                    <div>
                      <div className="text-sm font-medium">{perm.split('.')[1].toUpperCase()}</div>
                      <div className="text-xs text-muted">{perm.split('.')[0].toUpperCase()} module</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedRole === 'ADMIN' && (
                <div className="mt-4 p-3 rounded text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
                  <Lock size={16} /> Admin role permissions are immutable and cannot be modified.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal-backdrop" style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content card" style={{ maxWidth: '600px', width: '90%', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Lock size={20} className="text-primary" /> Edit {selectedRole.replace('_', ' ')} Access
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveMatrix}>
              <div className="mb-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem 1rem' }}>
                {Object.keys(PERMISSIONS).map((module) => (
                  <div key={module}>
                    <h4 className="font-semibold text-sm mb-2 mt-2">{module}</h4>
                    {Object.values(PERMISSIONS[module]).map((perm) => (
                      <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', marginBottom: '4px', cursor: 'pointer' }}>
                        <input type="checkbox" defaultChecked={ROLE_PERMISSIONS[selectedRole].includes(perm)} />
                        {perm.split('.')[1]}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                <Button type="submit" icon={<Save size={16} />}>Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
