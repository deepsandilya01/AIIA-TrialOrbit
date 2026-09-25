import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { studies, sites } from '../../data/dummyData';

const ReportSAE = ({ isOpen, onClose, onSAEReported }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    study: 'AIIA-001',
    participant: '',
    site: 'S-01',
    event: '',
    severity: 'Grade 3 (Severe)',
    seriousnessCriteria: 'Hospitalization',
    causality: 'Possible',
    expeditedFlag: true,
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.participant.trim()) errs.participant = 'Participant ID (e.g., P-1045) is required.';
    if (!formData.event.trim()) errs.event = 'Clinical event description is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      error('Please complete mandatory clinical safety fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        study: formData.study,
        participant: formData.participant.toUpperCase(),
        site: formData.site,
        event: formData.event,
        severity: formData.severity,
        seriousnessCriteria: formData.seriousnessCriteria,
        causality: formData.causality,
        expeditedReport: formData.expeditedFlag,
        reportedBy: 'Attending Site Physician'
      };

      if (onSAEReported) {
        await onSAEReported(payload);
      }
      success(`Expedited SAE reported for ${payload.participant}. Pharmacovigilance notified.`);
      onClose();
    } catch (err) {
      error('Failed to submit SAE log. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Serious Adverse Event (SAE)"
      subtitle="Expedited pharmacovigilance submission compliant with CDSCO & GCP regulations"
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div style={{ backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger-border)', padding: '10px 14px', borderRadius: 'var(--border-radius)', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <ShieldAlert size={20} className="text-danger" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>
            <strong>Expedited Safety Mandate:</strong> SAE reports must be submitted within 24 hours of occurrence to the Institutional Ethics Committee (IEC) and Licensing Authority.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Trial Study Code <span className="text-danger">*</span>
            </label>
            <select name="study" value={formData.study} onChange={handleChange}>
              {studies.map((s) => (
                <option key={s.id} value={s.id}>{s.id} — {s.title.substring(0, 32)}...</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Trial Site <span className="text-danger">*</span>
            </label>
            <select name="site" value={formData.site} onChange={handleChange}>
              {sites.map((st) => (
                <option key={st.id} value={st.id}>{st.id} ({st.location})</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Participant ID <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="participant"
              placeholder="e.g., P-1025"
              value={formData.participant}
              onChange={handleChange}
              className={errors.participant ? 'border-danger' : ''}
            />
            {errors.participant && <span className="text-xs text-danger mt-1 block">{errors.participant}</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              CTCAE Severity Grade <span className="text-danger">*</span>
            </label>
            <select name="severity" value={formData.severity} onChange={handleChange}>
              <option value="Grade 2 (Moderate)">Grade 2 — Moderate impairment</option>
              <option value="Grade 3 (Severe)">Grade 3 — Severe / Inpatient Hospitalization</option>
              <option value="Grade 4 (Life Threatening)">Grade 4 — Life-threatening urgent intervention</option>
              <option value="Grade 5 (Death)">Grade 5 — Fatal outcome</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-secondary uppercase block mb-1">
            Event Diagnosis / Adverse Reaction Description <span className="text-danger">*</span>
          </label>
          <textarea
            name="event"
            rows="3"
            placeholder="Clinical details, symptoms onset, intervention administered, and outcome..."
            value={formData.event}
            onChange={handleChange}
            className={errors.event ? 'border-danger' : ''}
          />
          {errors.event && <span className="text-xs text-danger mt-1 block">{errors.event}</span>}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Seriousness Criterion
            </label>
            <select name="seriousnessCriteria" value={formData.seriousnessCriteria} onChange={handleChange}>
              <option value="Hospitalization">Hospitalization / Prolongation</option>
              <option value="Life-threatening">Life-threatening Event</option>
              <option value="Persistent Disability">Persistent or Significant Disability</option>
              <option value="Congenital Anomaly">Congenital Anomaly / Birth Defect</option>
              <option value="Important Medical Event">Other Medically Significant Event</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Causality Assessment (Herb / Drug)
            </label>
            <select name="causality" value={formData.causality} onChange={handleChange}>
              <option value="Definite">Definite / Certain</option>
              <option value="Probable">Probable</option>
              <option value="Possible">Possible</option>
              <option value="Unlikely">Unlikely Related</option>
              <option value="Unrelated">Unrelated</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem' }}>
          <input
            type="checkbox"
            id="expeditedFlag"
            name="expeditedFlag"
            checked={formData.expeditedFlag}
            onChange={handleChange}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="expeditedFlag" className="text-xs font-semibold cursor-pointer">
            Trigger 24-Hour Expedited Pharmacovigilance Workflow & Log Electronic Audit Entry
          </label>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" isLoading={isSubmitting} icon={<AlertTriangle size={16} />}>
            Transmit SAE Notification
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportSAE;
