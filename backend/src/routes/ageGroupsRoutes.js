import { Router } from 'express';
import { getAgeGroups } from '../controllers/ageGroupsController.js';

const router = Router();

router.get('/', getAgeGroups);

export default router;
