import { PatientDTO } from '../dtos/fhir/patient/PatientDTO';

export function mapPatient(resource: any): PatientDTO {
  const givenName = resource.name?.[0]?.given?.join(' ') || '';
  const familyName = resource.name?.[0]?.family || '';
  const textName = resource.name?.[0]?.text || `${givenName} ${familyName}`.trim();

  return {
    id: resource.id || '',
    identifier: resource.identifier?.[0]?.value || '',
    name: textName || 'Nome não especificado',
    gender: resource.gender || '',
    birthDate: resource.birthDate || ''
  };
}