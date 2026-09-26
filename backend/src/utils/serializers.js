export const serializeParticipant = (doc) => {
  if(!doc) return null;
  return {
    _id: doc._id,
    participantCode: doc.participantCode,
    studyId: doc.studyId,
    siteId: doc.siteId,
    status: doc.status,
    age: doc.age,
    gender: doc.gender,
    enrolledDate: doc.enrolledDate,
    updatedAt: doc.updatedAt
  };
};

export const serializeSafetyEvent = (doc) => {
  if(!doc) return null;
  return {
    _id: doc._id,
    studyId: doc.studyId,
    siteId: doc.siteId,
    participantId: doc.participantId,
    eventType: doc.eventType,
    seriousness: doc.seriousness,
    severity: doc.severity,
    expectedness: doc.expectedness,
    status: doc.status,
    pvReviewStatus: doc.pvReviewStatus,
    createdAt: doc.createdAt
  };
};

export const serializeStudy = (doc) => {
  if(!doc) return null;
  return {
    _id: doc._id,
    protocolId: doc.protocolId,
    title: doc.title,
    phase: doc.phase,
    status: doc.status,
    targetParticipants: doc.targetParticipants,
    updatedAt: doc.updatedAt
  };
};

export const serializeVisit = (doc) => {
  if(!doc) return null;
  return {
    _id: doc._id,
    participantId: doc.participantId,
    studyId: doc.studyId,
    siteId: doc.siteId,
    visitName: doc.visitName,
    visitDate: doc.visitDate,
    status: doc.status
  };
};

export const serializeQuery = (doc) => {
  if(!doc) return null;
  return {
    _id: doc._id,
    studyId: doc.studyId,
    siteId: doc.siteId,
    participantId: doc.participantId,
    category: doc.category,
    status: doc.status,
    severity: doc.severity
  };
};

export const serializeRegulatory = (doc) => {
  if(!doc) return null;
  return {
    _id: doc._id,
    studyId: doc.studyId,
    type: doc.type,
    status: doc.status,
    dueDate: doc.dueDate
  };
};

export const serializeAlert = (doc) => {
  if(!doc) return null;
  return {
    _id: doc._id,
    type: doc.type,
    severity: doc.severity,
    status: doc.status,
    message: doc.message,
    studyId: doc.studyId
  };
};

export const serializeSite = (doc) => {
  if(!doc) return null;
  return {
    _id: doc._id,
    studyId: doc.studyId,
    name: doc.name,
    status: doc.status,
    targetEnrollment: doc.targetEnrollment
  };
};
