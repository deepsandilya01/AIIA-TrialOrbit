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
    const cdiscExport = await ExportService.exportCDISC(studyId, req.user._id, req.user.role);
    res.status(200).json({
      success: true,
      data: cdiscExport
    });
  } catch (error) {
    next(error);
  }
};
