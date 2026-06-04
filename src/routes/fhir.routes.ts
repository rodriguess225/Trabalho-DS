import { Router } from 'express';
import { getObservationsFromFhir, getPatientsFromFhir, getConditionsFromFhir } from '../services/fhir.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

// GET /fhir/observations?code=8310-5&patient=123
router.get('/observations', authMiddleware, roleMiddleware(['UTENTE', 'MEDICO']), async (req, res) => {
  try {
    const code = typeof req.query.code === 'string' ? req.query.code : '8310-5';
    const patient = typeof req.query.patient === 'string' ? req.query.patient : undefined;

    const observations = await getObservationsFromFhir(code, patient);
    res.json(observations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao consultar Observações no servidor FHIR.' });
  }
});

// GET /fhir/patients?identifier=DS-0001
router.get('/patients', authMiddleware, roleMiddleware(['MEDICO', 'ADMIN', 'ADMINISTRADOR']), async (req, res) => {
  try {
    const identifier = typeof req.query.identifier === 'string' ? req.query.identifier : '';
    if (!identifier) {
      return res.status(400).json({ erro: 'O parâmetro query "identifier" é obrigatório.' });
    }

    const patients = await getPatientsFromFhir(identifier);
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao consultar Utente no servidor FHIR.' });
  }
});

// GET /fhir/conditions?patient=cfsb1778864462910
router.get('/conditions', authMiddleware, roleMiddleware(['UTENTE', 'MEDICO']), async (req, res) => {
  try {
    const patient = typeof req.query.patient === 'string' ? req.query.patient : '';
    if (!patient) {
      return res.status(400).json({ erro: 'O parâmetro query "patient" (ID de recurso FHIR) é obrigatório.' });
    }

    const code = typeof req.query.code === 'string' ? req.query.code : undefined;
    const conditions = await getConditionsFromFhir(patient, code);
    res.json(conditions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao consultar Condições no servidor FHIR.' });
  }
});

export default router;