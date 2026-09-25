import { useTranslation } from 'react-i18next';
import React from 'react';
import { Users, UserCheck, UserMinus, Download, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { recruitmentTrend, sites } from '../../data/dummyData';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import DemoBadge from '../../components/common/DemoBadge';
import { useToast } from '../../context/ToastContext';

const Recruitment = () => {
  const { t } = useTranslation();
  const { success } = useToast();

  const recruitmentBySite = sites.map(s => ({
    name: s.id,
    actual: s.enrolled,
    target: s.target,
    facility: s.name.split(',')[0]
  }));

  const handleExport = () => {
    success('Recruitment velocity and screening curves exported to PDF.');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">Participant Recruitment & Screening Velocity</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Track multi-centre screening ratios, dropout rates, and AI-predicted cohort completion curves</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExport}>
          Export Recruitment Report
        </Button>
      </div>

      <div className="kpi-grid">
        <StatCard 
          title="Total Screened" 
          value="1,850" 
          subtitle="Screening to enrollment ratio 1.49:1"
          trend={{ value: '+8.2%', isPositive: true }}
          icon={<Users size={22} />}
        />
        <StatCard 
          title="Total Enrolled" 
          value="1,240" 
          subtitle="67% screening conversion"
          trend={{ value: '+12.4%', isPositive: true }}
          icon={<UserCheck size={22} />}
        />
        <StatCard 
          title="Active in Protocol" 
          value="1,195" 
          subtitle="96.4% on-treatment retention"
          status="Retention Optimal"
          icon={<UserCheck size={22} className="text-success" />}
        />
        <StatCard 
          title="Lost to Follow-up" 
          value="45" 
          subtitle="3.6% cumulative attrition"
          status="Requires CRA Follow-up"
          icon={<UserMinus size={22} className="text-danger" />}
        />
      </div>

      <div className="charts-grid-2 mb-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Enrollment vs Protocol Target (Cumulative)</h3>
          </div>
          <div className="p-4" style={{ height: '340px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recruitmentTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="var(--primary-color)" strokeWidth={3} name="Actual Enrolled" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="target" stroke="var(--accent-color)" strokeWidth={2} strokeDasharray="5 5" name="Target Plan" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Site-by-Site Recruitment Distribution</h3>
          </div>
          <div className="p-4" style={{ height: '340px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruitmentBySite} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-secondary)" />
                <YAxis dataKey="name" type="category" stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }} />
                <Legend />
                <Bar dataKey="actual" fill="var(--primary-color)" name="Enrolled" radius={[0, 4, 4, 0]} />
                <Bar dataKey="target" fill="var(--bg-tertiary)" name="Target Allocation" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* AI Decision Support Feature */}
      <div className="card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
        <div className="card-header" style={{ backgroundColor: 'var(--color-gold-100)' }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-warning" />
            <h3 className="card-title" style={{ color: 'var(--color-gold-700)' }}>
              AI Decision Support: Recruitment Risk Intelligence
            </h3>
          </div>
          <span className="badge badge-gold">Analytical Forecast</span>
        </div>
        <div className="card-body">
          <div className="form-grid-2">
            <div>
              <p className="font-semibold text-danger mb-1 flex items-center gap-1">
                <AlertTriangle size={15} /> Site S-05 (AIIA Goa) Latency Warning
              </p>
              <p className="text-sm text-secondary">
                Site activation pending IEC local charter clearance. Predictive model projects a 21-day timeline compression risk for Study AIIA-002 target completion if not activated before 15 October.
              </p>
            </div>
            <div>
              <p className="font-semibold text-success mb-1">
                Recommended Decision Mitigation
              </p>
              <p className="text-sm text-secondary">
                Reallocate 20 candidate slots from Site S-05 to Site S-03 (ITRA Gujarat), which is operating at 110% recruitment velocity with zero protocol violations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
