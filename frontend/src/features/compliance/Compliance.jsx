import { useTranslation } from 'react-i18next';
import React, { useState, useEffect, useRef } from 'react';
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
  const [docs, setDocs] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadData = () => {
    api.getComplianceData().then(setData).catch(console.error);
    api.getComplianceDocs().then(setDocs).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  useSocketEvent('regulatory:created', loadData);
  useSocketEvent('regulatory:updated', loadData);
  useSocketEvent('regulatory:overdue', loadData);

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files[0];
    if (!file) return error('Please select a file to upload');

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('title', document.getElementById('docTitle').value);
      formData.append('type', document.getElementById('docType').value);

      await api.uploadComplianceDoc(formData);
      success('Document uploaded successfully');
      setIsUploadOpen(false);
      loadData();
    } catch (err) {
      error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (docId, filename) => {
    try {
      const response = await api.downloadComplianceDoc(docId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      success('Document downloaded');
    } catch (err) {
      error('Failed to download document');
    }
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
        <div className="flex flex-wrap gap-2">
          {canDo('manageRegulatory') && (
            <Button icon={<Upload size={16} />} onClick={() => setIsUploadOpen(true)}>
              Upload Document
            </Button>
          )}
        </div>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header">
          <h3 className="card-title">Compliance Documents</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>File Size</th>
                <th>Uploaded By</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">No documents found.</td>
                </tr>
              ) : (
                docs.map(doc => (
                  <tr key={doc._id}>
                    <td className="font-medium">{doc.title}</td>
                    <td><Badge>{doc.type}</Badge></td>
                    <td className="text-muted text-xs">{(doc.size / 1024).toFixed(1)} KB</td>
                    <td className="text-muted text-xs">{doc.uploadedBy?.name || 'Unknown'}</td>
                    <td className="text-muted text-xs">{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button variant="ghost" size="sm" icon={<Download size={14} />} onClick={() => handleDownload(doc._id, doc.originalName)} title="Download" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isUploadOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Upload Compliance Document</h2>
              <button className="close-btn" onClick={() => setIsUploadOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleUploadSubmit}>
                <div className="form-group mb-3">
                  <label>Document Title *</label>
                  <input type="text" id="docTitle" className="form-control" required placeholder="e.g. Protocol Amendment 2" />
                </div>
                <div className="form-group mb-3">
                  <label>Document Type</label>
                  <select id="docType" className="form-control">
                    <option value="PROTOCOL">Protocol</option>
                    <option value="IB">Investigator Brochure</option>
                    <option value="ICF">Informed Consent Form</option>
                    <option value="GCP_CERT">GCP Certificate</option>
                    <option value="ETHICS_APPROVAL">Ethics Approval</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group mb-4">
                  <label>Select File (PDF, CSV, Word) *</label>
                  <input type="file" ref={fileInputRef} className="form-control" required />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" type="button" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
