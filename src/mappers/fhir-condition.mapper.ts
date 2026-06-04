import { ConditionDTO } from '../dtos/fhir/condition/ConditionDTO';

export function mapCondition(resource: any): ConditionDTO {
  return {
    id: resource.id || '',
    clinicalStatus: resource.clinicalStatus?.coding?.[0]?.code || '',
    verificationStatus: resource.verificationStatus?.coding?.[0]?.code || '',
    code: resource.code?.coding?.[0]?.code || '',
    display: resource.code?.coding?.[0]?.display || resource.code?.text || '',
    subject: resource.subject?.reference || '',
    recordedDate: resource.recordedDate || ''
  };
}