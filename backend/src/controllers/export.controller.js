import ExportService from '../services/export.service.js';

export const getFHIRPatient = async (req, res, next) => {
  try {
    const { participantId } = req.params;
    const fhirPatient = await ExportService.exportFHIRPatient(participantId);
    res.status(200).json(fhirPatient);
  } catch (error) {
    next(error);
  }
};

export const getFHIRResearchStudy = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const fhirStudy = await ExportService.exportFHIRResearchStudy(studyId);
    res.status(200).json(fhirStudy);
  } catch (error) {
    next(error);
  }
};

export const getFHIREncounter = async (req, res, next) => {
  try {
    const { visitId } = req.params;
    const fhirEncounter = await ExportService.exportFHIREncounter(visitId);
    res.status(200).json(fhirEncounter);
  } catch (error) {
    next(error);
  }
};

export const getCDISCExport = async (req, res, next) => {
  try {
    const { studyId } = req.params;
    const cdiscExport = await ExportService.exportCDISC(studyId, req.user.id, req.user.role);
    res.status(200).json({
      success: true,
      data: cdiscExport
    });
  } catch (error) {
    next(error);
  }
};

import { generatePDF, generateCSV } from '../utils/export.util.js';
import Site from '../models/Site.js';
import AdverseEvent from '../models/AdverseEvent.js';
import Study from '../models/Study.js';

export const getReportExport = async (req, res, next) => {
  try {
    const { title, format } = req.query;
    
    let siteQuery = {};
    let aeQuery = {};
    const user = req.user;

    // Enforce IDOR scope
    if (user.role === 'COORDINATOR' || user.role === 'MONITOR') {
      siteQuery._id = user.siteId;
      aeQuery.siteId = user.siteId;
    } else if (user.role === 'PI') {
      const myStudies = await Study.find({ pi_id: user.id }).select('_id');
      const studyIds = myStudies.map(s => s._id);
      siteQuery.studyId = { $in: studyIds };
      aeQuery.studyId = { $in: studyIds };
    }

    if (title === 'Site Performance Metrics' && format === 'CSV') {
      const sites = await Site.find(siteQuery).populate('studyId', 'title');
      const csvRows = sites.map(s => ({
        SiteName: s.name,
        Location: s.location,
        Status: s.status,
        Enrolled: s.enrolledCount,
        Study: s.studyId ? s.studyId.title : 'N/A'
      }));
      
      const csvData = generateCSV(
        csvRows,
        [{ key: 'SiteName', label: 'Site Name' }, { key: 'Study', label: 'Study' }, { key: 'Location', label: 'Location' }, { key: 'Status', label: 'Status' }, { key: 'Enrolled', label: 'Enrolled' }]
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="TrialOrbit_Report_Site_Performance_${new Date().getTime()}.csv"`);
      return res.send(csvData);
    } 
    
    if (title === 'Adverse Event Line Listing' && format === 'CSV') {
      const aes = await AdverseEvent.find(aeQuery).populate('participantId', 'subjectId').populate('studyId', 'title');
      const csvRows = aes.map(ae => ({
        Event: ae.event,
        Subject: ae.participantId ? ae.participantId.subjectId : 'Unknown',
        Study: ae.studyId ? ae.studyId.title : 'N/A',
        Severity: ae.severity,
        Seriousness: ae.seriousness,
        Status: ae.pvReviewStatus
      }));
      
      const csvData = generateCSV(
        csvRows,
        [{ key: 'Event', label: 'Event' }, { key: 'Subject', label: 'Subject' }, { key: 'Study', label: 'Study' }, { key: 'Severity', label: 'Severity' }, { key: 'Seriousness', label: 'Seriousness' }, { key: 'Status', label: 'Review Status' }]
      );
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="TrialOrbit_Report_AE_${new Date().getTime()}.csv"`);
      return res.send(csvData);
    }

    if (format === 'PDF') {
      return res.status(400).json({ success: false, error: 'Report type not available in MVP' });
    } else {
      return res.status(400).json({ success: false, error: 'Report type not available in MVP' });
    }
  } catch (error) {
    next(error);
  }
};
