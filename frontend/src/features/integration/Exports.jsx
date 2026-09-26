import React, { useState, useEffect } from 'react';
import { Download, FileText, Database, ShieldAlert, FileJson } from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';

const Exports = () => {
  const { success, error } = useToast();
  const [reportsCatalog, setReportsCatalog] = useState([]);
  const [studies, setStudies] = useState([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState('');
  const [exportFormat, setExportFormat] = useState('json');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    api.getReportsCatalog().then(setReportsCatalog).catch(console.error);
    api.getStudies().then(setStudies).catch(console.error);
  }, []);

  const handleExportCDISC = async (e) => {
    e.preventDefault();
    if (!selectedStudy) return error('Please select a study to export.');
    
    setExportLoading(true);
    try {
      const data = await api.generateCDISCExport(selectedStudy, { format: exportFormat });
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CDISC_Export_${selectedStudy}_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      success('CDISC Export generated successfully.');
      setIsExportModalOpen(false);
    } catch (err) {
      error(err.response?.data?.error || 'Failed to generate export. Ensure you have the required permissions.');
      console.error(err);
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Exports & Line Listings</h1>
          <p className="page-subtitle">Download standardized datasets, patient line listings, and clinical study reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-100 rounded text-primary">
              <FileJson size={20} />
            </div>
            <h3 className="font-semibold">CDISC Data Export</h3>
          </div>
          <p className="text-sm text-secondary mb-3">Generate standard CDISC SDTM/ADaM datasets for active clinical studies.</p>
          <Button variant="outline" size="sm" className="w-full" onClick={() => setIsExportModalOpen(true)}>Generate CDISC Export</Button>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-warning-100 rounded text-warning">
              <ShieldAlert size={20} />
            </div>
            <h3 className="font-semibold">SAE Reconciliation</h3>
          </div>
          <p className="text-sm text-secondary mb-3">Safety data reconciliation report for PV databases (CIOMS format).</p>
          <Button variant="outline" size="sm" className="w-full">Export PDF</Button>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-success-100 rounded text-success">
              <Database size={20} />
            </div>
            <h3 className="font-semibold">Full CTMS Dump</h3>
          </div>
          <p className="text-sm text-secondary mb-3">Encrypted full database extract including audit trails and metadata.</p>
          <Button variant="outline" size="sm" className="w-full">Request Extract</Button>
        </div>

        <div className="card p-4 bg-primary-50 dark:bg-slate-800 border border-primary-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary-200 rounded text-primary">
              <Download size={20} />
            </div>
            <h3 className="font-semibold">Custom Query</h3>
          </div>
          <p className="text-sm text-secondary mb-3">Build a custom export using specific domain filters and logic.</p>
          <Button variant="primary" size="sm" className="w-full">Launch Builder</Button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Generated Reports</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Format</th>
                <th>Generated On</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {reportsCatalog.map(report => (
                <tr key={report.id}>
                  <td className="font-medium text-secondary">{report.id}</td>
                  <td className="font-bold text-primary">{report.title}</td>
                  <td><div className="text-sm truncate max-w-sm">{report.description}</div></td>
                  <td><span className="badge badge-default">{report.format}</span></td>
                  <td>{report.lastGenerated}</td>
                  <td className="text-right">
                    <Button variant="outline" size="sm" icon={<Download size={14} />}>Download</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => !exportLoading && setIsExportModalOpen(false)}
        title="Generate CDISC SDTM/ADaM Export"
        subtitle="Extract standardized clinical datasets for regulatory submission"
      >
        <form onSubmit={handleExportCDISC} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Select Study <span className="text-danger">*</span>
            </label>
            <select
              value={selectedStudy}
              onChange={(e) => setSelectedStudy(e.target.value)}
              required
              disabled={exportLoading}
            >
              <option value="" disabled>-- Select Active Protocol --</option>
              {studies.map(study => (
                <option key={study.id} value={study.id}>{study.id} - {study.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              disabled={exportLoading}
            >
              <option value="json">JSON (SDTM-compatible)</option>
              <option value="xml">XML (ODM-XML format)</option>
            </select>
          </div>

          <div className="flex flex-wrap justify-end gap-2 mt-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
            <Button variant="ghost" onClick={() => setIsExportModalOpen(false)} disabled={exportLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<Download size={16} />} disabled={exportLoading}>
              {exportLoading ? 'Generating Export...' : 'Generate CDISC Extract'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Exports;
