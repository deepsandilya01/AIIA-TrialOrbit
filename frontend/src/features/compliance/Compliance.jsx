import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { FileCheck, UploadCloud, Download, Shield, Calendar, Clock, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { useSocketEvent } from '../../hooks/useSocket';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import DemoBadge from '../../components/common/DemoBadge';
import Modal from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';
import usePermissions from '../../hooks/usePermissions';

const Compliance = () => {
  const { t } = useTranslation();
  const { success, error } = useToast();
  const { canDo } = usePermissions();

  const [data, setData] = useState([]);

  const loadData = () => {
    api.getComplianceData().then(setData).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  useSocketEvent('regulatory:created', loadData);
  useSocketEvent('regulatory:updated', loadData);
  useSocketEvent('regulatory:overdue', loadData);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    requirement: 'Annual Safety Report (ASR) to CDSCO',
    documentName: '',
    authority: 'CDSCO / Ayush Licensing Division'
  });

  const handleDownload = (req) => {
    success(`Downloaded regulatory dossier for ${req}.`);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadForm.documentName.trim()) {
      error('Please select or specify a document filename.');
      return;
    }
    success(`Document "${uploadForm.documentName}" uploaded and queued for IEC/Regulatory verification.`);
    setIsUploadOpen(false);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="page-title">Regulatory & Compliance Milestones</h1>
            <DemoBadge />
          </div>
          <p className="page-subtitle">Track Institutional Ethics Committee (IEC), CTRI registration, and GCP monitoring checkpoints</p>
        </div>
        {canDo('createMilestone') && (
          <Button icon={<UploadCloud size={16} />} onClick={() => setIsUploadOpen(true)}>
            Upload Compliance Filing
          </Button>
        )}
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Regulatory Requirement / Milestone</th>
                <th>Oversight Authority</th>
                <th>Status</th>
                <th>Due / Completed Date</th>
                <th>Timeline Horizon</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <FileCheck size={16} className="text-primary" />
                      <span className="font-medium">{item.req}</span>
                    </div>
                  </td>
                  <td className="text-muted text-xs">{item.authority || 'Institutional Authority'}</td>
                  <td>
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="text-sm">{item.date}</td>
                  <td>
                    {item.days !== null ? (
                      <span className={item.days < 10 ? 'text-danger font-bold flex items-center gap-1' : 'text-warning font-medium flex items-center gap-1'}>
                        <Clock size={13} /> {item.days} days remaining
                      </span>
                    ) : (
                      <span className="text-success text-xs font-semibold flex items-center gap-1">
                        <CheckCircle size={13} /> Cleared
                      </span>
                    )}
                  </td>
                  <td>
                    <Button variant="outline" size="sm" icon={<Download size={13} />} onClick={() => handleDownload(item.req)}>
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {canDo('createMilestone') && (
        <Modal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          title="Upload Regulatory Compliance Filing"
          subtitle="Submit signed approvals, ethics committee letters, or CTRI updates"
        >
          <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                Regulatory Requirement
              </label>
              <select
                value={uploadForm.requirement}
                onChange={(e) => setUploadForm({ ...uploadForm, requirement: e.target.value })}
              >
                <option value="Institutional Ethics Committee (IEC) Clearance">IEC Clearance Renewal</option>
                <option value="CTRI Clinical Trial Registry Filing">CTRI Registration Certificate</option>
                <option value="Annual Safety Report (ASR) to CDSCO">Annual Safety Report (CDSCO)</option>
                <option value="Investigator Brochure v3.0">Investigator Brochure Revision</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-secondary uppercase block mb-1">
                Document File / Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., AIIA_IEC_Approval_Letter_2026.pdf"
                value={uploadForm.documentName}
                onChange={(e) => setUploadForm({ ...uploadForm, documentName: e.target.value })}
              />
            </div>

            <div className="flex flex-wrap justify-end gap-2 mt-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Button variant="ghost" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<UploadCloud size={16} />}>
                Submit Document
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Compliance;
