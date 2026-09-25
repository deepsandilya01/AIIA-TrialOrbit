import React from 'react';
import { Database, Download, FileJson, ArrowDownToLine, Archive } from 'lucide-react';
import Button from '../../components/common/Button';

const CDISC = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">CDISC Submission Readiness</h1>
          <p className="page-subtitle">SDTM, ADaM, and Define-XML dataset transformation engine</p>
        </div>
        <Button icon={<Archive size={16} />}>Generate Submission Package</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 border-t-4" style={{ borderTopColor: 'var(--primary-color)' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg mb-1">SDTM Datasets</h3>
              <p className="text-xs text-secondary">Study Data Tabulation Model</p>
            </div>
            <Database className="text-primary-color opacity-50" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Mapping Progress</span>
              <span className="font-semibold text-primary">87%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm" icon={<Download size={14} />}>Export SDTM (XPT)</Button>
        </div>

        <div className="card p-6 border-t-4" style={{ borderTopColor: 'var(--color-gold-500)' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg mb-1">ADaM Datasets</h3>
              <p className="text-xs text-secondary">Analysis Data Model</p>
            </div>
            <Database className="text-warning opacity-50" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Transformation Progress</span>
              <span className="font-semibold" style={{ color: 'var(--color-gold-600)' }}>42%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full" style={{ width: '42%', backgroundColor: 'var(--color-gold-500)' }}></div>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm" icon={<Download size={14} />}>Export ADaM (XPT)</Button>
        </div>

        <div className="card p-6 border-t-4" style={{ borderTopColor: 'var(--color-success)' }}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-lg mb-1">Define-XML</h3>
              <p className="text-xs text-secondary">Metadata Representation</p>
            </div>
            <FileJson className="text-success opacity-50" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Validation Status</span>
              <span className="font-semibold text-success">Pass</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-success-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <Button variant="outline" className="w-full" size="sm" icon={<ArrowDownToLine size={14} />}>Download XML</Button>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Domain Mapping Status (Study AIIA-002)</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Domain Code</th>
                <th>Domain Name</th>
                <th>CTMS Source Form</th>
                <th>Records</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold">DM</td>
                <td>Demographics</td>
                <td>Screening CRF</td>
                <td>250</td>
                <td><span className="badge badge-success">Mapped</span></td>
              </tr>
              <tr>
                <td className="font-bold">AE</td>
                <td>Adverse Events</td>
                <td>Safety Report Form</td>
                <td>45</td>
                <td><span className="badge badge-success">Mapped</span></td>
              </tr>
              <tr>
                <td className="font-bold">VS</td>
                <td>Vital Signs</td>
                <td>Visit Clinical CRF</td>
                <td>1,204</td>
                <td><span className="badge badge-warning">Mapping In Progress</span></td>
              </tr>
              <tr>
                <td className="font-bold">CM</td>
                <td>Concomitant Medications</td>
                <td>ConMed Log</td>
                <td>180</td>
                <td><span className="badge badge-success">Mapped</span></td>
              </tr>
              <tr>
                <td className="font-bold">LB</td>
                <td>Laboratory Test Results</td>
                <td>Central Lab Uploads</td>
                <td>-</td>
                <td><span className="badge badge-default">Pending Data Transfer</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CDISC;
