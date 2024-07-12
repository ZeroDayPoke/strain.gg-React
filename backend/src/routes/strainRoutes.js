// ./routes/strainRoutes.js

import express from 'express';
import * as strainController from '../../controllers/StrainController.js';
import imageUpload from '../../utils/imageStorage.js';

const router = express.Router();

router.post('/', imageUpload, strainController.createStrain);
router.get('/', strainController.getStrains);
router.get('/:id', strainController.getStrainById);
router.put('/:id', imageUpload, strainController.updateStrain);
router.delete('/:id', strainController.deleteStrain);
router.post('/:strainId/stores/:storeId', strainController.addStoreToStrain);
router.delete('/:strainId/stores/:storeId', strainController.removeStoreFromStrain);

export default router;
