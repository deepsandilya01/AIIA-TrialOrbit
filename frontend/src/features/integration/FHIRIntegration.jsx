import React from 'react';
import { Database, Link2, ArrowRight, CheckCircle, ShieldCheck, Activity, Download } from 'lucide-react';
import Button from '../../components/common/Button';

const FHIRIntegration = () => {
  const fhirMappings = [
    { ctmsEntity: 'Participant (P-1024)', fhirResource: 'Patient', status: 'Mapped', lastSync: '10 mins ago' },
    { ctmsEntity: 'Site (S-01)', fhirResource: 'Organization', status: 'Mapped', lastSync: '2 hours ago' },
    { ctmsEntity: 'Study (AIIA-003)', fhirResource: 'ResearchStudy', status: 'Mapped', lastSync: '1 day ago' },
    { ctmsEntity: 'Visit (V-1024-01)', fhirResource: 'Encounter', status: 'Mapped', lastSync: '10 mins ago' },
    { ctmsEntity: 'Adverse Event (AE-102)', fhirResource: 'AdverseEvent', status: 'Pending Review', lastSync: '-' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">FHIR / ABDM Integration Node</h1>
          <p className="page-subtitle">Standardized clinical data exchange representation</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Download size={16} />}>Export HL7 Bundle</Button>
          <Button icon={<Link2 size={16} />}>Trigger Manual Sync</Button>
        </div>
      </div>

      <div className="card mb-6 bg-gradient-to-br from-primary-900 to-slate-900 text-white p-6 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
              <Database className="text-accent" />
              <h3 className="text-xl font-bold">CTMS MongoDB Core</h3>
            </div>
            <p className="text-sm text-primary-200">Canonical Source of Truth</p>
          </div>
          
          <div className="flex flex-col items-center">
            <span className="text-xs text-primary-300 mb-1">HL7 FHIR R4 Transformation</span>
            <div className="flex items-center gap-2">
              <div className="h-1 w-16 bg-accent rounded-full"></div>
              <ArrowRight className="text-accent" />
              <div className="h-1 w-16 bg-accent rounded-full"></div>
            </div>
            <span className="text-xs text-primary-300 mt-1">Validation Layer</span>
          </div>

          <div className="text-center md:text-right flex-1">
            <div className="flex items-center gap-3 mb-2 justify-center md:justify-end">
              <h3 className="text-xl font-bold">ABDM / External Node</h3>
              <Activity className="text-success" />
            </div>
            <p className="text-sm text-primary-200">FHIR Resource Bundle</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Real-Time FHIR Resource Mapping</h3>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>TrialOrbit Entity (NoSQL)</th>
                <th>HL7 FHIR Resource</th>
                <th>Mapping Status</th>
                <th>Last Synchronized</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {fhirMappings.map((map, idx) => (
                <tr key={idx}>
                  <td className="font-medium">{map.ctmsEntity}</td>
                  <td><code className="bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded text-sm text-primary">{map.fhirResource}</code></td>
                  <td>
                    {map.status === 'Mapped' ? (
                      <span className="badge badge-success flex items-center gap-1 w-max">
                        <CheckCircle size={12} /> {map.status}
                      </span>
                    ) : (
                      <span className="badge badge-warning flex items-center gap-1 w-max">
                        <ShieldCheck size={12} /> {map.status}
                      </span>
                    )}
                  </td>
                  <td className="text-sm text-secondary">{map.lastSync}</td>
                  <td className="text-right">
                    <Button variant="outline" size="sm">Inspect Payload</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FHIRIntegration;
