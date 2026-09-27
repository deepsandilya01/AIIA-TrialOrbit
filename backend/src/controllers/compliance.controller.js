import path from 'path';
import fs from 'fs';
import ComplianceDocument from '../models/ComplianceDocument.js';
import auditService from '../services/audit.service.js';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { title, type, study, site } = req.body;

    const doc = await ComplianceDocument.create({
      title: title || req.file.originalname,
      type: type || 'OTHER',
      study: study || null,
      site: site || null,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      uploadedBy: req.user._id
    });

    await auditService.log({
      action: 'UPLOAD',
      entity: 'COMPLIANCE_DOCUMENT',
      entityId: doc._id,
      user: req.user._id,
      details: `Compliance document ${doc.originalName} uploaded`
    });

    res.status(201).json({ success: true, data: doc });
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.study) filter.study = req.query.study;
    if (req.query.site) filter.site = req.query.site;

    const docs = await ComplianceDocument.find(filter).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: docs });
  } catch (error) {
    next(error);
  }
};

export const downloadDocument = async (req, res, next) => {
  try {
    const doc = await ComplianceDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    await auditService.log({
      action: 'DOWNLOAD',
      entity: 'COMPLIANCE_DOCUMENT',
      entityId: doc._id,
      user: req.user._id,
      details: `Compliance document ${doc.originalName} downloaded`
    });

    if (fs.existsSync(doc.path)) {
      res.download(doc.path, doc.originalName);
    } else {
      res.status(404).json({ success: false, message: 'File not found on server' });
    }
  } catch (error) {
    next(error);
  }
};
