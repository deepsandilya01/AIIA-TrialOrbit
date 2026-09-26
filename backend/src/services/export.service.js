import Participant from '../models/Participant.js';
import Study from '../models/Study.js';
import Visit from '../models/Visit.js';
import AdverseEvent from '../models/AdverseEvent.js';
import AuditLog from '../models/AuditLog.js';

class ExportService {
  /**
   * FHIR R4 Participant -> Patient
   */
  async exportFHIRPatient(participantId) {
    const participant = await Participant.findById(participantId);
    if (!participant) throw new Error('Participant not found');

    return {
      resourceType: "Patient",
      id: participant._id.toString(),
      identifier: [
        {
          use: "usual",
          value: participant.participantCode
        }
      ],
      gender: participant.gender.toLowerCase() === 'other' ? 'other' : participant.gender.toLowerCase(),
      // In a real system age is derived from birthDate. We mock it for the representative FHIR payload
      extension: [
        {
          url: "http://hl7.org/fhir/StructureDefinition/patient-age",
          valueInteger: participant.age
        }
      ],
      active: participant.status !== 'Withdrawn' && participant.status !== 'Lost-to-follow-up'
    };
  }

  /**
   * FHIR R4 Study -> ResearchStudy
   */
  async exportFHIRResearchStudy(studyId) {
    const study = await Study.findById(studyId);
    if (!study) throw new Error('Study not found');

    return {
      resourceType: "ResearchStudy",
      id: study._id.toString(),
      identifier: [
        {
          use: "official",
          value: study.protocolId
        }
      ],
      title: study.title,
      status: this._mapStudyStatusToFHIR(study.status),
      phase: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/research-study-phase",
            code: study.phase.toLowerCase().replace(' ', '-'),
            display: study.phase
          }
        ]
      }
    };
  }

  /**
   * FHIR R4 Visit -> Encounter
   */
  async exportFHIREncounter(visitId) {
    const visit = await Visit.findById(visitId);
    if (!visit) throw new Error('Visit not found');

    return {
      resourceType: "Encounter",
      id: visit._id.toString(),
      status: this._mapVisitStatusToFHIR(visit.status),
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "AMB",
        display: "ambulatory"
      },
      subject: {
        reference: `Patient/${visit.participantId}`
      },
      period: {
        start: visit.visitDate
      },
      reasonCode: [
        {
          text: visit.visitType
        }
      ]
    };
  }

  /**
   * CDISC SDTM Export
   */
  async exportCDISC(studyId, userId, userRole) {
    const study = await Study.findById(studyId);
    if (!study) throw new Error('Study not found');

    const participants = await Participant.find({ studyId }).lean();
    const adverseEvents = await AdverseEvent.find({ studyId }).lean();
    const visits = await Visit.find({ studyId }).lean();

    // Generate Representative DM (Demographics)
    const dmDataset = participants.map(p => ({
      DOMAIN: "DM",
      USUBJID: p.participantCode,
      AGE: p.age,
      SEX: p.gender === 'Male' ? 'M' : p.gender === 'Female' ? 'F' : 'U',
      ARM: "UNASSIGNED",
      ACTARM: "UNASSIGNED"
    }));

    // Generate Representative DS (Disposition)
    const dsDataset = participants.map(p => ({
      DOMAIN: "DS",
      USUBJID: p.participantCode,
      DSDECOD: p.status.toUpperCase(),
      DSCAT: "DISPOSITION EVENT"
    }));

    // Generate Representative AE (Adverse Events)
    const aeDataset = adverseEvents.map(ae => ({
      DOMAIN: "AE",
      USUBJID: ae.participantId.toString(),
      AETERM: ae.eventType,
      AESEV: ae.severity ? ae.severity.toUpperCase() : "UNKNOWN",
      AESER: ae.seriousness === 'SERIOUS' ? 'Y' : 'N',
      AESTDTC: ae.onsetDate ? ae.onsetDate.toISOString().split('T')[0] : ""
    }));

    // Generate Representative SV (Subject Visits)
    const svDataset = visits.map(v => ({
      DOMAIN: "SV",
      USUBJID: v.participantId.toString(),
      VISIT: v.visitType,
      SVSTDTC: v.visitDate ? v.visitDate.toISOString().split('T')[0] : ""
    }));

    const result = {
      studyId: study.protocolId,
      datasets: {
        DM: dmDataset,
        DS: dsDataset,
        AE: aeDataset,
        SV: svDataset
      },
      metadata: {
        generatedAt: new Date(),
        standards: "CDISC SDTM (Representative)",
        notice: "This is a representative export and not official CDISC certification."
      }
    };

    // Audit Log for CDISC export
    await AuditLog.create({
      actorId: userId,
      actorRole: userRole,
      action: 'EXPORT',
      entityType: 'Study',
      entityId: studyId,
      reason: 'Generated CDISC SDTM Export'
    });

    return result;
  }

  _mapStudyStatusToFHIR(status) {
    const mapping = {
      'Draft': 'draft',
      'Protocol-Ready': 'in-review',
      'IEC-Review': 'in-review',
      'IEC-Approved': 'approved',
      'CTRI-Registered': 'approved',
      'Site-Activation': 'active',
      'Recruiting': 'active',
      'Active-Follow-Up': 'active',
      'Data-Cleaning': 'active',
      'Close-Out': 'completed',
      'Archived': 'completed',
      'On-Hold': 'temporarily-closed-to-accrual',
      'Terminated': 'administratively-completed'
    };
    return mapping[status] || 'unknown';
  }

  _mapVisitStatusToFHIR(status) {
    const mapping = {
      'Scheduled': 'planned',
      'Completed': 'finished',
      'Missed': 'cancelled',
      'Overdue': 'cancelled',
      'Cancelled': 'cancelled'
    };
    return mapping[status] || 'unknown';
  }
}

export default new ExportService();
