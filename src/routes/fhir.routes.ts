import { Router } from 'express';
import { getObservationsFromFhir } from '../services/fhir.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';

const router = Router();

// Protegido: Apenas UTENTE e MEDICO podem aceder
router.get('/observations', authMiddleware, requireRole('UTENTE', 'MEDICO'), async (req, res) => {
  try {
    const code = typeof req.query.code === 'string'
      ? req.query.code
      : '8310-5';

    const patient = typeof req.query.patient === 'string'
      ? req.query.patient
      : undefined;

    const observations = await getObservationsFromFhir(code, patient);

    res.json(observations);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      erro: 'Erro ao consultar servidor FHIR.'
    });
  }
});

export default router;