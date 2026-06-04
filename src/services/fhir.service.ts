import { ObservationDTO } from '../dtos/fhir/observation/ObservationDTO';
import { PatientDTO } from '../dtos/fhir/patient/PatientDTO';
import { ConditionDTO } from '../dtos/fhir/condition/ConditionDTO';

import { mapObservation } from '../mappers/fhir-observation.mapper';
import { mapPatient } from '../mappers/fhir-patient.mapper';
import { mapCondition } from '../mappers/fhir-condition.mapper';

const FHIR_BASE_URL = 'https://fhir.hl7.pt/r5/fhir';

// 1. Obter Observações Clínicas (Ex: Temperatura, Sinais Vitais)
export async function getObservationsFromFhir(
  code: string = '8310-5',
  patient?: string
): Promise<ObservationDTO[]> {
  let url = `${FHIR_BASE_URL}/Observation?code=${encodeURIComponent(code)}`;
  if (patient) {
    url += `&subject=Patient/${patient}`;
  }

  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Erro FHIR Observation: ${resposta.status}`);

  const bundle = await resposta.json();
  return bundle.entry?.map((entry: any) => mapObservation(entry.resource)) || [];
}

// 2. Procurar Utente pelo Identificador (Ex: Número SNS ou ID de estudante DS-0001)
export async function getPatientsFromFhir(identifier: string): Promise<PatientDTO[]> {
  const url = `${FHIR_BASE_URL}/Patient?identifier=${encodeURIComponent(identifier)}`;

  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Erro FHIR Patient: ${resposta.status}`);

  const bundle = await resposta.json();
  return bundle.entry?.map((entry: any) => mapPatient(entry.resource)) || [];
}

// 3. Procurar Condições Crónicas (Ex: Histórico Clínico de Asma ou Rinite no SNS)
export async function getConditionsFromFhir(patientId: string, code?: string): Promise<ConditionDTO[]> {
  let url = `${FHIR_BASE_URL}/Condition?subject=Patient/${encodeURIComponent(patientId)}`;
  if (code) {
    url += `&code=${encodeURIComponent(code)}`;
  }

  const resposta = await fetch(url);
  if (!resposta.ok) throw new Error(`Erro FHIR Condition: ${resposta.status}`);

  const bundle = await resposta.json();
  return bundle.entry?.map((entry: any) => mapCondition(entry.resource)) || [];
}