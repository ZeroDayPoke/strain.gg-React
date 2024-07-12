// ./routes/storeRoutes.js

import express from 'express';
import * as storeController from '../../controllers/StoreController.js';
import imageUpload from '../../utils/imageStorage.js';

const router = express.Router();

router.post('/', imageUpload, storeController.createStore);
router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreById);
router.put('/:id', imageUpload, storeController.updateStore);
router.delete('/:id', storeController.deleteStore);
router.post('/:storeId/strains/:strainId', storeController.addStrainToStore);
router.delete('/:storeId/strains/:strainId', storeController.removeStrainFromStore);

export default router;
