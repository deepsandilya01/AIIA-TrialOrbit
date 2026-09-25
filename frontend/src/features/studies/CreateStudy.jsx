import React, { useState } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { FlaskConical } from 'lucide-react';

const CreateStudy = ({ isOpen, onClose, onStudyCreated }) => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    protocolId: '',
    phase: 'Phase II',
    therapeuticArea: 'Metabolic & Lifestyle Disorders',
    pi: 'Dr. Anurag Sharma',
    sponsor: 'Ministry of Ayush',
    targetParticipants: 100,
    sites: 3,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2027-12-31'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Study title is required.';
    if (!formData.protocolId.trim()) errs.protocolId = 'Protocol ID / Code is required.';
    if (!formData.pi.trim()) errs.pi = 'Principal Investigator name is required.';
    if (formData.targetParticipants <= 0) errs.targetParticipants = 'Target enrollment must be greater than zero.';
    if (!formData.startDate) errs.startDate = 'Start date is required.';
    if (!formData.endDate) errs.endDate = 'End date is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      error('Please complete all required fields according to protocol standards.');
      return;
    }

    setIsSubmitting(true);
    try {
      const newStudy = {
        title: formData.title,
        protocolId: formData.protocolId,
        phase: formData.phase,
        type: `${formData.phase}, Interventional`,
        therapeuticArea: formData.therapeuticArea,
        pi: formData.pi,
        sponsor: formData.sponsor,
        targetParticipants: parseInt(formData.targetParticipants, 10),
        sites: parseInt(formData.sites, 10) || 1,
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      if (onStudyCreated) {
        await onStudyCreated(newStudy);
      }
      success(`Study ${formData.protocolId} initialized successfully.`);
      onClose();
    } catch (err) {
      error('Failed to initialize study. Please check network logs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initialize New Clinical Study Protocol"
      subtitle="Define regulatory parameters, oversight investigators, and target cohort"
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold text-secondary uppercase block mb-1">
            Study Protocol Title <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="e.g., Randomized Evaluation of Standardized Formulation in Type-2 Diabetes"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'border-danger' : ''}
          />
          {errors.title && <span className="text-xs text-danger mt-1 block">{errors.title}</span>}
        </div>

        <div className="form-grid-2">
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Institutional Protocol ID <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="protocolId"
              placeholder="e.g., AIIA/CT/2026/021"
              value={formData.protocolId}
              onChange={handleChange}
              className={errors.protocolId ? 'border-danger' : ''}
            />
            {errors.protocolId && <span className="text-xs text-danger mt-1 block">{errors.protocolId}</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Clinical Trial Phase
            </label>
            <select name="phase" value={formData.phase} onChange={handleChange}>
              <option value="Phase I">Phase I (Safety & Tolerability)</option>
              <option value="Phase II">Phase II (Therapeutic Exploratory)</option>
              <option value="Phase III">Phase III (Therapeutic Confirmatory)</option>
              <option value="Phase IV">Phase IV (Post-Marketing Surveillance)</option>
              <option value="Observational">Observational / Cohort Study</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Principal Investigator (PI) <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="pi"
              placeholder="Dr. Full Name"
              value={formData.pi}
              onChange={handleChange}
              className={errors.pi ? 'border-danger' : ''}
            />
            {errors.pi && <span className="text-xs text-danger mt-1 block">{errors.pi}</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Therapeutic Area
            </label>
            <select name="therapeuticArea" value={formData.therapeuticArea} onChange={handleChange}>
              <option value="Metabolic & Lifestyle Disorders">Metabolic & Lifestyle Disorders</option>
              <option value="Endocrinology">Endocrinology</option>
              <option value="Geriatrics & Immunology">Geriatrics & Immunology</option>
              <option value="Neuropsychiatry">Neuropsychiatry</option>
              <option value="Rheumatology & Orthopaedics">Rheumatology & Orthopaedics</option>
              <option value="Respiratory Medicine">Respiratory Medicine</option>
            </select>
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Target Enrollment Cohort <span className="text-danger">*</span>
            </label>
            <input
              type="number"
              name="targetParticipants"
              min="1"
              value={formData.targetParticipants}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Participating Sites
            </label>
            <input
              type="number"
              name="sites"
              min="1"
              max="25"
              value={formData.sites}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Planned Start Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase block mb-1">
              Planned Closure Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 mt-2 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting} icon={<FlaskConical size={16} />}>
            Create Protocol Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateStudy;
