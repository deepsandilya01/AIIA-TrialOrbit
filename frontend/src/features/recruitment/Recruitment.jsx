import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserMinus, Download, AlertTriangle, ArrowRight, Sparkles, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import { useSocketEvent } from '../../hooks/useSocket';
import StatCard from '../../components/dashboard/StatCard';
import Button from '../../components/common/Button';
import DemoBadge from '../../components/common/DemoBadge';
import { useToast } from '../../context/ToastContext';

const Recruitment = () => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  
  const [recruitmentTrend, setRecruitmentTrend] = useState([]);
  const [summary, setSummary] = useState(null);
  const [sites, setSites] = useState([]);

  const loadData = () => {
    api.getRecruitmentTrend().then(setRecruitmentTrend).catch(console.error);
    api.getRecruitmentSummary().then(setSummary).catch(console.error);
    api.getSites().then(setSites).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  useSocketEvent('participant:created', loadData);
  useSocketEvent('participant:updated', loadData);
  useSocketEvent('participant:status_changed', loadData);
  useSocketEvent('participant:consent_updated', loadData);
  useSocketEvent('site:updated', loadData);

  const recruitmentBySite = sites.map(s => ({
    name: s.id || s._id,
    actual: s.enrolledCount || 0,
    target: s.targetEnrollment || s.target || 100,
    facility: s.name?.split(',')[0]
  }));
  const [exporting, setExporting] = useState(false);
  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await api.exportRecruitmentReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `trialorbit-recruitment-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('Recruitment report exported successfully');
    } catch (err) {
      error('Failed to export recruitment report');
    } finally {
      setExporting(false);
    }
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
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" icon={exporting ? <Activity size={16} className="spin" /> : <Download size={16} />} onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting...' : 'Export Recruitment Report'}
          </Button>
        </div>
      </div>

      <div className="kpi-grid">
        <StatCard 
          title="Total Screened" 
          value={summary ? summary.totalScreened.toString() : "Loading..."} 
          subtitle="Participants in Screened state"
          trend={null}
          icon={<Users size={22} />}
        />
        <StatCard 
          title="Total Enrolled" 
          value={summary ? summary.totalEnrolled.toString() : "Loading..."} 
          subtitle="Currently enrolled"
          trend={null}
          icon={<UserCheck size={22} />}
        />
        <StatCard 
          title="Active in Protocol" 
          value={summary && summary.activeInProtocol !== null ? summary.activeInProtocol.toString() : "N/A"} 
          subtitle="Metric not currently captured by schema"
          status={summary && summary.activeInProtocol !== null ? "Optimal" : "Unavailable"}
          icon={<UserCheck size={22} className={summary && summary.activeInProtocol !== null ? "text-success" : "text-muted"} />}
        />
        <StatCard 
          title="Lost to Follow-up" 
          value={summary ? summary.lostToFollowUp.toString() : "Loading..."} 
          subtitle="Participants officially lost to follow-up"
          status={summary && summary.lostToFollowUp > 0 ? "Requires Review" : "Optimal"}
          icon={<UserMinus size={22} className={summary && summary.lostToFollowUp > 0 ? "text-danger" : "text-success"} />}
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
