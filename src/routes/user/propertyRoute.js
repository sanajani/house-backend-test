import express from 'express';
import { allOfProperties, singleProperty } from '../../controllers/user/userPropertyController.js';

// app.use('/api/v1/properties', properties);
const router = express.Router();
router.get('/', allOfProperties)

router.get("/:propertyId", singleProperty)

export default router;
