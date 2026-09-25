import React from 'react';
import { Download, FileText, Database, ShieldAlert } from 'lucide-react';
import { reportsCatalog } from '../../data/dummyData';
import Button from '../../components/common/Button';

const Exports = () => {
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
              <FileText size={20} />
            </div>
            <h3 className="font-semibold">Patient Line Listings</h3>
          </div>
          <p className="text-sm text-secondary mb-3">Complete demographic and clinical variables for enrolled subjects.</p>
          <Button variant="outline" size="sm" className="w-full">Export CSV</Button>
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
    </div>
  );
};

export default Exports;
