import React, { useState, useEffect } from 'react';
import { AlertTriangle, Activity, CheckCircle, Clock, ShieldAlert, BarChart2 } from 'lucide-react';
import api from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const SafetyDashboard = () => {
  const [aesaeData, setAesaeData] = useState([]);

  useEffect(() => {
    api.getSafetyEvents().then(setAesaeData).catch(console.error);
  }, []);
  const totalAE = aesaeData.length;
  const totalSAE = aesaeData.filter(e => e.serious === 'Yes').length;
  const openEvents = aesaeData.filter(e => e.status !== 'Resolved').length;
  const resolvedEvents = totalAE - openEvents;

  const [severityData, setSeverityData] = useState([]);
  const [studySummary, setStudySummary] = useState([]);

  useEffect(() => {
    // Simulated fetching for the chart data
    setSeverityData([
      { name: 'Mild', value: 8, color: 'var(--color-success)' },
      { name: 'Moderate', value: 4, color: 'var(--color-warning)' },
      { name: 'Severe', value: 2, color: 'var(--color-danger)' },
    ]);
    setStudySummary([
      { name: 'AIIA-001', AE: 5, SAE: 1 },
      { name: 'AIIA-002', AE: 6, SAE: 0 },
      { name: 'AIIA-003', AE: 3, SAE: 1 },
    ]);
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Safety & Pharmacovigilance Dashboard</h1>
          <p className="page-subtitle">Aggregate safety event monitoring across the portfolio</p>
        </div>
      </div>

      <div className="kpi-grid mb-6">
        <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-primary)' }}>
          <div className="p-3 bg-primary-100 dark:bg-slate-700 rounded-full text-primary-600 dark:text-primary-300">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary">Total AEs</p>
            <h3 className="text-2xl font-bold">{totalAE}</h3>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-danger)' }}>
          <div className="p-3 bg-danger-100 dark:bg-danger-900 rounded-full text-danger-700 dark:text-danger-300">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary">Total SAEs</p>
            <h3 className="text-2xl font-bold text-danger">{totalSAE}</h3>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-warning)' }}>
          <div className="p-3 bg-warning-100 dark:bg-warning-900 rounded-full text-warning-700 dark:text-warning-300">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary">Open Events</p>
            <h3 className="text-2xl font-bold">{openEvents}</h3>
          </div>
        </div>
        
        <div className="card p-4 flex items-center gap-4 border-l-4" style={{ borderLeftColor: 'var(--color-success)' }}>
          <div className="p-3 bg-success-100 dark:bg-success-900 rounded-full text-success-700 dark:text-success-300">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-secondary">Resolved Events</p>
            <h3 className="text-2xl font-bold">{resolvedEvents}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><BarChart2 size={18} /> Study-wise Safety Summary</h3>
          </div>
          <div className="chart-wrapper p-4" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studySummary}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Legend />
                <Bar dataKey="AE" stackId="a" fill="var(--color-forest-400)" name="Non-Serious AE" />
                <Bar dataKey="SAE" stackId="a" fill="var(--color-danger)" name="Serious AE (SAE)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title"><ShieldAlert size={18} /> Severity Breakdown</h3>
          </div>
          <div className="chart-wrapper p-4 flex justify-center items-center" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Expedited Reporting Deadlines</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Study</th>
                <th>Seriousness</th>
                <th>Report Due Date</th>
                <th>Reporting Status</th>
              </tr>
            </thead>
            <tbody>
              {aesaeData.filter(e => e.serious === 'Yes').map(e => (
                <tr key={e.id}>
                  <td className="font-bold text-primary">{e.id}</td>
                  <td>{e.study}</td>
                  <td><span className="badge badge-danger">Serious</span></td>
                  <td><span className="text-danger font-semibold">2026-09-30</span></td>
                  <td><span className="badge badge-warning">Pending Review</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SafetyDashboard;
