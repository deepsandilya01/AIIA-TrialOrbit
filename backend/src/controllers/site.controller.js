const siteService = require('../services/site.service');

exports.createSite = async (req, res, next) => {
  try {
    const site = await siteService.createSite(req.body, req.user);
    res.status(201).json({ success: true, data: site });
  } catch (error) {
    next(error);
  }
};

exports.getSites = async (req, res, next) => {
  try {
    const result = await siteService.getSites(req.query);
    res.status(200).json({ 
      success: true, 
      data: result.sites,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getSiteById = async (req, res, next) => {
  try {
    const site = await siteService.getSiteById(req.params.id);
    res.status(200).json({ success: true, data: site });
  } catch (error) {
    if (error.message === 'Site not found') res.status(404);
    next(error);
  }
};

exports.updateSite = async (req, res, next) => {
  try {
    const site = await siteService.updateSite(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: site });
  } catch (error) {
    if (error.message === 'Site not found') res.status(404);
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const site = await siteService.updateStatus(req.params.id, req.body.status, req.user);
    res.status(200).json({ success: true, data: site });
  } catch (error) {
    if (error.message === 'Site not found') res.status(404);
    next(error);
  }
};
