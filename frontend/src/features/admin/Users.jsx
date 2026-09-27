import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Shield, Key, Edit, RefreshCw, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

/* ── Role badge colours ────────────────────────────────────────────────── */
const ROLE_BADGE = {
  ADMIN:             'badge-danger',
  PI:                'badge-primary',
  COORDINATOR:       'badge-success',
  MONITOR:           'badge-warning',
  ETHICS:            'badge-info',
  PHARMACOVIGILANCE: 'badge-warning',
  REGULATOR:         'badge-default',
};

const ROLE_PERMISSIONS = {
  ADMIN:             'Full system access: all modules, user management, audit',
  PI:                'Study create/update, participants, visits, deviations, safety',
  COORDINATOR:       'Participants, visits, queries, deviations (operational)',
  MONITOR:           'Read + query/deviation management (monitoring scope)',
  ETHICS:            'Read + regulatory/ethics review, compliance oversight',
  PHARMACOVIGILANCE: 'Read + safety events, PV review, adverse event management',
  REGULATOR:         'Read-only: studies, compliance, safety, regulatory, audit',
};

const Users = () => {
  const [searchTerm, setSearchTerm]   = useState('');
  const [roleFilter, setRoleFilter]   = useState('all');
  const [usersList, setUsersList]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [switching, setSwitching]     = useState(null); // track which user is switching
  const { user: currentUser, login }  = useAuth();
  const { success, error }            = useToast();
  const navigate                      = useNavigate();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsersList(data);
    } catch (err) {
      console.error('Failed to load users:', err);
      error('Failed to load users. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = usersList.filter(u => {
    const nameMatch = u.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const emailMatch = u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = roleFilter === 'all' || u.role === roleFilter;
    return (nameMatch || emailMatch) && roleMatch;
  });

  /* ── Switch to role by re-authenticating ─────────────────────────────── */
  const handleSwitchRole = async (u) => {
    if (!u.email) { error('Cannot switch: user email not available.'); return; }

    // Derive password from seeded convention
    const roleStr = u.role === 'PHARMACOVIGILANCE' ? 'PV'
      : u.role === 'PI' ? 'PI'
      : (u.role.charAt(0).toUpperCase() + u.role.slice(1).toLowerCase());
    const password = `${roleStr}@12345`;

    setSwitching(u._id || u.id);
    try {
      await login({ email: u.email, password });
      success(`Switched to ${u.role} — ${u.name}`);
      setTimeout(() => window.location.reload(), 600);
    } catch (err) {
      error(`Role switch failed: ${err.message || 'Invalid credentials for this account'}`);
    } finally {
      setSwitching(null);
    }
  };

  /* ── render ── */
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Administration</h1>
          <p className="page-subtitle">
            System users, roles, and access control — {usersList.length} registered accounts
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button variant="outline" icon={<RefreshCw size={15} />} onClick={loadUsers} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh'}
          </Button>
          <Button variant="outline" icon={<Shield size={16} />} onClick={() => navigate('/admin/roles')}>
            Roles Matrix
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <div className="search-bar" style={{ flex: '1 1 240px' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: '0.85rem' }}
          >
            <option value="all">All Roles</option>
            {Object.keys(ROLE_PERMISSIONS).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary-color)' }}>Demo Mode:</span> Click "Switch to Role" to simulate different user perspectives via real backend auth.
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>System Permissions</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading users…</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No users match your criteria.</td></tr>
              ) : (
                filteredUsers.map(u => {
                  const isCurrentUser = currentUser?.id === (u._id || u.id) || currentUser?.email === u.email;
                  return (
                    <tr key={u._id || u.id} style={{ background: isCurrentUser ? 'var(--primary-light)' : undefined }}>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {u.name}
                          {isCurrentUser && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>You</span>}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{u.email}</span>
                      </td>
                      <td>
                        <span className={`badge ${ROLE_BADGE[u.role] || 'badge-default'}`}>{u.role}</span>
                      </td>
                      <td>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', maxWidth: 320 }} title={ROLE_PERMISSIONS[u.role]}>
                          {ROLE_PERMISSIONS[u.role] || 'Role permissions not defined'}
                        </div>
                      </td>
                      <td>
                        {u.isActive !== false
                          ? <span className="badge badge-success"><Check size={11} /> Active</span>
                          : <span className="badge badge-danger"><X size={11} /> Inactive</span>
                        }
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          {!isCurrentUser ? (
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<Key size={14} />}
                              onClick={() => handleSwitchRole(u)}
                              disabled={switching !== null}
                            >
                              {switching === (u._id || u.id) ? 'Switching…' : 'Switch to Role'}
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" disabled>Active Session</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
