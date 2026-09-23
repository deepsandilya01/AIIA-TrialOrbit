import { useTranslation } from 'react-i18next';
import React from 'react';
import { Users, UserCheck, UserMinus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { recruitmentTrend, sites } from '../../data/dummyData';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';

const Recruitment = () => {
  const { t } = useTranslation();

  const recruitmentBySite = sites.map(s => ({
    name: s.id,
    actual: s.enrolled,
    target: s.target
  }));

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Recruitment Dashboard</h1>
          <p className="page-subtitle">Track enrollment and participant retention metrics</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <StatCard 
          title="Total Screened" 
          value="1,850" 
          icon={<Users size={24} />}
        />
        <StatCard 
          title="Total Enrolled" 
          value="1,240" 
          subtitle="67% screening success"
          icon={<UserCheck size={24} />}
        />
        <StatCard 
          title={t('studies.completed')} 
          value="890" 
          icon={<UserCheck size={24} className="text-success" />}
        />
        <StatCard 
          title="Dropped Out" 
          value="45" 
          status={t('dashboard.requiresAttention')}
          icon={<UserMinus size={24} />}
        />
      </div>

      <div className="study-content-grid mt-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Enrollment Trend (All Studies)</h3>
          </div>
          <div className="p-4" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recruitmentTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#0B4A8E" strokeWidth={3} name="Actual Enrolled" />
                <Line type="monotone" dataKey="target" stroke="#D4AF37" strokeWidth={2} strokeDasharray="5 5" name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recruitment by Site</h3>
          </div>
          <div className="p-4" style={{ height: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruitmentBySite} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="actual" fill="#0B4A8E" name={t('participants.enrolled')} />
                <Bar dataKey="target" fill="#E5E7EB" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header bg-warning" style={{ backgroundColor: '#FEF3C7', borderBottom: '1px solid #FDE68A', padding: '1rem 1.5rem', borderRadius: '6px 6px 0 0' }}>
          <h3 className="card-title text-warning" style={{ color: '#92400E' }}>Recruitment Risk Alert</h3>
        </div>
        <div className="p-4">
          <p className="font-medium text-danger mb-2">Site S-05 (Ayush Hospital, Gujarat) is severely underperforming.</p>
          <p className="text-sm text-muted">Currently at 0 enrolled out of 50 target. Site activation is pending. Recommend immediate follow-up with Dr. Meera Patel.</p>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
