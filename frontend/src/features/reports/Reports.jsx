import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { FileText, Download, BarChart2, CheckCircle, AlertCircle, Clock, ShieldCheck, Printer } from 'lucide-react';
import { reportsCatalog, protocolDeviations, studies } from '../../data/dummyData';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import StatusBadge from '../../components/common/StatusBadge';
import DemoBadge from '../../components/common/DemoBadge';
import { useToast } from '../../context/ToastContext';

const Reports = () => {
  const { t } = useTranslation();
  const { success } = useToast();
  const [selectedFormat, setSelectedFormat] = useState('PDF');

  const handleGenerateReport = (title) => {
    success(`Generated ${title} in ${selectedFormat} format. Download initiated.`);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">Clinical Trial Reports & Quality Analytics</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Standardized regulatory exports, GCP compliance scorecards, protocol deviations, and query aging analytics</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted font-semibold">Format:</span>
          <select 
            value={selectedFormat} 
            onChange={(e) => setSelectedFormat(e.target.value)}
            style={{ minWidth: '90px', padding: '6px 10px', fontSize: '0.8rem' }}
          >
            <option value="PDF">PDF</option>
            <option value="CSV">CSV</option>
            <option value="XML / ODM">CDISC XML</option>
          </select>
        </div>
      </div>

      {/* Reports Catalog Grid */}
      <h2 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>Standardized Regulatory Report Dossiers</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {reportsCatalog.map(report => (
          <div key={report.id} className="card p-4 flex flex-col justify-between" style={{ minHeight: '160px' }}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="primary">{report.id}</Badge>
                <span className="text-xs text-muted">{report.format}</span>
              </div>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>{report.title}</h3>
              <p className="text-xs text-secondary mb-3">{report.description}</p>
            </div>
            <div className="flex justify-between items-center pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <span className="text-xs text-muted">Updated: {report.lastGenerated}</span>
              <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => handleGenerateReport(report.title)}>
                Generate
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Protocol Deviations Table */}
      <div className="card mb-4">
        <div className="card-header">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-warning" />
            <h3 className="card-title">Protocol Deviations & Corrective Actions (CAPA)</h3>
          </div>
          <span className="badge badge-default">ICH-GCP E6 (R2) Compliant</span>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Deviation ID</th>
                <th>Protocol</th>
                <th>Site</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Description</th>
                <th>Severity</th>
                <th>Action Status</th>
              </tr>
            </thead>
            <tbody>
              {protocolDeviations.map(dev => (
                <tr key={dev.id}>
                  <td className="font-semibold text-primary">{dev.id}</td>
                  <td>{dev.study}</td>
                  <td>{dev.site}</td>
                  <td>{dev.participant}</td>
                  <td><span className="badge badge-default">{dev.deviationType}</span></td>
                  <td className="text-sm max-w-xs">{dev.description}</td>
                  <td>
                    <Badge variant={dev.classification === 'Major' ? 'danger' : 'warning'}>
                      {dev.classification}
                    </Badge>
                  </td>
                  <td>
                    <StatusBadge status={dev.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Quality & Query Aging */}
      <div className="charts-grid-2">
        <div className="card p-4">
          <h3 className="card-title mb-3"><ShieldCheck size={18} className="text-success" /> Trial Data Quality Index</h3>
          <p className="text-xs text-secondary mb-4">Automated electronic CRF (eCRF) edit checks, range verifications, and cross-form consistency scoring.</p>
          <div className="flex flex-col gap-3">
            {studies.slice(0, 3).map(s => (
              <div key={s.id}>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold">{s.id} — {s.title.substring(0, 30)}...</span>
                  <span className="font-bold text-success">{s.dataQualityScore || 96}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${s.dataQualityScore || 96}%`, height: '100%', backgroundColor: 'var(--success)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-4">
          <h3 className="card-title mb-3"><Clock size={18} className="text-primary" /> Clinical Query Resolution Metrics</h3>
          <p className="text-xs text-secondary mb-4">Average turnaround time from CRA query generation to site investigator resolution.</p>
          <div className="form-grid-2" style={{ textAlign: 'center' }}>
            <div className="p-3 border rounded bg-secondary">
              <span className="text-xs text-muted uppercase font-semibold">Active Queries</span>
              <div className="text-xl font-bold text-primary mt-1">16</div>
              <span className="text-xs text-muted">Across 5 trials</span>
            </div>
            <div className="p-3 border rounded bg-secondary">
              <span className="text-xs text-muted uppercase font-semibold">Avg Resolution</span>
              <div className="text-xl font-bold text-success mt-1">2.4 Days</div>
              <span className="text-xs text-success">Target &lt; 5 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
