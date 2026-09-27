import React, { useState } from 'react';
import {
  User, Mail, Phone, Building2, Shield, Edit3, Save, X,
  Camera, Star, Clock, CheckCircle, Activity, Lock, Eye, EyeOff, Key
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import DemoBadge from '../../components/common/DemoBadge';
import api from '../../services/api';
import './Profile.css';

const ROLE_META = {
  ADMIN:             { label: 'System Administrator', color: '#7c3aed', bg: 'rgba(124,58,237,0.1)' },
  PI:                { label: 'Principal Investigator', color: '#0d9488', bg: 'rgba(13,148,136,0.1)' },
  MONITOR:           { label: 'Clinical Monitor (CRA)', color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  COORDINATOR:       { label: 'Study Coordinator', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
  ETHICS:            { label: 'Ethics Committee', color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  PHARMACOVIGILANCE: { label: 'Pharmacovigilance Officer', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
  REGULATOR:         { label: 'Regulator (Read-only)', color: '#64748b', bg: 'rgba(100,116,139,0.1)' }
};


const ACTIVITY_FEED = [
  { id: 1, action: 'Updated recruitment status',   entity: 'ONCO-2024-B Phase II', time: '2h ago',    color: '#2563eb' },
  { id: 2, action: 'Uploaded SAE document',        entity: 'Patient #PT-0045',     time: '5h ago',    color: '#d97706' },
  { id: 3, action: 'Approved protocol deviation',  entity: 'CARDIO-MULTI-01',      time: 'Yesterday', color: '#059669' },
  { id: 4, action: 'Generated CTRI report',        entity: 'NEURO-PHASE3-2024',    time: '2 days ago',color: '#7c3aed' },
  { id: 5, action: 'Verified site activation',     entity: 'Site – Apollo Chennai', time: '3 days ago',color: '#0d9488' },
];

const Profile = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const roleMeta = ROLE_META[user?.role] || ROLE_META.investigator;

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    institution: user?.institution || '',
    department: user?.department || '',
    designation: user?.designation || '',
    gcp: user?.gcp || 'Not provided',
    joined: new Date(user?.createdAt || Date.now()).toLocaleDateString(),
    lastLogin: 'Session Active',
    completedProcedures: 0,
    avgCompliance: 0,
    studies: 0
  });

  const [saving, setSaving] = useState(false);
  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await api.updateProfile({
        name: formData.fullName,
        phone: formData.phone,
        institution: formData.institution,
        department: formData.department,
        designation: formData.designation
      });
      success('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      showError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const [pwdMode, setPwdMode] = useState(false);
  const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '' });
  const [pwdSaving, setPwdSaving] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwdData.newPassword.length < 8) return showError('New password must be at least 8 chars');
    try {
      setPwdSaving(true);
      await api.changePassword(pwdData);
      success('Password changed successfully');
      setPwdMode(false);
      setPwdData({ currentPassword: '', newPassword: '' });
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPwdSaving(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">My Profile</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Manage your account information, credentials, and activity history</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* ─── LEFT COLUMN ─── */}
        <div className="profile-left">
          {/* Avatar Card */}
          <div className="card profile-avatar-card">
            <div className="profile-avatar-wrap">
              <div className="profile-avatar-ring" style={{ borderColor: roleMeta.color }}>
                <div className="profile-avatar" style={{ background: `linear-gradient(135deg, ${roleMeta.color}, ${roleMeta.color}cc)` }}>
                  <span>{formData.fullName.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                </div>
              </div>
              <button className="profile-avatar-edit" title="Change photo">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="profile-name">{formData.fullName}</h2>
            <div className="profile-role-badge" style={{ color: roleMeta.color, background: roleMeta.bg }}>
              <Shield size={12} />
              <span>{roleMeta.label}</span>
            </div>
            <p className="profile-institution">{formData.institution}</p>
            <div className="profile-gcp">
              <Star size={12} />
              <span>GCP ID: {formData.gcp}</span>
            </div>
            <div className="profile-meta-row">
              <Clock size={12} />
              <span>Member since {formData.joined}</span>
            </div>
            <div className="profile-meta-row">
              <Activity size={12} />
              <span>Last login: {formData.lastLogin}</span>
            </div>
          </div>

          {/* Stats Card */}
          <div className="card p-4">
            <h3 className="card-title mb-3" style={{ fontSize: '0.9rem' }}>
              <CheckCircle size={16} style={{ color: '#059669' }} />
              Performance Summary
            </h3>
            <div className="profile-stats-grid">
              <div className="profile-stat">
                <span className="profile-stat-value" style={{ color: '#2563eb' }}>{formData.studies}</span>
                <span className="profile-stat-label">Active Studies</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value" style={{ color: '#059669' }}>{formData.completedProcedures}</span>
                <span className="profile-stat-label">Procedures</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value" style={{ color: '#d97706' }}>{formData.avgCompliance}%</span>
                <span className="profile-stat-label">Compliance</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT COLUMN ─── */}
        <div className="profile-right">
          {/* Personal Info Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><User size={16} /> Personal Information</h3>
              {!editMode ? (
                <Button variant="ghost" size="sm" icon={<Edit3 size={14} />} onClick={() => setEditMode(true)}>Edit</Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={() => setEditMode(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" icon={saving ? <Activity size={14} className="spin" /> : <Save size={14} />} onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </div>
            <div className="card-body">
              {editMode ? (
                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label className="profile-label">Full Name</label>
                    <input type="text" className="profile-input" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Email Address <span className="text-xs text-muted">(Read-only)</span></label>
                    <input type="email" className="profile-input" value={formData.email} disabled />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Phone Number</label>
                    <input type="text" className="profile-input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Institution / Hospital</label>
                    <input type="text" className="profile-input" value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Department</label>
                    <input type="text" className="profile-input" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Designation</label>
                    <input type="text" className="profile-input" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} />
                  </div>
                </div>
              ) : (
                <div className="profile-form-grid">
                  <div className="profile-field">
                    <label className="profile-label">Full Name</label>
                    <div className="profile-value"><User size={14} />{formData.fullName}</div>
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Email Address</label>
                    <div className="profile-value"><Mail size={14} />{formData.email}</div>
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Phone Number</label>
                    <div className="profile-value"><Phone size={14} />{formData.phone}</div>
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Institution / Hospital</label>
                    <div className="profile-value"><Building2 size={14} />{formData.institution}</div>
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Department</label>
                    <div className="profile-value">{formData.department}</div>
                  </div>
                  <div className="profile-field">
                    <label className="profile-label">Designation</label>
                    <div className="profile-value">{formData.designation}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Password Change Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><Lock size={16} /> Security &amp; Password</h3>
              {!pwdMode && (
                <Button variant="ghost" size="sm" icon={<Key size={14} />} onClick={() => setPwdMode(true)}>Change Password</Button>
              )}
            </div>
            <div className="card-body">
              {pwdMode ? (
                <form onSubmit={handleChangePassword}>
                  <div className="profile-form-grid">
                    <div className="profile-field">
                      <label className="profile-label">Current Password</label>
                      <input type="password" required className="profile-input" value={pwdData.currentPassword} onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})} />
                    </div>
                    <div className="profile-field">
                      <label className="profile-label">New Password</label>
                      <input type="password" required className="profile-input" value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button type="button" variant="ghost" onClick={() => { setPwdMode(false); setPwdData({ currentPassword: '', newPassword: '' }); }}>Cancel</Button>
                    <Button type="submit" disabled={pwdSaving}>
                      {pwdSaving ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-sm text-muted">Your password was last changed on <strong>15 Sep 2024</strong>. Passwords expire every 90 days per ICH E6(R3) policy.</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><Activity size={16} /> Recent Activity</h3>
            </div>
            <div className="card-body p-0">
              <ul className="profile-activity-list">
                {ACTIVITY_FEED.map(item => (
                  <li key={item.id} className="profile-activity-item">
                    <div className="profile-activity-dot" style={{ background: item.color }} />
                    <div className="profile-activity-content">
                      <span className="profile-activity-action">{item.action}</span>
                      <span className="profile-activity-entity">{item.entity}</span>
                    </div>
                    <span className="profile-activity-time">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
